'use strict';

import * as Blockly from 'blockly/core';
import {FieldTextInputWithFlydown} from './field_input_flydown_block.js';

export class Flydown extends Blockly.VerticalFlyout {
  constructor(workspaceOptions) {
    super(workspaceOptions);
    this.dragAngleRange_ = 360;
  }
};

Flydown.prototype.previousCSSClassName_ = '';

Flydown.prototype.VERTICAL_SEPARATION_FACTOR = 1;

Flydown.prototype.createDom = function(cssClassName) {

  this.previousCSSClassName_ = cssClassName; 
  this.svgGroup_ =
      Blockly.utils.dom.createSvgElement('g', {'class': cssClassName}, null);
  this.svgBackground_ =
      Blockly.utils.dom.createSvgElement('path', {}, this.svgGroup_);
  this.svgGroup_.appendChild(this.workspace_.createDom());
  return this.svgGroup_;
};

Flydown.prototype.setCSSClass = function(newCSSClassName) {
  if (newCSSClassName !== this.previousCSSClassName_) {
    Blockly.utils.dom.removeClass(this.svgGroup_, this.previousCSSClassName_);
    Blockly.utils.dom.addClass(this.svgGroup_, newCSSClassName);
    this.previousCSSClassName_ = newCSSClassName;
  }
};

Flydown.prototype.init = function(workspace) {
  // v13 Flyout.init(targetWorkspace) takes one argument. The second `false`
  // previously passed here was already ignored on Blockly 12.
  Blockly.Flyout.prototype.init.call(this, workspace);
  this.workspace_.setTheme(workspace.getTheme());

  const componentManager = workspace.getComponentManager();
  if (!componentManager.hasCapability(this.id, Blockly.ComponentManager.Capability.AUTOHIDEABLE)) {
      componentManager.addCapability(this.id, Blockly.ComponentManager.Capability.AUTOHIDEABLE);
  }

  // v12 Flyout.createBlock hid autoclosing flyouts when a block was copied
  // out. v13 moved copy into BlockDragStrategy and no longer calls hide().
  // Restore that dismiss so a drag from the flydown still closes it.
  if (!this.blockCreateHideWrapper_) {
    this.blockCreateHideWrapper_ = (event) => {
      if (!this.autoClose || !this.isVisible()) {
        return;
      }
      if (event.type === Blockly.Events.BLOCK_CREATE) {
        this.hide();
      }
    };
    workspace.addChangeListener(this.blockCreateHideWrapper_);
  }
};


Flydown.prototype.position = function() {
  return;
};

Flydown.prototype.showAt = function(xmlList, x, y) {
  Blockly.Events.disable();
  try {

    this.show(xmlList);
  } finally {
    Blockly.Events.enable();
  }

  const margin = this.CORNER_RADIUS * this.workspace_.scale;
  const edgeWidth = this.width_ - 2 * margin;
  const edgeHeight = this.height_ - 2 * margin;
  const path = ['M 0,' + margin];
  path.push('a', margin, margin, 0, 0, 1, margin, -margin); 
  path.push('h', edgeWidth); 
  path.push('a', margin, margin, 0, 0, 1, margin, margin); 
  path.push('v', edgeHeight); 
  path.push('a', margin, margin, 0, 0, 1, -margin, margin); 
  path.push('h', -edgeWidth); 
  path.push('a', margin, margin, 0, 0, 1, -margin, -margin); 
  path.push('z'); 
  this.svgBackground_.setAttribute('d', path.join(' '));
  this.svgGroup_.setAttribute('transform', 'translate(' + x + ', ' + y + ')');
};

