
interface SemanticSymbol {
  name: string;
  type: string;
  attributes: object;
}

class AlreadyDefinedError extends Error {
  constructor(msg: string) {
    super(`${msg} was already defined`);
    Object.setPrototypeOf(this, AlreadyDefinedError.prototype);
  }
}

class NotDefinedError extends Error {
  constructor(msg: string) {
    super(`${msg} was not defined`);
    Object.setPrototypeOf(this, NotDefinedError.prototype);
  }
}

class LocationError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, LocationError.prototype);
  }
}

class MismatchTypesError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, MismatchTypesError.prototype);
  }
}

class SymbolTable{
  protected parent: SymbolTable | undefined;
  protected children: Map<number, SymbolTable> = new Map<number, SymbolTable>();
  protected symbols: SemanticSymbol[] = [];

  constructor(parent: SymbolTable | undefined) {
    this.parent = parent;
  }

  insert(symbol: SemanticSymbol){
    try {
      if (this.lookup(symbol.name)) {
        throw new AlreadyDefinedError(symbol.name);
      }
    }catch(e){
      this.symbols.push(symbol);
    }
  }

  lookup(name: string): SemanticSymbol | null{
    for (let i = 0; i < this.symbols.length; i++) {
      if (this.symbols[i].name === name){
        return this.symbols[i];
      }
    }
    if (this.parent){
      return this.parent.lookup(name);
    }
    // @ts-ignore
    throw new NotDefinedError(name);
  }

  addChildTable(table: SymbolTable, id: number){
    this.children.set(id, table);
  }

  getChildTable(id: number){
    return this.children.get(id);
  }
}

class GlobalSymbolTable extends SymbolTable{

