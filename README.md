# field_text_input_flydown [![Built on Blockly](https://tinyurl.com/built-on-blockly)](https://github.com/google/blockly)

A custom Blockly field that provides a text input with a flydown menu.

## 🚀 Installation
To install this library, run the following command:
```sh
npm i @rainbowmarket/field-text-input-flydown
```

## 📌 Usage

### 1️⃣ Import the Library

#### ES Modules (Recommended)
```js
import { FieldTextInputWithFlydown, FieldFlydown } from 'field_text_input_flydown';
```

#### CommonJS (Node.js)
```js
const { FieldTextInputWithFlydown, FieldFlydown } = require('field_text_input_flydown');
```

### 2️⃣ Define a Custom Block
You can define a block using either JavaScript or JSON.

#### JavaScript Example
```js
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
Blockly.common.defineBlocks({ custom_text_input: custom_text_input });
```

#### JSON Example
```js
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

### 3️⃣ Initialize Blockly with the Custom Field
After defining the block, inject Blockly and initialize your custom field:
```js
const workspace = Blockly.inject('blocklyDiv', {
  toolbox: document.getElementById('toolbox')
});
FieldFlydown.init(workspace);
```

## 📷 Example Block Image
![Custom Block](readme-media/Custom_Block.png "Block")

## 🔧 Compatibility
Ensure that your Blockly version is **10.0.0 or later** for full compatibility.

## 🤝 Contributing
Feel free to fork the repository and submit pull requests with improvements!

## 📜 License
This project is licensed under the [MIT License](LICENSE).

