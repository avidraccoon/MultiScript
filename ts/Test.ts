
function run() {
  const parser = new CodeParser(undefined);
  const code_writer = new JavaScriptCodeGenerator(false);
  // @ts-ignore
  const program = document.getElementById("code").value;
  const ast = parser.parse(program);
  console.log(program);
  console.log(JSON.stringify(ast));
  const analyzer = new SemanticAnalyzer();
  analyzer.analyze(ast);
  // @ts-ignore
  console.log(analyzer.globalTable);
  const code = code_writer.generateCode(ast);
  console.log(code);
  if (document.getElementById("output") != null) {
    // @ts-ignore
    document.getElementById("output").value = code.code;
  }
}

function load(){
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
