const context = new CodeContext();
const output = new ElementOutput("output");
context.setOutput(output);
// let test;
// test = 3 * 4;
// while (test){
//   console.log(test);
//   test -= 1;
// }
// console.log(test);

const value1 = new ValueStatement(3);
const value2 = new ValueStatement(4);
const value3 = new ValueStatement(1);

const createVariable = new VariableCreation("test");

const multiplication = new MultiplicationStatement(value1, value2);
const variable = new VariableAssignment("test", multiplication);

const whileLoopCodeBlock = new CodeBlock();
const whileVariableValue = new VariableStatement("test");
const whileLoopPrint = new PrintLine(whileVariableValue);
const subtractVariable = new SubtractionStatement(whileVariableValue, value3);
const whileLoopVariable = new VariableAssignment("test", subtractVariable);
whileLoopCodeBlock.addLine(whileLoopPrint);
whileLoopCodeBlock.addLine(whileLoopVariable);

const variableValue = new VariableStatement("test");
const whileLoop = new WhileStatement(variableValue, whileLoopCodeBlock);

const endVariableValue = new VariableStatement("test");
const endValuePrint = new PrintLine(endVariableValue);

const codeBlock = new CodeBlock();
codeBlock.addLine(createVariable);
codeBlock.addLine(variable);
codeBlock.addLine(whileLoop)
codeBlock.addLine(endValuePrint);

//codeBlock.execute(context);
//console.log(context.getVariable("test"));

document.getElementById("code").value ="var a;\na = 1;\nvar b = 4;\nprintln a+b"
