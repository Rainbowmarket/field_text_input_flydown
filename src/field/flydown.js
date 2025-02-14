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
  Blockly.Flyout.prototype.init.call(this, workspace, false);
  this.workspace_.setTheme(workspace.getTheme());

  const componentManager = workspace.getComponentManager();
  if (!componentManager.hasCapability(this.id, Blockly.ComponentManager.Capability.AUTOHIDEABLE)) {
      componentManager.addCapability(this.id, Blockly.ComponentManager.Capability.AUTOHIDEABLE);
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
  let flydownWidth = 0;
  let flydownHeight = 0;
  const margin = this.CORNER_RADIUS * scale;
  const blocks = this.workspace_.getTopBlocks(false);
  for (let i = 0, block; block = blocks[i]; i++) {
    const blockHW = block.getHeightWidth();
    flydownWidth = Math.max(flydownWidth, blockHW.width * scale);
    flydownHeight += blockHW.height * scale;
  }
  flydownWidth += 2 * margin + this.tabWidth_ * scale; 

  const rendererConstants = this.workspace_.getRenderer().getConstants();
  const startHatHeight = rendererConstants.ADD_START_HATS ?
      rendererConstants.START_HAT_HEIGHT : 0;
  flydownHeight += 3 * margin +
      margin * this.VERTICAL_SEPARATION_FACTOR * (blocks.length) +
      startHatHeight * scale / 2.0;
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

    this.width_ = flydownWidth;
    this.height_ = flydownHeight;
  }
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

  if (targetWorkspace.toolbox_ && !targetWorkspace.scrollbar) {
    xyNew.x += targetWorkspace.toolbox_.getWidth() / targetWorkspace.scale;
    xyNew.y += targetWorkspace.toolbox_.getHeight() / targetWorkspace.scale;
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

Flydown.prototype.autoHide = function() {
  this.hide();
};

