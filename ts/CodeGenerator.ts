class CodeGenerator {
  protected generatedCode: string = "";
  protected parser: CodeParser;
  protected customImplementationUsage: CustomImplementationUsage = new CustomImplementationUsage();
  protected customImplementations: string = "";

  public constructor(parser: CodeParser | undefined) {
    if (parser) {
      this.parser = parser;
    }else{
      this.parser = new CodeParser(undefined);
    }
  }

  public generateCode(code: string): GeneratedCode{
    this.generatedCode = "";
    this.customImplementations = "";
    //TODO change how implemented
    return new GeneratedCode(this.customImplementations+this.generatedCode);
  }

  public writeCode(text: string): void{
    this.generatedCode += text;
  }

  public endLine(): void {
    this.writeCode("\n")
  }

  public startCodeBlock(): void{
    this.writeCode(" {\n");
  }

  public endCodeBlock(): void{
    this.writeCode("}\n");
  }

  public startParen(): void{
    this.writeCode("(");
  }

  public endParen(): void{
    this.writeCode(")")
  }

  public startParameter(): void{
    this.startParen();
  }

  public nextParameter(): void{
    this.writeCode(", ");
  }

  public endParameter(): void{
    this.endParen();
  }

  public useCustomImplementation(implementation: CustomImplementations): void{
    this.customImplementations += this.customImplementationUsage.useCustomImplemtation(implementation);
  }
}

class JavaScriptCodeGenerator extends CodeGenerator {

  constructor(parser: CodeParser | undefined) {
    super(parser);
  }

  public generateCode(code: string): GeneratedCode {
    this.customImplementationUsage = new CustomImplementationUsage();
    return super.generateCode(code);
  }

}

class GeneratedCode{

  public constructor(public code: string){
    this.code = code;
  }

}
