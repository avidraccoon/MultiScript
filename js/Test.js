"use strict";
function run() {
    var _a;
    const parser = new CodeParser(undefined);
    let value = (_a = document.getElementById("langauge")) === null || _a === void 0 ? void 0 : _a.value;
    let code_writer;
    if (value == "Javascript") {
        code_writer = new JavaScriptCodeGenerator(false);
    }
    else if (value == "Python") {
        code_writer = new PythonCodeGenerator();
    }
    else {
        code_writer = new CCodeGenerator();
    }
    // @ts-ignore
    const program = document.getElementById("code").value;
    const ast = parser.parse(program);
    //console.log(program);
    //console.log(JSON.stringify(ast));
    //const analyzer = new SemanticAnalyzer();
    //analyzer.analyze(ast);
    // @ts-ignore
    //console.log(analyzer.globalTable);
    const code = code_writer.generateCode(ast);
    //console.log(code);
    if (document.getElementById("output") != null) {
        // @ts-ignore
        document.getElementById("output").value = code.code;
    }
}
function load() {
    // @ts-ignore
    document.getElementById("run").onclick = run;
    // @ts-ignore
    document.getElementById("code").value = `
var int test;
test = 10;
func int add(int a, int b){
  return a + b;
}
a(3, 2);`;
}
// @ts-ignore
document.body.onload = load;
