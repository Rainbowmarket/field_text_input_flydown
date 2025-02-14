import { FieldTextInputWithFlydown } from './field/field_input_flydown_block.js';
import { FieldFlydown } from './field/feald_flydown_init.js';

FieldTextInputWithFlydown.prototype.fieldCSSClassName = 'blocklyFieldFlydownField';
FieldTextInputWithFlydown.prototype.flyoutCSSClassName = 'blocklyFieldFlydownFlydown';

if (!Blockly.registry.hasItem(Blockly.registry.Type.FIELD, 'field_text_input_with_flydown')) {
  Blockly.registry.register(
    Blockly.registry.Type.FIELD,
    'field_text_input_with_flydown',
    FieldTextInputWithFlydown
  );
} else {
  console.warn('Field "field_text_input_with_flydown" is already registered.');
}

export { FieldTextInputWithFlydown, FieldFlydown };