Flydown.prototype.reflow = function() {
  this.workspace_.scale = this.targetWorkspace.scale;
  const scale = this.workspace_.scale;
  const margin = this.CORNER_RADIUS * scale;
  const blocks = this.workspace_.getTopBlocks(false);

  // Use top blocks only. getContents() includes gap separators whose y=0
  // would collapse the top inset and throw off even padding.
  let minTop = Infinity;
  let maxVisualBottom = 0;
  let maxRight = 0;
  for (let i = 0, block; block = blocks[i]; i++) {
    const xy = block.getRelativeToSurfaceXY();
    const hw = block.getHeightWidth();
    minTop = Math.min(minTop, xy.y);
    maxVisualBottom = Math.max(maxVisualBottom, xy.y + hw.height);
    if (block.getBoundingRectangle) {
      maxRight = Math.max(maxRight, block.getBoundingRectangle().right);
    } else {
      maxRight = Math.max(maxRight, xy.x + hw.width);
    }
  }
  if (minTop === Infinity) {
    minTop = this.CORNER_RADIUS;
  }

  const flydownWidth = maxRight * scale + margin;
  const flydownHeight = maxVisualBottom * scale + minTop * scale;

  if (this.width_ != flydownWidth) {
    for (let j = 0, block; block = blocks[j]; j++) {
      const blockHW = block.getHeightWidth();
      const blockXY = block.getRelativeToSurfaceXY();
      if (this.RTL) {

        const dx = flydownWidth - margin - scale * (this.tabWidth_ - blockXY.x);
        block.moveBy(dx, 0);
        blockXY.x += dx;
      }
      if (block.flyoutRect_) {
        block.flyoutRect_.setAttribute('width', blockHW.width);
        block.flyoutRect_.setAttribute('height', blockHW.height);
        block.flyoutRect_.setAttribute('x',
            this.RTL ? blockXY.x - blockHW.width : blockXY.x);
        block.flyoutRect_.setAttribute('y', blockXY.y);
      }
    }
  }

  this.width_ = flydownWidth;
  this.height_ = flydownHeight;
};

Flydown.prototype.onMouseMove_ = function(e) {

  return;
};

Flydown.prototype.placeNewBlock_ = function(originBlock) {
  const targetWorkspace = this.targetWorkspace;
  const svgRootOld = originBlock.getSvgRoot();
  if (!svgRootOld) {
    throw Error('originBlock is not rendered.');
  }

  let scale = this.workspace_.scale;

  const xyOld = this.workspace_.getSvgXY(svgRootOld);

  const scrollX = xyOld.x;
  xyOld.x += scrollX / targetWorkspace.scale - scrollX;

  const scrollY = xyOld.y;
  scale = targetWorkspace.scale;
  xyOld.y += scrollY / scale - scrollY;

  const xml = Blockly.Xml.blockToDom(originBlock);
  const block = Blockly.Xml.domToBlock(xml, targetWorkspace);
  const svgRootNew = block.getSvgRoot();
  if (!svgRootNew) {
    throw Error('block is not rendered.');
  }

  const xyNew = targetWorkspace.getSvgXY(svgRootNew);

  xyNew.x +=
      targetWorkspace.scrollX / targetWorkspace.scale - targetWorkspace.scrollX;
  xyNew.y +=
      targetWorkspace.scrollY / targetWorkspace.scale - targetWorkspace.scrollY;

  const toolbox = typeof targetWorkspace.getToolbox === 'function' ?
      targetWorkspace.getToolbox() : targetWorkspace.toolbox_;
  if (toolbox && !targetWorkspace.scrollbar) {
    xyNew.x += toolbox.getWidth() / targetWorkspace.scale;
    xyNew.y += toolbox.getHeight() / targetWorkspace.scale;
  }

  block.moveBy(xyOld.x - xyNew.x, xyOld.y - xyNew.y);
  return block;
};

Flydown.prototype.shouldHide = true;

Flydown.prototype.hide = function() {
  if (this.shouldHide) {
    Blockly.Flyout.prototype.hide.call(this);
    FieldTextInputWithFlydown.openFieldFlydown_ = null;
  }
  this.shouldHide = true;
};

Flydown.prototype.autoHide = function(_onlyClosePopups) {
  // Always hide this flydown. Core's Flyout.autoHide only closes the workspace
  // toolbox flyout (`getFlyout(true) === this`). This instance is a field
  // popup, so hideChaff must still dismiss it — including when
  // onlyClosePopups is true, which matches 2.0.0 behavior.
  this.hide();
};

