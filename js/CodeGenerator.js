"use strict";
class CodeGenerator {
    constructor(parser) {
        this.generatedCode = "";
        this.customImplementationUsage = new CustomImplementationUsage();
        this.customImplementations = "";
        if (parser) {
            this.parser = parser;
        }
        else {
            this.parser = new CodeParser(undefined);
        }
    }
    generateCode(code) {
        this.generatedCode = "";
        this.customImplementations = "";
        //TODO change how implemented
        return new GeneratedCode(this.customImplementations + this.generatedCode);
    }
    writeCode(text) {
        this.generatedCode += text;
    }
    endLine() {
        this.writeCode("\n");
    }
    startCodeBlock() {
        this.writeCode(" {\n");
    }
    endCodeBlock() {
        this.writeCode("}\n");
    }
    startParen() {
        this.writeCode("(");
    }
    endParen() {
        this.writeCode(")");
    }
    startParameter() {
        this.startParen();
    }
    nextParameter() {
        this.writeCode(", ");
    }
    endParameter() {
        this.endParen();
    }
    useCustomImplementation(implementation) {
        this.customImplementations += this.customImplementationUsage.useCustomImplemtation(implementation);
    }
}
class JavaScriptCodeGenerator extends CodeGenerator {
    constructor(parser) {
        super(parser);
    }
    generateCode(code) {
        this.customImplementationUsage = new CustomImplementationUsage();
        return super.generateCode(code);
    }
}
class GeneratedCode {
    constructor(code) {
        this.code = code;
        this.code = code;
    }
}
