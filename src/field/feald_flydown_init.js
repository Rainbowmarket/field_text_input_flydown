'use strict';


import * as Blockly from 'blockly/core';
import { registerCss } from '../style/css.js';
import { Flydown } from '../field/flydown.js';

export class FieldFlydown {

    static init(workspace) {
        if (workspace.flydown_) {
            return; // Prevent duplicate initialization
        }

        const rendererName = workspace.getRenderer().getClassName();
        const themeName = workspace.getTheme().getClassName();
        const selector = `.${rendererName}.${themeName}`;
        registerCss(selector);

        const flydown = new Flydown(
            new Blockly.Options({
                scrollbars: false,
                rtl: workspace.RTL,
                renderer: workspace.options.renderer,
                rendererOverrides: workspace.options.rendererOverrides,
                parentWorkspace: workspace,
            })
        );

        workspace.getFlydown = function () {
            return this.flydown_;
        };
        
        workspace.flydown_ = flydown;
        Blockly.utils.dom.insertAfter(flydown.createDom('g'), workspace.svgBubbleCanvas_);
        flydown.init(workspace);
        flydown.autoClose = true;
    }

    static Flydown = Flydown;
}
