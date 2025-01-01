
class SyntaxCode{

  public generateCode(codeGenerator: LanguageCodeGenerator){

  }

}

class Expression extends SyntaxCode{}


class Line extends SyntaxCode{
  private expression: Expression;

  constructor(expression: Expression) {
    super();
    this.expression = expression;
  }

  generateCode(codeGenerator: LanguageCodeGenerator){
    this.expression.generateCode(codeGenerator);
    //codeGenerator.endLine();
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

  generateCode(codeGenerator: LanguageCodeGenerator){
    for (let line of this.lines) {
      line.generateCode(codeGenerator);
    }
  }

}
