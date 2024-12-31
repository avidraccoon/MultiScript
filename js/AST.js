"use strict";
class SyntaxCode {
    generateCode(codeGenerator) {
    }
}
class Expression extends SyntaxCode {
}
class Line extends SyntaxCode {
    constructor(expression) {
        super();
        this.expression = expression;
    }
    generateCode(codeGenerator) {
        this.expression.generateCode(codeGenerator);
        codeGenerator.endLine();
    }
}
class CodeBlock extends SyntaxCode {
    constructor() {
        super();
        this.lines = [];
    }
    addLine(line) {
        this.lines.push(line);
    }
    generateCode(codeGenerator) {
        for (let line of this.lines) {
            line.generateCode(codeGenerator);
        }
    }
}
