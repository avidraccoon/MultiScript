"use strict";
//TODO write documentation
class LanguageCodeGenerator {
    constructor() {
        this.generatedCode = "";
        // @ts-ignore
        this.customImplementationUsage = new CustomImplementationUsage(undefined);
        this.customImplementations = "";
        this.indentation = 0;
    }
    generateCode(parsed_code) {
        this.generatedCode = "";
        this.customImplementations = "";
        this.indentation = 0;
        this.handleWriting(parsed_code);
        return new GeneratedCode(this.customImplementations + this.generatedCode);
    }
    increaseIndent() {
        this.indentation++;
    }
    decreaseIndent() {
        this.indentation--;
    }
    writeEndLine() {
        this.writeCode(";");
        this.newLine();
    }
    handleWriting(code) {
        console.log(code);
        switch (code.type) {
            case "Program":
                this.handleWriting(code.body);
                break;
            case "Lines":
                for (let line of code.body) {
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
                        this.writeEquals(code);
                        break;
                    case "!=":
                        this.writeNotEquals(code);
                        break;
                    case "<=":
                        this.writeLessEquals(code);
                        break;
                    case ">=":
                        this.writeGreaterEquals(code);
                        break;
                    case "<":
                        this.writeLess(code);
                        break;
                    case ">":
                        this.writeGreater(code);
                        break;
                    case "||":
                        this.writeOr(code);
                        break;
                    case "&&":
                        this.writeAnd(code);
                        break;
                    case "+":
                        this.writePlus(code);
                        break;
                    case "-":
                        this.writeMinus(code);
                        break;
                    case "*":
                        this.writeMultiply(code);
                        break;
                    case "/":
                        this.writeDivide(code);
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
                this.writeFunction(code);
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
                if (code.assignment) {
                    this.writeVariableCreationAndAssignment(code);
                }
                else {
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
    writeBoolean(code) {
        if (code.value) {
            this.writeCode("true");
        }
        else {
            this.writeCode("false");
        }
    }
    writeString(code) {
        this.writeCode(`"${code.value}"`);
    }
    writePrint(code) {
    }
    writePrintln(code) {
    }
    writeFunctionCall(code) {
        this.writeVariable(code.variable);
        console.log(code);
        this.writeCode("(");
        for (let i = 0; i < code.parameters.length; i++) {
            const param = code.parameters[i];
            if (i != 0) {
                this.writeCode(", ");
            }
            this.handleWriting(param);
        }
        this.writeCode(")");
    }
    writeReturn(code) {
        this.writeCode("return ");
        // @ts-ignore
        if (code.value) {
            // @ts-ignore
            this.handleWriting(code.value);
        }
        else {
            this.writeEndLine();
        }
    }
    handleVariable(code) {
        // @ts-ignore
        if (code.type == "MemberAccess") {
            this.writeMemberAccess(code);
            // @ts-ignore
            this.handleVaraible(code.member_access);
        }
        else {
            this.writeVariable(code);
        }
    }
    writeVariable(code) {
        // @ts-ignore
        this.writeCode(`${code.value}`);
    }
    writeMemberAccess(code) {
        // @ts-ignore
        this.writeCode(`${code.value}.`);
    }
    writeEquals(code) {
        // @ts-ignore
        this.handleWriting(code.left);
        this.writeCode("==");
        // @ts-ignore
        this.handleWriting(code.right);
    }
    writeNotEquals(code) {
        // @ts-ignore
        this.handleWriting(code.left);
        this.writeCode("!=");
        // @ts-ignore
        this.handleWriting(code.right);
    }
    writeLessEquals(code) {
        // @ts-ignore
        this.handleWriting(code.left);
        this.writeCode("<=");
        // @ts-ignore
        this.handleWriting(code.right);
    }
    writeGreaterEquals(code) {
        // @ts-ignore
        this.handleWriting(code.left);
        this.writeCode(">=");
        // @ts-ignore
        this.handleWriting(code.right);
    }
    writeLess(code) {
        // @ts-ignore
        this.handleWriting(code.left);
        this.writeCode("<");
        // @ts-ignore
        this.handleWriting(code.right);
    }
    writeGreater(code) {
        // @ts-ignore
        this.handleWriting(code.left);
        this.writeCode(">");
        // @ts-ignore
        this.handleWriting(code.right);
    }
    writeAnd(code) {
        // @ts-ignore
        this.handleWriting(code.left);
        this.writeCode("&&");
        // @ts-ignore
        this.handleWriting(code.right);
    }
    writeOr(code) {
        // @ts-ignore
        this.handleWriting(code.left);
        this.writeCode("||");
        // @ts-ignore
        this.handleWriting(code.right);
    }
    writePlus(code) {
        // @ts-ignore
        this.handleWriting(code.left);
        this.writeCode("+");
        // @ts-ignore
        this.handleWriting(code.right);
    }
    writeMinus(code) {
        // @ts-ignore
        this.handleWriting(code.left);
        this.writeCode("-");
        // @ts-ignore
        this.handleWriting(code.right);
    }
    writeNegate(code) {
        this.writeCode("-");
        // @ts-ignore
        this.handleWriting(code.inner);
        // @ts-ignore
        this.handleWriting(code.right);
    }
    writeMultiply(code) {
        // @ts-ignore
        this.handleWriting(code.left);
        this.writeCode("*");
        // @ts-ignore
        this.handleWriting(code.right);
    }
    writeDivide(code) {
        // @ts-ignore
        this.handleWriting(code.left);
        this.writeCode("/");
        // @ts-ignore
        this.handleWriting(code.right);
    }
    writeParentheses(code) {
        this.writeCode("(");
        // @ts-ignore
        this.handleWriting(code.inner);
        this.writeCode(")");
    }
    writeNot(code) {
        this.writeCode("!");
        // @ts-ignore
        this.handleWriting(code.inner);
    }
    writeVariableCreation(code) {
    }
    writeVariableAssignment(code) {
    }
    writeVariableCreationAndAssignment(code) {
    }
    writeCode(text) {
        this.generatedCode += text;
    }
    newLine() {
        this.writeCode("\n");
        for (let i = 0; i < this.indentation; i++) {
            this.writeCode("  ");
        }
    }
    writeFunction(_function) {
    }
    writeIf(_if) {
    }
    writeSingleIf(_if) {
        this.writeIf(_if);
    }
    writeElse(_else) {
    }
    writeSingleElse(_else) {
        this.writeElse(_else);
    }
    writeWhile(_while) {
    }
    writeSingleWhile(_while) {
        this.writeWhile(_while);
    }
    useCustomImplementation(implementation) {
        this.customImplementations += this.customImplementationUsage.useCustomImplemtation(implementation);
    }
}
class JavaScriptCodeGenerator extends LanguageCodeGenerator {
    constructor(useFixesForWeirdness = true) {
        super();
        this._useFixesForWeirdness = useFixesForWeirdness;
    }
    generateCode(parsed_code) {
        this.customImplementationUsage = new CustomImplementationUsage(JavaScriptCustomImplementationsCode);
        return super.generateCode(parsed_code);
    }
    writeFunction(_function) {
        this.writeCode(`function ${_function.name}(`);
        for (let i = 0; i < _function.parameters.length; i++) {
            const param = _function.parameters[i];
            if (i != 0) {
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
    writePlus(code) {
        if (this._useFixesForWeirdness) {
            this.useCustomImplementation(JavaScriptCustomImplementations.ADDITION);
            this.writeCode("fixed_javascript_add(");
            // @ts-ignore
            this.handleWriting(code.left);
            this.writeCode(", ");
            // @ts-ignore
            this.handleWriting(code.right);
            this.writeCode(")");
        }
        else {
            super.writePlus(code);
        }
    }
    writeVariableCreation(code) {
        this.writeCode("let ");
        // @ts-ignore
        this.writeCode(code.declaration.name);
        this.writeEndLine();
    }
    writeVariableAssignment(code) {
        // @ts-ignore
        this.handleWriting(code.variable);
        this.writeCode(" = ");
        // @ts-ignore
        this.handleWriting(code.value);
    }
    writeVariableCreationAndAssignment(code) {
        this.writeCode("let ");
        // @ts-ignore
        this.writeCode(code.declaration.name);
        this.writeCode(" = ");
        // @ts-ignore
        this.handleWriting(code.assignment);
    }
    writeComment(message) {
        this.writeCode("//" + message);
        this.writeEndLine();
    }
    writePrint(code) {
        this.writeComment("Print without new line not possible in Browser JavaScript");
        this.writePrintln(code);
    }
    writePrintln(code) {
        this.writeCode("console.log(");
        this.handleWriting(code.value);
        this.writeCode(")");
        this.writeEndLine();
    }
}
class GeneratedCode {
    constructor(code) {
        this.code = code;
        this.code = code;
    }
}
