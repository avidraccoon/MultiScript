"use strict";
const parser = new CodeParser(undefined);
const program = `
function test(string name){

}
test("Hello");
`;
const ast = parser.parse(program);
console.log(program);
console.log(JSON.stringify(ast, null, 2));