  insert(symbol: SemanticSymbol){
    console.log(symbol)
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

class ClassSymbolTable extends SymbolTable{

  insert(symbol: SemanticSymbol){
    super.insert(symbol);
  }

}

class MethodSymbolTable extends SymbolTable{

  insert(symbol: SemanticSymbol) {
    switch (symbol.type) {
      case "CLASS":
      case "FUNCTION":
        throw new LocationError(`Cannot define ${symbol.type} inside a function`);
      default:
        super.insert(symbol);
    }
  }
}


interface TypeData{
  extends: string;
  implements: string[];
}

function createTypeData(extend:string = "", imp: string[] | undefined){
  if (imp == undefined){
    imp = [];
  }
  return {
    extends: extend,
    implements: imp
  };
}

class TypeTable{
  protected static types: Map<string, TypeData> = new Map();

  public reset(){
    TypeTable.types = new Map();
  }

  public static getType(type: string): TypeData {
    return <TypeData>TypeTable.types.get(type);
  }

  public static addType(type: string, data: TypeData){
    TypeTable.types.set(type, data);
  }

  public static isType(type: string): boolean {
    return TypeTable.types.has(type);
  }

  public static instanceof(type: string, test_type: string): boolean{
    if (this.getType(type).extends == test_type || this.getType(type).implements.includes(test_type)){
      return true;
    }
    if (this.getType(type).extends){
      if (this.instanceof(this.getType(type).extends, test_type)){
        return true;
      }
    }
    for (let implementType of this.getType(type).implements){
      if (this.instanceof(implementType, test_type)){
        return true;
      }
    }
    return false;
  }
}
TypeTable.addType("int", createTypeData(undefined, undefined));
TypeTable.addType("string", createTypeData(undefined, undefined));
TypeTable.addType("bool", createTypeData(undefined, undefined));


interface SymbolQueueData{
  table: SymbolTable;
}

class SymbolQueue {
  protected queue: SymbolQueueData[];

  enqueue(data: SymbolQueueData){
    this.queue.push(data);
  }

  getHead(): SymbolQueueData{
    return this.queue[0];
  }

  finish(){
    this.queue.shift();
  }

  delay(){
    // @ts-ignore
    this.enqueue(this.queue.shift());
  }

}

class TypeEvaluator{
  getType(ast: Object, table: SymbolTable): string{
    console.log(ast);
    switch (ast.type){
      case "ExpressionStatement":
        return this.getType(ast.expression, table)
      case "IntegerLiteral":
        return "int"
      case "StringLiteral":
        return "string"
      case "BooleanLiteral":
        return "bool"
      case "FloatLiteral":
        return "float"
      case "BinaryExpression":
        const typeLeft = this.getType(ast.left, table);
        const typeRight = this.getType(ast.right, table);
        if (typeLeft && typeRight){
          if (typeLeft == typeRight){
            switch (ast.operator){
              case "==":
                return "bool"
              default:
                return typeLeft;
            }
          }else{
            throw new MismatchTypesError("Mismatch Types: " + typeLeft + " and " + typeRight)
          }
        }
      case "Variable":
        const variable = table.lookup(ast.value);
        return <string>variable?.attributes.type;
      case "FunctionCall":
        let name = ast.name;
        ast.parameters.map((parameter) => {
          name += "&" + this.getType(parameter);
        });
        const _function = table.lookup(name);
        return _function?.attributes.return_type;
    }
  }
}

class SemanticAnalyzer{
  protected globalTable: GlobalSymbolTable = new GlobalSymbolTable(undefined);
  protected currentSymbolTable: SymbolTable = this.globalTable;
  protected typeEvaluator: TypeEvaluator = new TypeEvaluator();
  protected in_global = false;
  protected currentlyHandling: any[] = [];
  protected delayHandling: any[] = [];
  protected handling_level: number[] = [];
  protected savedDelayHandling: any[] = [];
  protected savedCurrentlyHandling: any[] = [];



  constructor() {

  }

  createSymbol(name: string, type: string, attributes: object): SemanticSymbol {
    return {
      name: name,
      type: type,
      attributes: attributes,
    }
  }

  analyze(ast: Object){
    console.log("Hello World!")
    this.handleAST(ast, true);
    this.in_global = false;
    console.log(this.delayHandling.length, "fsdfsvvcxv")
    while (this.delayHandling.length > 0 && this.savedDelayHandling) {
      this.handleDelayed();
    }
  }

  getLevel(ast: Object): number{
    switch (ast.type){
      case "CLASS":
        return 0;
      case "FUNCTION":
        return 1;
      default:
        return 10;
    }
  }

  pickHandling(){
    let i = 0;
    while (i < this.delayHandling.length){
      if (this.getLevel(this.delayHandling[i]) <= this.handling_level[this.handling_level.length-1]){
        this.currentlyHandling.push(this.delayHandling.splice(i, 1)[0]);
        i--;
      }
    }
  }

  handleDelayed(){
    if (this.currentlyHandling.length > 0){

    }else{
      this.pickHandling();
    }
    this.handlePicked();
    this.handling_level[this.handling_level.length-1]++;
  }

  handlePicked(){
    this.in_global = this.handling_level[this.currentlyHandling.length - 1] > 5;
    while (this.currentlyHandling.length > 0) {
      const ast = this.currentlyHandling.splice(0, 1)[0];
      if (!this.handleInGlobal(ast)){
        this.handleAST(ast.code, false);
      }
    }
  }

  handleInGlobal(ast: Object): boolean{

    if (!this.in_global){
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

  handleAST(ast: Object, delay: boolean){
    // @ts-ignore
    console.log(ast, delay)
    switch (ast.type){
      case "CLASS":
        this.Class(ast);
        break;
      case "INTERFACE":
        this.Class(ast);
        break;
      case "FunctionDefinition":
        if (delay) {
          this.delayHandling.push(ast);
        }else{
          this.Function(ast);
        }
        break;
      case "VariableAssignment":
        this.VariableAssignment(ast);
        break;
      case "VariableCreation":
        if (delay) {
          this.delayHandling.push(ast);
        }else {
          this.VariableCreation(ast);
        }
        break;
      case "Program":
        this.handleAST(ast.body, false);
        break;
      case "Lines":
        for (let line of ast.body){
          this.handleAST(line, delay);
        }
        break;
      case "ExpressionStatement":
        if (delay) {
          this.delayHandling.push(ast);
        }else {
          this.handleAST(ast.expression, false);
        }
        break;
      default:
        this.Other(ast);
    }
  }

  Class(ast: Object){
    const symbol: SemanticSymbol = this.createSymbol("", "CLASS", {});
  }

  Interface(ast: Object){

  }

  Function(ast: Object){
    let name = ast.name;
    const param_types = [];
    ast.parameters.map((parameter) => {
      param_types.push(parameter.type);
      name+="&"+parameter.type;
    })
    const symbol: SemanticSymbol = this.createSymbol(name, "FUNCTION",
      {
        type: ast.return_type,
        param_types
      }
    );
    this.currentSymbolTable.insert(symbol);
  }

  VariableCreation(ast: Object){
    let ast_variable = ast.declaration;
    if (!TypeTable.isType(ast_variable.type)) {
      throw new NotDefinedError("Type " + ast_variable.type);
    }
    this.currentSymbolTable.insert(this.createSymbol(ast_variable.name, "VARIABLE",
      {
        type: ast_variable.type
      }
    ));
  }

  VariableAssignment(ast: Object){
    let ast_variable = ast.variable;
    let type = this.typeEvaluator.getType(ast.value, this.currentSymbolTable);
    console.log(ast, ast_variable, ast_variable.value);
    const variable = this.currentSymbolTable.lookup(ast_variable.value);
    console.log(variable);
    console.log(variable.attributes.type, type)
    if (variable.attributes.type == type){
    }else{
      throw new MismatchTypesError("Mismatch Types: " + variable.attributes.type + " and " + type)
    }
  }

  OtherScope(ast: Object){
    let type = "";
    const symbol: SemanticSymbol = this.createSymbol("", type, []);
  }

  Other(ast: Object){
    const symbol: SemanticSymbol = this.createSymbol("", "", []);

  }
}


