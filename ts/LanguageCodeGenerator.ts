class LanguageCodeGenerator {
  protected generatedCode: string = "";
  protected customImplementationUsage: CustomImplementationUsage = new CustomImplementationUsage();
  protected customImplementations: string = "";
  protected indentation: number = 0;

  public constructor() {}

  public generateCode(parsed_code: Object): GeneratedCode{
    this.generatedCode = "";
    this.customImplementations = "";
    this.indentation = 0;
    this.handleWriting(parsed_code);
    return new GeneratedCode(this.customImplementations+this.generatedCode);
  }

  public increaseIndent(){
    this.indentation++;
  }

  public decreaseIndent(){
    this.indentation--;
  }

  public writeEndLine(){
    this.writeCode(";");
    this.newLine();
  }

  public handleWriting(code: any){
    console.log(code)
    switch (code.type) {
      case "Program":
        this.handleWriting(code.body);
        break;
      case "Lines":
        for (let line of code.body){
          this.handleWriting(line);
        }
        break;
      case "Line":
        this.handleWriting(code.statement);
        break;
      case "SINGLE_LINE_IF":
        this.writeSingleIf(code);
        break;
      case "MULTI_LINE_IF":
        this.writeIf(code);
        break;
      case "SINGLE_LINE_ELSE":
        this.writeSingleElse(code);
        break;
      case "MULTI_LINE_ELSE":
        this.writeElse(code);
        break;
      case "SINGLE_LINE_WHILE":
        this.writeSingleWhile(code);
        break;
      case "MULTI_LINE_WHILE":
        this.writeWhile(code);
        break;
      case "ExpressionStatement":
        this.handleWriting(code.expression);
        this.writeEndLine();
        break;
      case "BinaryExpression":
        this.handleWriting(code.left);
        switch (code.operator) {
          case "==":
            this.writeEquals()
            break;
          case "!=":
            this.writeNotEquals()
            break;
          case "<=":
            this.writeLessEquals()
            break;
          case ">=":
            this.writeGreaterEquals()
            break;
          case "<":
            this.writeLess()
            break;
          case ">":
            this.writeGreater()
            break;
          case "||":
            this.writeOr()
            break;
          case "&&":
            this.writeAnd()
            break;
          case "+":
            this.writePlus()
            break;
          case "-":
            this.writeMinus()
            break;
          case "*":
            this.writeMultiply()
            break;
          case "/":
            this.writeDivide()
            break;
        }
        this.handleWriting(code.right);
        break;
      case "Negate":
        this.writeNegate(code);
        break;
      case "NOT":
        this.writeNot(code);
        break;
      case "Parentheses":
        this.writeParentheses(code);
        break;
      case "FunctionDefinition":
        this.writeFunction(code);
        break;
      case "Variable":
      case "MemberAccess":
        this.handleVariable(code);
        break;
      case "NumericLiteral":
      case "StringLiteral":
        this.writeCode(code.value);
        break;
      case "VariableCreation":
        if (code.assignment){
          this.writeVariableCreationAndAssignment(code);
        }else{
          this.writeVariableCreation(code);
        }
        break;
      case "VariableAssignment":
        this.writeVariableAssignment(code);
        break;
    }
  }

  public handleVariable(code: Object){
    // @ts-ignore
    if (code.type == "MemberAccess") {
      this.writeMemberAccess(code);
      // @ts-ignore
      this.handleVaraible(code.member_access);
    }else{
      this.writeVariable(code);
    }
  }

  public writeVariable(code: Object){
    // @ts-ignore
    this.writeCode(`${code.value}`);
  }

  public writeMemberAccess(code: Object){
    // @ts-ignore
    this.writeCode(`${code.value}.`);
  }

  public writeEquals(){
    this.writeCode("==");
  }
  public writeNotEquals(){
    this.writeCode("!=");
  }
  public writeLessEquals(){
    this.writeCode("<=");
  }
  public writeGreaterEquals(){
    this.writeCode(">=");
  }
  public writeLess(){
    this.writeCode("<");
  }
  public writeGreater(){
    this.writeCode(">");
  }
  public writeAnd(){
    this.writeCode("&&");
  }
  public writeOr(){
    this.writeCode("||");
  }
  public writePlus(){
    this.writeCode("+");
  }
  public writeMinus(){
    this.writeCode("-");
  }
  public writeNegate(code: Object){
    this.writeMinus();
    // @ts-ignore
    this.handleWriting(code.inner);
  }
  public writeMultiply(){
    this.writeCode("*");
  }
  public writeDivide() {
    this.writeCode("/");
  }
  public writeParentheses(code: Object){
    this.writeCode("(");
    // @ts-ignore
    this.handleWriting(code.inner);
    this.writeCode(")");
  }
  public writeNot(code: Object){
    this.writeCode("!");
    // @ts-ignore
    this.handleWriting(code.inner);
  }
  public writeVariableCreation(code: Object){

  }
  public writeVariableAssignment(code: Object){

  }
  public writeVariableCreationAndAssignment(code: Object){

  }

  public writeCode(text: string): void{
    this.generatedCode += text;
  }

  public newLine(): void {
    this.writeCode("\n");
    for (let i = 0; i < this.indentation; i++) {
      this.writeCode("  ");
    }
  }

  public writeFunction(_function: any){

  }
  public writeIf(_if: any){

  }
  public writeSingleIf(_if: any){
    this.writeIf(_if);
  }
  public writeElse(_else: any){

  }
  public writeSingleElse(_else: any){
    this.writeElse(_else);
  }
  public writeWhile(_while: any){

  }
  public writeSingleWhile(_while: any){
    this.writeWhile(_while);
  }

  public useCustomImplementation(implementation: CustomImplementations): void{
    this.customImplementations += this.customImplementationUsage.useCustomImplemtation(implementation);
  }
}

class JavaScriptCodeGenerator extends LanguageCodeGenerator {


  public generateCode(parsed_code: Object): GeneratedCode {
    this.customImplementationUsage = new CustomImplementationUsage();
    return super.generateCode(parsed_code);
  }

  public writeFunction(_function: any){
    this.writeCode(`function ${_function.name}(`);
    for (let i = 0; i<_function.parameters.length; i++){
      const param = _function.parameters[i];
      if (i != 0){
        this.writeCode(", ");
      }
      this.writeCode(param.name);
    }
    //TODO handle parameters
    this.writeCode(") {");
    this.increaseIndent();
    this.newLine();
    this.handleWriting(_function.code);
    this.decreaseIndent();
    this.newLine();
    this.writeCode("}");
    this.newLine();
  }

  public writeVariableCreation(code: Object) {
    this.writeCode("let ");
    // @ts-ignore
    this.writeCode(code.declaration.name);
    this.writeEndLine();
  }

  public writeVariableAssignment(code: Object) {
    // @ts-ignore
    this.handleWriting(code.variable);
    this.writeCode(" = ");
    // @ts-ignore
    this.handleWriting(code.value);
  }

  public writeVariableCreationAndAssignment(code: Object){
    this.writeCode("let ");
    // @ts-ignore
    this.writeCode(code.declaration.name);
    this.writeCode(" = ");
    // @ts-ignore
    this.handleWriting(code.assignment);
  }
}

class GeneratedCode{

  public constructor(public code: string){
    this.code = code;
  }

}
