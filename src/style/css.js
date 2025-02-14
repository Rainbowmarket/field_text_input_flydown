'use strict';

const cssNode = document.createElement('style');
document.head.appendChild(cssNode);

export function registerCss(selector) {
  cssNode.textContent = `
  ${selector}  .blocklyFieldFlydownFlydown > path {
    fill: var(--flydown-bg-color) !important;
    fill-opacity: 0.5;
    stroke: var(--flydown-bg-color) !important;
    stroke-width: 4;
  }
  .blocklyFieldFlydownFlydown > path {
    fill: var(--flydown-bg-color) !important;
    fill-opacity: 0.5;
    stroke: var(--flydown-bg-color) !important;
    stroke-width: 4;
  }
  `;
}