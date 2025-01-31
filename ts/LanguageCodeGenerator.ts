//TODO write documentation

class LanguageCodeGenerator {
  protected generatedCode: string = "";
  // @ts-ignore
  protected customImplementationUsage: CustomImplementationUsage = new CustomImplementationUsage(undefined);
  protected customImplementations: string = "";
  protected indentation: number = 0;
  protected start_identation: number = 2;
  protected writeToGlobal: boolean = true
  protected writeToClass: boolean = true
  protected writeToFunction: boolean = true
  protected mainClass: string = "class Main {\n  ";
  protected mainFunction: string = "  void main(){\n    ";
  protected inMainClass: boolean = true;
  protected inMainFunction: boolean = true;
  protected _function: string = "";
  protected _class: string = "";
  protected _end: string = " \n  }\n}";
  protected language: string = "none";

  public constructor() {

  }

  public startFunction(){
    this.writeToFunction = true;
    if (this.inMainFunction){
      this.indentation = this.start_identation-1;
    }
    this.inMainFunction = false;
  }

  public endFunction(){
    this.writeToFunction = false;
    this.writeCode(this._function);
    this._function = "";
    if (this.writeToClass){
      this.writeToFunction = true;
    }
    if (this.inMainClass){
      this.writeToFunction = true;
      this.inMainFunction = true;
      this.indentation = this.start_identation;
    }
  }

