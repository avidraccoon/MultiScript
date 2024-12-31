
class SyntaxCode{

  public generateCode(codeGenerator: CodeGenerator){

  }

}

class Expression extends SyntaxCode{}


class Line extends SyntaxCode{
  private expression: Expression;

  constructor(expression: Expression) {
    super();
    this.expression = expression;
  }

  generateCode(codeGenerator: CodeGenerator){
    this.expression.generateCode(codeGenerator);
    codeGenerator.endLine();
  }

}

class CodeBlock extends SyntaxCode{
  private lines: Line[] = [];

  public constructor() {
    super();
  }

  public addLine(line: Line){
    this.lines.push(line);
  }

  generateCode(codeGenerator: CodeGenerator){
    for (let line of this.lines) {
      line.generateCode(codeGenerator);
    }
  }

}
