"use strict";
const parser = new CodeParser(undefined);
const code_writer = new JavaScriptCodeGenerator();
const program = `
function add(int a, int b){
  a + b;
}
`;
const ast = parser.parse(program);
console.log(program);
console.log(JSON.stringify(ast, null, 2));
const code = code_writer.generateCode(ast);
console.log(code);
if (document.getElementById("code") != null) {
    // @ts-ignore
    document.getElementById("code").value = code.code;
}
