//index.js
// Ensure FieldFlydown and FieldTextInputWithFlydown are properly defined
if (typeof FieldTextInputWithFlydown === "undefined") {
    console.warn("FieldTextInputWithFlydown is not defined!");
}
if (typeof FieldFlydown === "undefined") {
    console.warn("FieldFlydown is not defined!");
}

// Define a custom block
const example_call = {
    init: function () {
        this.appendDummyInput('input')
            .appendField(new Blockly.FieldTextInput('default'), 'NAME')
            .appendField(new FieldTextInputWithFlydown('item'), 'var'); // Ensure it's defined
        this.appendStatementInput('statement')
            .appendField('do');
        this.setTooltip('');
        this.setHelpUrl('');
        this.setColour(230);
    }
};

// Register block definition
Blockly.common.defineBlocks({ example_call: example_call });

// Initialize Blockly workspace
const workspace = Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox'),
    renderer: 'geras',
    trashcan: true
});
console.log("workspace",workspace);

// Ensure FieldFlydown is initialized
if (typeof FieldFlydown !== "undefined" && FieldFlydown.init) {
    FieldFlydown.init(workspace);
} else {
    console.warn("FieldFlydown is missing or not initialized.");
}

// JavaScript code generator for the block
Blockly.JavaScript['example_call'] = function (block) {
    const text_name = block.getFieldValue('NAME'); // Retrieve NAME field
    const variable_var = Blockly.JavaScript.variableDB_.getName(
        block.getFieldValue('var'), Blockly.VARIABLE_CATEGORY_NAME
    );

    const statement_statement = Blockly.JavaScript.statementToCode(block, 'statement');

    // Correct JavaScript function syntax
    const code = `function ${text_name}(${variable_var}) {\n${statement_statement}}\n`;

    return code;
};

// Run generated JavaScript code
function runCode() {
    const code = Blockly.JavaScript.workspaceToCode(workspace);
    document.getElementById('output').innerText = code;

    try {
        eval(code); // Execute generated code
    } catch (e) {
        console.error("Execution Error: ", e);
        document.getElementById('output').innerText = "Error: " + e.message;
    }
}
