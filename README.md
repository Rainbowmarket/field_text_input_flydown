# field_text_input_flydown [![Built on Blockly](https://tinyurl.com/built-on-blockly)](https://github.com/google/blockly)
## Example Code

### Block Image

![A picture of a setter block](readme-media/Custom_Block.png "Setter")


### Javascript example block
```
const custom_text_input = {
  init: function() {
    this.appendDummyInput('input')
      .appendField('FieldTextInputWithFlydown')
      .appendField(new FieldTextInputWithFlydown('item'), 'TEXT');
    this.appendStatementInput('statement')
      .appendField('do');
    this.setTooltip('');
    this.setHelpUrl('');
    this.setColour(250);
  }
};
Blockly.common.defineBlocks({custom_text_input: custom_text_input});
```

### json example block
```
Blockly.defineBlocksWithJsonArray([
    {
      "type": "custom_text_input",
      "tooltip": "",
      "helpUrl": "",
      "message0": "FieldTextInputWithFlydown %1 %2 do %3",
      "args0": [
        {
          "type": "field_text_input_with_flydown",
          "name": "NAME",
          "text": "item"
        },
        {
          "type": "input_dummy",
          "name": "input"
        },
        {
          "type": "input_statement",
          "name": "statement"
        }
      ],
      "colour": 250
    }                    
]);
```
## Usage
_Please make sure that your app which includes this plugin uses a relatively recent version of Blockly.  As of this
writing that would be version 10.0.0._

You'll want to include something like the following in your app:

```js
...
const workspace = Blockly.inject(...);
...
FieldFlydown.init(workspace);
...
```