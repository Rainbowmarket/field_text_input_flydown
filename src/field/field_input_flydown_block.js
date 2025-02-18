'use strict';

import * as Blockly from 'blockly/core';

export class FieldTextInputWithFlydown extends Blockly.FieldTextInput {
    static timeout = 500;
    static showPid_ = 0;
    static openFieldFlydown_ = null;
    static DISPLAY_BELOW = 'BELOW';
    static DISPLAY_RIGHT = 'RIGHT';
    static DISPLAY_LOCATION = FieldTextInputWithFlydown.DISPLAY_BELOW;

    constructor(name, xmlData, opt_displayLocation) {
        super(name);
        this.EDITABLE = true;
        this.displayLocation = opt_displayLocation || FieldTextInputWithFlydown.DISPLAY_RIGHT;
        this.xmlData = xmlData || '';
    }

    init(block) {
        super.init(block);
        Blockly.utils.dom.addClass(this.fieldGroup_, this.fieldCSSClassName);

        this.mouseOverWrapper_ = Blockly.browserEvents.bind(
            this.fieldGroup_, 'mouseover', this, this.onMouseOver_
        );
        this.mouseOutWrapper_ = Blockly.browserEvents.bind(
            this.fieldGroup_, 'mouseout', this, this.onMouseOut_
        );
    }

    onMouseOver_(e) {
        if (!this.sourceBlock_.isInFlyout && FieldTextInputWithFlydown.showPid_ == 0) {
            FieldTextInputWithFlydown.showPid_ = window.setTimeout(
                this.showFlydownMaker_(),
                FieldTextInputWithFlydown.timeout
            );
        }
        e.stopPropagation();
    }

    onMouseOut_(e) {
        window.clearTimeout(FieldTextInputWithFlydown.showPid_);
        FieldTextInputWithFlydown.showPid_ = 0;
        e.stopPropagation();
    }

    showFlydownMaker_() {
        const field = this;
        return function () {
            if (FieldTextInputWithFlydown.showPid_ !== 0 &&
                !field.getSourceBlock().workspace.isDragging() &&
                !field.htmlInput_) {
                try {
                    field.showFlydown_();
                } catch (e) {
                    console.error('Failed to show flydown', e);
                }
            }
            FieldTextInputWithFlydown.showPid_ = 0;
        };
    }

    showFlydown_() {
        const workspace = Blockly.common.getMainWorkspace();
        if (!workspace) {
            console.error("Main workspace is not available!");
            return;
        }

        workspace.hideChaff();
        
        const flydown = workspace.getFlydown();
        if (!flydown || !flydown.svgGroup_) {
            console.error("Flydown or its SVG group is not properly initialized!");
            return;
        }
    
        Blockly.common.getMainWorkspace().getParentSvg().appendChild(flydown.svgGroup_);
    
        const scale = flydown.targetWorkspace.scale;
        flydown.workspace_.setScale(scale);
    
        flydown.setCSSClass(this.flyoutCSSClassName);

        const parentBlock = this.getSourceBlock().getParent();
        const blockColor = parentBlock ? parentBlock.getColour() : this.getSourceBlock().getColour();
        document.documentElement.style.setProperty('--flydown-bg-color', blockColor);
            
        const blocksXMLText = this.flydownBlocksXML_();
        const blocksDom = Blockly.utils.xml.textToDom(blocksXMLText);
        const blocksXMLList = blocksDom.children;
    
        const xy = Blockly.common.getMainWorkspace().getSvgXY(this.borderRect_);
        const borderBBox = this.borderRect_.getBBox();
    
        xy.y += borderBBox.height * scale + 5;
    
        flydown.field_ = this;
        flydown.showAt(blocksXMLList, xy.x, xy.y);
        FieldTextInputWithFlydown.openFieldFlydown_ = this;
    }
    
    flydownBlocksXML_() {
        const name = this.getText() || 'default';
        
        if (this.xmlData) {
            try {
                return this.xmlData.replace(/{{text}}/g, name);
            } catch (e) {
                console.error('Error processing XML template:', e);
                return this.getDefaultXML_(name);
            }
        }
        
        return this.getDefaultXML_(name);
    }
    
    getDefaultXML_(name) {
        return `
            <xml>
                <block type="variables_get">
                    <field name="VAR">${name}</field>
                </block>
                <block type="variables_set">
                    <field name="VAR">${name}</field>
                </block>
            </xml>
        `;
    }

    static hide() {
        window.clearTimeout(FieldTextInputWithFlydown.showPid_);
        const flydown = Blockly.common.getMainWorkspace().getFlydown();
        if (flydown) {
            flydown.hide();
        }
    }

    dispose() {
        // Current implementation
        if (FieldTextInputWithFlydown.openFieldFlydown_ == this) {
            FieldTextInputWithFlydown.hide();
        }
        super.dispose();
        
        // Should also clean up event listeners:
        if (this.mouseOverWrapper_) {
            Blockly.browserEvents.unbind(this.mouseOverWrapper_);
            this.mouseOverWrapper_ = null;
        }
        if (this.mouseOutWrapper_) {
            Blockly.browserEvents.unbind(this.mouseOutWrapper_);
            this.mouseOutWrapper_ = null;
        }
    }
}