  public generateCode(parsed_code: Object): GeneratedCode{
    this.generatedCode = "";
    this.customImplementations = "";
    this.indentation = this.start_identation;
    this.handleWriting(parsed_code);
    this.generatedCode+=this.mainClass+"\n"+this.mainFunction+this._end;
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
      case "Target":
        if (this.language == code.target) this.handleWriting(code.line);
        break;
      case "Program":
        this.handleWriting(code.body);
        break;
      case "Lines":
        for (let line of code.body){
          console.log(line);
          this.handleWriting(line);
        }
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
        switch (code.operator) {
          case "==":
            this.writeEquals(code)
            break;
          case "!=":
            this.writeNotEquals(code)
            break;
          case "<=":
            this.writeLessEquals(code)
            break;
          case ">=":
            this.writeGreaterEquals(code)
            break;
          case "<":
            this.writeLess(code)
            break;
          case ">":
            this.writeGreater(code)
            break;
          case "||":
            this.writeOr(code)
            break;
          case "&&":
            this.writeAnd(code)
            break;
          case "+":
            this.writePlus(code)
            break;
          case "-":
            this.writeMinus(code)
            break;
          case "*":
            this.writeMultiply(code)
            break;
          case "/":
            this.writeDivide(code)
            break;
        }
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
        this.startFunction();
        this.writeFunction(code);
        this.endFunction();
        break;
      case "Variable":
      case "MemberAccess":
        this.handleVariable(code);
        break;
      case "IntegerLiteral":
      case "FloatLiteral":
        this.writeCode(code.value);
        break;
      case "BooleanLiteral":
        this.writeBoolean(code);
        break;
      case "StringLiteral":
        this.writeString(code);
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
      case "Return":
        this.writeReturn(code);
        break;
      case "FunctionCall":
        this.writeFunctionCall(code);
        break;
      case "Print":
        this.writePrint(code);
        break;
      case "Println":
        this.writePrintln(code);
        break;
    }
  }

  public writeBoolean(code: Object) {
    if (code.value){
      this.writeCode("true");
    }else{
      this.writeCode("false");
    }
  }

  public writeString(code: Object) {
    this.writeCode(`"${code.value}"`)
  }

  public writePrint(code: Object){

  }

  public writePrintln(code: Object) {

  }

  public writeFunctionCall(code: Object){
    this.writeVariable(code.variable);
    console.log(code)
    this.writeCode("(");
    for (let i = 0; i<code.parameters.length; i++){
      const param = code.parameters[i];
      if (i != 0){
        this.writeCode(", ");
      }
      this.handleWriting(param);
    }
    this.writeCode(")")
  }

  public writeReturn(code: Object){
    this.writeCode("return ");
    // @ts-ignore
    if (code.value){
      // @ts-ignore
      this.handleWriting(code.value);
    }else{
      this.writeEndLine();
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

  public writeEquals(code: Object){
    // @ts-ignore
    this.handleWriting(code.left);
    this.writeCode("==");
    // @ts-ignore
    this.handleWriting(code.right);
  }
  public writeNotEquals(code: Object){
    // @ts-ignore
    this.handleWriting(code.left);
    this.writeCode("!=");
    // @ts-ignore
    this.handleWriting(code.right);
  }
  public writeLessEquals(code: Object){
    // @ts-ignore
    this.handleWriting(code.left);
    this.writeCode("<=");
    // @ts-ignore
    this.handleWriting(code.right);
  }
  public writeGreaterEquals(code: Object){
    // @ts-ignore
    this.handleWriting(code.left);
    this.writeCode(">=");
    // @ts-ignore
    this.handleWriting(code.right);
  }
  public writeLess(code: Object){
    // @ts-ignore
    this.handleWriting(code.left);
    this.writeCode("<");
    // @ts-ignore
    this.handleWriting(code.right);
  }
  public writeGreater(code: Object){
    // @ts-ignore
    this.handleWriting(code.left);
    this.writeCode(">");
    // @ts-ignore
    this.handleWriting(code.right);
  }
  public writeAnd(code: Object){
    // @ts-ignore
    this.handleWriting(code.left);
    this.writeCode("&&");
    // @ts-ignore
    this.handleWriting(code.right);
  }
  public writeOr(code: Object){
    // @ts-ignore
    this.handleWriting(code.left);
    this.writeCode("||");
    // @ts-ignore
    this.handleWriting(code.right);
  }
  public writePlus(code: Object){
    // @ts-ignore
    this.handleWriting(code.left);
    this.writeCode("+");
    // @ts-ignore
    this.handleWriting(code.right);
  }
  public writeMinus(code: Object){
    // @ts-ignore
    this.handleWriting(code.left);
    this.writeCode("-");
    // @ts-ignore
    this.handleWriting(code.right);
  }
  public writeNegate(code: Object){
    this.writeCode("-");
    // @ts-ignore
    this.handleWriting(code.inner);
    // @ts-ignore
    this.handleWriting(code.right);
  }
  public writeMultiply(code: Object){
    // @ts-ignore
    this.handleWriting(code.left);
    this.writeCode("*");
    // @ts-ignore
    this.handleWriting(code.right);
  }
  public writeDivide(code: Object) {
    // @ts-ignore
    this.handleWriting(code.left);
    this.writeCode("/");
    // @ts-ignore
    this.handleWriting(code.right);
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
    if (this.inMainFunction){
      this.mainFunction += text;
    }else if (this.inMainClass) {
      this.mainClass += text;
    }else if (this.writeToFunction){
      this._function += text;
    }else if (this.writeToClass){
      this._class += text;
    }else if (this.writeToGlobal){
      this.generatedCode += text;
    }else{
      this.generatedCode += text;
    }
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
  private _useFixesForWeirdness: boolean;

  constructor(useFixesForWeirdness: boolean = true) {
    super();
    this._useFixesForWeirdness = useFixesForWeirdness;
    this.mainFunction = "  function main(){\n    "
    this.language = "javascript"
  }

  public generateCode(parsed_code: Object): GeneratedCode {
    this.customImplementationUsage = new CustomImplementationUsage(JavaScriptCustomImplementationsCode);
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

  public writePlus(code: Object){
    if (this._useFixesForWeirdness) {
      this.useCustomImplementation(JavaScriptCustomImplementations.ADDITION);
      this.writeCode("fixed_javascript_add(");
      // @ts-ignore
      this.handleWriting(code.left);
      this.writeCode(", ");
      // @ts-ignore
      this.handleWriting(code.right);
      this.writeCode(")");
    }else{
      super.writePlus(code);
    }
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

  public writeComment(message:string){
    this.writeCode("//" + message);
    this.writeEndLine();
  }

  public writePrint(code: Object) {
    this.writeComment("Print without new line not possible in Browser JavaScript");
    this.writePrintln(code)
  }

  public writePrintln(code: Object) {
    this.writeCode("console.log(");
    this.handleWriting(code.value);
    this.writeCode(")");
    this.writeEndLine();
  }

  public writeWhile(_while: any) {
    this.writeCode("while ");
    this.handleWriting(_while.condition);
    this.writeCode(" {");
    this.increaseIndent();
    this.newLine();
    this.handleWriting(_while.body);
    this.decreaseIndent();
    this.newLine();
    this.writeCode("}");
    this.newLine();
  }

  public writeIf(_if: any) {
    this.writeCode("if ");
    this.handleWriting(_if.condition);
    this.writeCode(" {");
    this.increaseIndent();
    this.newLine();
    this.handleWriting(_if.body);
    this.decreaseIndent();
    this.newLine();
    this.writeCode("}");
    this.newLine();
  }
}

class PythonCodeGenerator extends LanguageCodeGenerator {

  constructor() {
    super();
    this.mainClass = "class Main:\n  "
    this.mainFunction = "  def main():\n    "
    this._end = ""
    this.language = "python"
  }

  public generateCode(parsed_code: Object): GeneratedCode {
    return super.generateCode(parsed_code);
  }

  public writeEndLine(){
    this.newLine();
  }

  public writeFunction(_function: any){
    this.writeCode(`def ${_function.name}(`);
    for (let i = 0; i<_function.parameters.length; i++){
      const param = _function.parameters[i];
      if (i != 0){
        this.writeCode(", ");
      }
      this.writeCode(param.name);
    }
    //TODO handle parameters
    this.writeCode("):");
    this.increaseIndent();
    this.newLine();
    this.handleWriting(_function.code);
    this.decreaseIndent();
    this.newLine();
  }

  public writePlus(code: Object){
    super.writePlus(code);
  }

  public writeVariableCreation(code: Object) {
    // @ts-ignore
    this.writeCode(code.declaration.name);
    this.writeCode(" = None");
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
    // @ts-ignore
    this.writeCode(code.declaration.name);
    this.writeCode(" = ");
    // @ts-ignore
    this.handleWriting(code.assignment);
  }

  public writeComment(message:string){
    this.writeCode("#" + message);
    this.writeEndLine();
  }

  public writePrint(code: Object) {
    this.writeCode("print(");
    this.handleWriting(code.value);
    this.writeCode(", end = '')");
    this.writeEndLine();
  }

  public writePrintln(code: Object) {
    this.writeCode("print(");
    this.handleWriting(code.value);
    this.writeCode(")");
    this.writeEndLine();
  }

  public writeWhile(_while: any) {
    this.writeCode("while ");
    this.handleWriting(_while.condition);
    this.writeCode(":");
    this.increaseIndent();
    this.newLine();
    this.handleWriting(_while.body);
    this.decreaseIndent();
    this.newLine();
  }

  public writeIf(_if: any) {
    this.writeCode("if ");
    this.handleWriting(_if.condition);
    this.writeCode(":");
    this.increaseIndent();
    this.newLine();
    this.handleWriting(_if.body);
    this.decreaseIndent();
    this.newLine();
  }
}

class CCodeGenerator extends LanguageCodeGenerator {

  constructor() {
    super();
    this.mainClass = "";
    this.start_identation = 1;
    this.mainFunction = "void main(){\n  "
    this._end = "\n}"
    this.language = "c"
  }

  public generateCode(parsed_code: Object): GeneratedCode {
    return super.generateCode(parsed_code);
  }

  public writeFunction(_function: any){
    this.writeCode(_function.return_type.value);
    this.writeCode(` ${_function.name}(`);
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

  public writePlus(code: Object){
    super.writePlus(code);
  }

  public writeVariableCreation(code: Object) {
    // @ts-ignore
    this.writeCode(code.declaration.type);
    this.writeCode(" ");
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

  public writeComment(message:string){
    this.writeCode("//" + message);
    this.writeEndLine();
  }

  public writePrint(code: Object) {
    this.writeCode("printf(");
    this.handleWriting(code.value);
    this.writeCode(")");
    this.writeEndLine();
  }

  public writePrintln(code: Object) {
    this.writeCode("printf(");
    this.handleWriting(code.value);
    this.writeCode(")");
    this.writeEndLine();
    this.writeCode("printf('\\n')");
    this.writeEndLine();
  }

  public writeWhile(_while: any) {
    this.writeCode("while ");
    this.handleWriting(_while.condition);
    this.writeCode(" {");
    this.increaseIndent();
    this.newLine();
    this.handleWriting(_while.body);
    this.decreaseIndent();
    this.newLine();
    this.writeCode("}");
    this.newLine();
  }

  public writeIf(_if: any) {
    this.writeCode("if ");
    this.handleWriting(_if.condition);
    this.writeCode(" {");
    this.increaseIndent();
    this.newLine();
    this.handleWriting(_if.body);
    this.decreaseIndent();
    this.newLine();
    this.writeCode("}");
    this.newLine();
  }
}

class GeneratedCode{

  public constructor(public code: string){
    this.code = code;
  }

}
