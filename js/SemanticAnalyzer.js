"use strict";
class AlreadyDefinedError extends Error {
    constructor(msg) {
        super(`${msg} was already defined`);
        Object.setPrototypeOf(this, AlreadyDefinedError.prototype);
    }
}
class NotDefinedError extends Error {
    constructor(msg) {
        super(`${msg} was not defined`);
        Object.setPrototypeOf(this, NotDefinedError.prototype);
    }
}
class LocationError extends Error {
    constructor(msg) {
        super(msg);
        Object.setPrototypeOf(this, LocationError.prototype);
    }
}
class MismatchTypesError extends Error {
    constructor(msg) {
        super(msg);
        Object.setPrototypeOf(this, MismatchTypesError.prototype);
    }
}
class SymbolTable {
    constructor(parent) {
        this.children = new Map();
        this.symbols = [];
        this.parent = parent;
    }
    insert(symbol) {
        try {
            if (this.lookup(symbol.name)) {
                throw new AlreadyDefinedError(symbol.name);
            }
        }
        catch (e) {
            this.symbols.push(symbol);
        }
    }
    lookup(name) {
        for (let i = 0; i < this.symbols.length; i++) {
            if (this.symbols[i].name === name) {
                return this.symbols[i];
            }
        }
        if (this.parent) {
            return this.parent.lookup(name);
        }
        // @ts-ignore
        throw new NotDefinedError(name);
    }
    addChildTable(table, id) {
        this.children.set(id, table);
    }
    getChildTable(id) {
        return this.children.get(id);
    }
}
class GlobalSymbolTable extends SymbolTable {
    insert(symbol) {
        console.log(symbol);
        switch (symbol.type) {
            case "CLASS":
            case "FUNCTION":
            case "VARIABLE":
                super.insert(symbol);
                break;
            default:
                throw new LocationError(`Cannot define ${symbol.type} in global scope`);
        }
    }
}
class ClassSymbolTable extends SymbolTable {
    insert(symbol) {
        super.insert(symbol);
    }
}
class MethodSymbolTable extends SymbolTable {
    insert(symbol) {
        switch (symbol.type) {
            case "CLASS":
            case "FUNCTION":
                throw new LocationError(`Cannot define ${symbol.type} inside a function`);
            default:
                super.insert(symbol);
        }
    }
}
function createTypeData(extend = "", imp) {
    if (imp == undefined) {
        imp = [];
    }
    return {
        extends: extend,
        implements: imp
    };
}
class TypeTable {
    reset() {
        TypeTable.types = new Map();
    }
    static getType(type) {
        return TypeTable.types.get(type);
    }
    static addType(type, data) {
        TypeTable.types.set(type, data);
    }
    static isType(type) {
        return TypeTable.types.has(type);
    }
    static instanceof(type, test_type) {
        if (this.getType(type).extends == test_type || this.getType(type).implements.includes(test_type)) {
            return true;
        }
        if (this.getType(type).extends) {
            if (this.instanceof(this.getType(type).extends, test_type)) {
                return true;
            }
        }
        for (let implementType of this.getType(type).implements) {
            if (this.instanceof(implementType, test_type)) {
                return true;
            }
        }
        return false;
    }
}
TypeTable.types = new Map();
TypeTable.addType("int", createTypeData(undefined, undefined));
TypeTable.addType("string", createTypeData(undefined, undefined));
TypeTable.addType("bool", createTypeData(undefined, undefined));
class SymbolQueue {
    enqueue(data) {
        this.queue.push(data);
    }
    getHead() {
        return this.queue[0];
    }
    finish() {
        this.queue.shift();
    }
    delay() {
        // @ts-ignore
        this.enqueue(this.queue.shift());
    }
}
class TypeEvaluator {
    getType(ast, table) {
        console.log(ast);
        switch (ast.type) {
            case "ExpressionStatement":
                return this.getType(ast.expression, table);
            case "IntegerLiteral":
                return "int";
            case "StringLiteral":
                return "string";
            case "BooleanLiteral":
                return "bool";
            case "FloatLiteral":
                return "float";
            case "BinaryExpression":
                const typeLeft = this.getType(ast.left, table);
                const typeRight = this.getType(ast.right, table);
                if (typeLeft && typeRight) {
                    if (typeLeft == typeRight) {
                        switch (ast.operator) {
                            case "==":
                                return "bool";
                            default:
                                return typeLeft;
                        }
                    }
                    else {
                        throw new MismatchTypesError("Mismatch Types: " + typeLeft + " and " + typeRight);
                    }
                }
            case "Variable":
                const variable = table.lookup(ast.value);
                return variable === null || variable === void 0 ? void 0 : variable.attributes.type;
            case "FunctionCall":
                let name = ast.name;
                ast.parameters.map((parameter) => {
                    name += "&" + this.getType(parameter);
                });
                const _function = table.lookup(name);
                return _function === null || _function === void 0 ? void 0 : _function.attributes.return_type;
        }
    }
}
class SemanticAnalyzer {
    constructor() {
        this.globalTable = new GlobalSymbolTable(undefined);
        this.currentSymbolTable = this.globalTable;
        this.typeEvaluator = new TypeEvaluator();
        this.in_global = false;
        this.currentlyHandling = [];
        this.delayHandling = [];
        this.handling_level = [];
        this.savedDelayHandling = [];
        this.savedCurrentlyHandling = [];
    }
    createSymbol(name, type, attributes) {
        return {
            name: name,
            type: type,
            attributes: attributes,
        };
    }
    analyze(ast) {
        console.log("Hello World!");
        this.handleAST(ast, true);
        this.in_global = false;
        console.log(this.delayHandling.length, "fsdfsvvcxv");
        while (this.delayHandling.length > 0 && this.savedDelayHandling) {
            this.handleDelayed();
        }
    }
    getLevel(ast) {
        switch (ast.type) {
            case "CLASS":
                return 0;
            case "FUNCTION":
                return 1;
            default:
                return 10;
        }
    }
    pickHandling() {
        let i = 0;
        while (i < this.delayHandling.length) {
            if (this.getLevel(this.delayHandling[i]) <= this.handling_level[this.handling_level.length - 1]) {
                this.currentlyHandling.push(this.delayHandling.splice(i, 1)[0]);
                i--;
            }
        }
    }
    handleDelayed() {
        if (this.currentlyHandling.length > 0) {
        }
        else {
            this.pickHandling();
        }
        this.handlePicked();
        this.handling_level[this.handling_level.length - 1]++;
    }
    handlePicked() {
        this.in_global = this.handling_level[this.currentlyHandling.length - 1] > 5;
        while (this.currentlyHandling.length > 0) {
            const ast = this.currentlyHandling.splice(0, 1)[0];
            if (!this.handleInGlobal(ast)) {
                this.handleAST(ast.code, false);
            }
        }
    }
    handleInGlobal(ast) {
        if (!this.in_global) {
            return false;
        }
        switch (ast.type) {
            case "CLASS":
                this.Class(ast);
                this.savedCurrentlyHandling.push(this.currentlyHandling);
                this.savedCurrentlyHandling.push(this.delayHandling);
                this.handling_level.push(-1);
                this.currentlyHandling = [];
                this.delayHandling = [];
                this.handleAST(ast.code, true);
                return true;
        }
        return false;
    }
    handleAST(ast, delay) {
        // @ts-ignore
        console.log(ast, delay);
        switch (ast.type) {
            case "CLASS":
                this.Class(ast);
                break;
            case "INTERFACE":
                this.Class(ast);
                break;
            case "FunctionDefinition":
                if (delay) {
                    this.delayHandling.push(ast);
                }
                else {
                    this.Function(ast);
                }
                break;
            case "VariableAssignment":
                this.VariableAssignment(ast);
                break;
            case "VariableCreation":
                if (delay) {
                    this.delayHandling.push(ast);
                }
                else {
                    this.VariableCreation(ast);
                }
                break;
            case "Program":
                this.handleAST(ast.body, false);
                break;
            case "Lines":
                for (let line of ast.body) {
                    this.handleAST(line, delay);
                }
                break;
            case "ExpressionStatement":
                if (delay) {
                    this.delayHandling.push(ast);
                }
                else {
                    this.handleAST(ast.expression, false);
                }
                break;
            default:
                this.Other(ast);
        }
    }
    Class(ast) {
        const symbol = this.createSymbol("", "CLASS", {});
    }
    Interface(ast) {
    }
    Function(ast) {
        let name = ast.name;
        const param_types = [];
        ast.parameters.map((parameter) => {
            param_types.push(parameter.type);
            name += "&" + parameter.type;
        });
        const symbol = this.createSymbol(name, "FUNCTION", {
            type: ast.return_type,
            param_types
        });
        this.currentSymbolTable.insert(symbol);
    }
    VariableCreation(ast) {
        let ast_variable = ast.declaration;
        if (!TypeTable.isType(ast_variable.type)) {
            throw new NotDefinedError("Type " + ast_variable.type);
        }
        this.currentSymbolTable.insert(this.createSymbol(ast_variable.name, "VARIABLE", {
            type: ast_variable.type
        }));
    }
    VariableAssignment(ast) {
        let ast_variable = ast.variable;
        let type = this.typeEvaluator.getType(ast.value, this.currentSymbolTable);
        console.log(ast, ast_variable, ast_variable.value);
        const variable = this.currentSymbolTable.lookup(ast_variable.value);
        console.log(variable);
        console.log(variable.attributes.type, type);
        if (variable.attributes.type == type) {
        }
        else {
            throw new MismatchTypesError("Mismatch Types: " + variable.attributes.type + " and " + type);
        }
    }
    OtherScope(ast) {
        let type = "";
        const symbol = this.createSymbol("", type, []);
    }
    Other(ast) {
        const symbol = this.createSymbol("", "", []);
    }
}
