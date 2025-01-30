//TODO write documentation
//TODO split into multiple files


/**
 * Tokenizer spec.
 */
//TODO properly type Parsed

interface Spec {
  expression: RegExp;
  type: string | null;
}

interface Token {
  type: string;
  value: string;
}

interface VariableDef {
  name: string;
  type: string;
}

interface ParamDef {
  name: string;
  type: string;
}
const TokenizerSpecs: Spec[] = [
  //White Space
  {expression: /^\s+/, type: null},

  //Comments

  //Single Line Comment
  {expression: /^\/\/.*/, type: null},

  //Multi Line Comment
  {expression: /^\/\*[\s\S]*?\*\//, type: null},

  //Numbers
  {expression: /^\d+/, type: 'INTEGER'},
  {expression: /^\d+.\d*/, type: 'FLOAT'},


  //Strings
  {expression: /^"[^"]*"/, type: 'STRING'},
  {expression: /^'[^']*'/, type: 'STRING'},

  //Keywords
  {expression: /^true/, type: 'BOOLEAN'},
  {expression: /^false/, type: 'BOOLEAN'},
  {expression: /^if/, type: 'IF'},
  {expression: /^else/, type: 'ELSE'},
  {expression: /^while/, type: 'WHILE'},
  {expression: /^func/, type: 'FUNCTION'},
  {expression: /^var/, type: 'VARIABLE'},
  {expression: /^class/, type: 'CLASS'},
  {expression: /^macro/, type: 'MACRO'},
  {expression: /^interface/, type: 'INTERFACE'},
  {expression: /^return/, type: 'RETURN'},
  {expression: /^lambda/, type: "LAMBDA"},
  {expression: /^println/, type: "PRINTLN"},
  {expression: /^print/, type: "PRINT"},

  //Operators
  {expression: /^((&&)|(\|\|))/, type: "ANDOR_OPERATOR"},
  {expression: /^((==)|(!=)|(<=)|(>=)|[><])/, type: "EQUALITY_OPERATOR"},
  {expression: /^[+-]/, type: "ADDITIVE_OPERATOR"},
  {expression: /^[*/]/, type: "MULTIPLICATIVE_OPERATOR"},

  //Symbols
  {expression: /^;/, type: 'SEP'},
  {expression: /^\(/, type: "PAREN_OPEN"},
  {expression: /^\)/, type: "PAREN_CLOSE"},
  {expression: /^\{/, type: "BRACKET_OPEN"},
  {expression: /^}/, type: "BRACKET_CLOSE"},
  {expression: /^!/, type: "NOT"},
  {expression: /^=/, type: "ASSIGNMENT"},
  {expression: /^,/, type: "COMMA"},
  {expression: /^@/, type: "annotation"},
  {expression: /^#/, type: "call"},




  //Types
  {expression: /^bool/, type: 'TYPE'},
  {expression: /^int/, type: 'TYPE'},
  {expression: /^float/, type: 'TYPE'},
  {expression: /^string/, type: 'TYPE'},
  {expression: /^function/, type: "TYPE"},
  {expression: /^void/, type: "TYPE"},

  //IDENTIFIER
  {expression: /^[a-zA-Z_]\w*/, type: "IDENTIFIER"},
];


class Tokenizer{
  private _string: string = "";
  private _cursor: number = 0;

  init(code: string){
    this._string = code;
    this._cursor = 0;
  }

  isEOF(){
    return this._cursor === this._string.length;
  }

  hasMoreTokens() {
    return this._cursor < this._string.length;
  }

  _match(regex0: RegExp, string: string){
    const matched = regex0.exec(string);
    if (matched == null){
      return null
    }

    this._cursor += matched[0].length;
    return matched[0];
  }

  getNextToken(): Token | null{
    if (!this.hasMoreTokens()){
      //throw new Error("ParserError: no more tokens");
      return null
    }

    const cur_string: string = this._string.slice(this._cursor);
    console.log(cur_string)
    for (const spec of TokenizerSpecs){
      const tokenValue = this._match(spec.expression, cur_string);

      //Don't match this rule, continue.
      if (tokenValue == null){
        continue;
      }

      // Should skip white space and comments
      if (spec.type == null){
        return this.getNextToken();
      }

      return {
        type: spec.type,
        value: tokenValue
      }

    }

    throw new SyntaxError(`Unexpected token: "${cur_string[0]}"`);
  }

}

class CodeParser{

  private id: number = 0;
  private tokenizer: Tokenizer;
  private _lookahead: Token | null = {type: "", value: ""};

  public constructor(tokenizer: Tokenizer | undefined) {
    if (tokenizer) {
      this.tokenizer = tokenizer;
    }else{
      this.tokenizer = new Tokenizer();
    }
  }

  public parse(code: string){
    this.tokenizer.init(code);
    this._lookahead = this.tokenizer.getNextToken();

    return this.Program();
  }

  _eat(tokenType: string){
    const token = this._lookahead;

    if (token == null) {
      throw new SyntaxError(`Unexpected end of input, expected: "${tokenType}"`);
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(`Unexpected token: ${token.value}, expected: "${tokenType}"`);
    }

    this._lookahead = this.tokenizer.getNextToken();

    return token;
  }

  Program(){
    return {
      type: "Program",
      body: this.Lines()
    }
  }

  Lines(){
    const lines = [];
    while (!this.tokenizer.isEOF() && this._lookahead?.type != "BRACKET_CLOSE") {
      lines.push(this.Line());
    }
    return {
      type: "Lines",
      body: lines
    }
  }

  Line(): any{
    let statement;
    if (this._lookahead == null) {
      throw new Error("Expected Token");
    }
    if (this._lookahead.type == "IF") {
      statement = this.If();
    }else if (this._lookahead.type == "WHILE") {
      statement = this.While();
    }else if (this._lookahead.type == "FUNCTION"){
      return this.FunctionDefinition();
    }else if (this._lookahead.type == "VARIABLE"){
      return this.VariableCreation();
    }else if (this._lookahead.type == "RETURN"){
      return this.Return();
    }else if (this._lookahead.type == "PRINT"){
      return this.Print()
    }else if (this._lookahead.type == "PRINTLN"){
      return this.Println();
    } else{
      return this.ExpressionStatement();
    }
  }

  Print() {
    this._eat("PRINT");
    const expression = this.Expression();
    this._eat("SEP");
    return {
      type: "Print",
      value: expression
    }
  }

  Println() {
    this._eat("PRINTLN");
    const expression = this.Expression();
    this._eat("SEP");
    return {
      type: "Println",
      value: expression
    }
  }

  Return(){
    let value;
    this._eat("RETURN")
    if (this._lookahead?.type == "SEP"){
      this._eat("SEP");
    }else{
      value = this.ExpressionStatement();
    }
    return {
      type: "Return",
      value: value
    }
  }

  If(){
    this._eat('IF');
    const condition = this.Paren();
    let code;
    let type = "SINGLE_LINE_IF";
    if (this._lookahead?.type == "BRACKET_OPEN"){
      type = "MULTI_LINE_IF";
      this._eat('BRACKET_OPEN');
      code = this.Lines();
      this._eat('BRACKET_CLOSE');
    }else{
      code = this.Line();
    }
    let _else;
    if (this._lookahead?.type == "ELSE"){
      _else = this.Else();
    }
    return {
      type: type,
      condition: condition,
      body: code,
      else: _else,
      id: this.id++
    }
  }

  Else(){
    this._eat('ELSE');
    let code;
    let type = "SINGLE_LINE_ELSE";
    if (this._lookahead?.type == "BRACKET_OPEN"){
      type = "MULTI_LINE_ELSE";
      this._eat('BRACKET_OPEN');
      code = this.Lines();
      this._eat('BRACKET_CLOSE');
    }else{
      code = this.Line();
    }
    return {
      type: type,
      body: code,
      id: this.id++
    }
  }

  While(){
    this._eat('WHILE');
    let code;
    let type = "SINGLE_LINE_WHILE";
    if (this._lookahead?.type == "BRACKET_OPEN"){
      type = "MULTI_LINE_WHILE";
      this._eat('BRACKET_OPEN');
      code = this.Lines();
      this._eat('BRACKET_CLOSE');
    }else{
      code = this.Line();
    }
    return {
      type: type,
      body: code,
      id: this.id++
    }
  }

  ExpressionStatement(){
    console.log(this._lookahead, "look")
    const expression = this.Expression();
    this._eat('SEP');
    return {
      type: "ExpressionStatement",
      expression: expression
    }
  }

  Expression(){
    return this.AndOrExpression();
  }

  AndOrExpression(){
    let left: any = this.EqualityExpression();
    while (this._lookahead != null && this._lookahead.type === 'ANDOR_OPERATOR'){
      const operator = this._eat("ANDOR_OPERATOR");
      const right = this.EqualityExpression();
      left = {
        type: 'BinaryExpression',
        operator: operator.value,
        left: left,
        right: right
      }
    }
    return left;
  }


  EqualityExpression(): any{
    let left: any = this.AdditiveExpression();
    while (this._lookahead != null && this._lookahead.type === 'EQUALITY_OPERATOR'){
      const operator = this._eat("EQUALITY_OPERATOR");
      const right = this.AdditiveExpression();
      left = {
        type: 'BinaryExpression',
        operator: operator.value,
        left: left,
        right: right
      }
    }
    return left;
  }

  AdditiveExpression(): any{
    let left: any = this.MultiplicativeExpression();
    while (this._lookahead != null && this._lookahead.type === 'ADDITIVE_OPERATOR'){
      const operator = this._eat("ADDITIVE_OPERATOR");
      const right = this.MultiplicativeExpression();
      left = {
        type: 'BinaryExpression',
        operator: operator.value,
        left: left,
        right: right
      }
    }
    return left;
  }

  MultiplicativeExpression(): any{
    let left: any = this.Primary();
    while (this._lookahead != null && this._lookahead.type === 'MULTIPLICATIVE_OPERATOR'){
      const operator = this._eat("MULTIPLICATIVE_OPERATOR");
      const right = this.Primary();

      left = {
        type: 'BinaryExpression',
        operator: operator.value,
        left: left,
        right: right
      }
    }
    return left;
  }

  Primary(){
    if (this._lookahead != null){
      if (this._lookahead.type == "PAREN_OPEN"){
        return this.Paren();
      }else if (this._lookahead.value == "-"){
        return this.NEGATE();
      }else if (this._lookahead.type == "NOT"){
        return this.NOT();
      }else if (this._lookahead.type == "IDENTIFIER"){
        return this.Identifier();
      }
      return this.Literal();
    }
  }

  Paren(){
    this._eat("PAREN_OPEN");
    const value = this.Expression();
    this._eat("PAREN_CLOSE")
    return {
      type: "Parentheses",
      inner: value
    }
  }

  NOT(): any{
    this._eat("NOT");
    return {
      type: "Not",
      inner: this.Primary()
    }
  }

  NEGATE(): any{
    this._eat("ADDITIVE_OPERATOR");
    return {
      type: "Negate",
      inner: this.Primary()
    }
  }

  VariableDeclaration():VariableDef {
    const type = this.Type().value;
    const name = this._eat("IDENTIFIER").value;
    return {
      name: name,
      type: type,
    }
  }

  ParameterDeclaration():ParamDef{
    return this.VariableDeclaration();
  }

  Type(){
    if (this._lookahead?.type == "TYPE"){
      return this._eat("TYPE");
    }else{
      return this._eat("IDENTIFIER");
    }
  }

  FunctionDefinition(){
    this._eat("FUNCTION");
    const type = this.Type();
    const name = this._eat("IDENTIFIER").value;
    const params:ParamDef[] = [];
    this._eat("PAREN_OPEN");
    while (this._lookahead?.type != "PAREN_CLOSE"){
      params.push(this.ParameterDeclaration());
      if (this._lookahead?.type != "PAREN_CLOSE"){
        this._eat("COMMA");
      }
    }
    this._eat("PAREN_CLOSE");
    this._eat("BRACKET_OPEN");
    const code = this.Lines();
    this._eat("BRACKET_CLOSE");
    return {
      type: "FunctionDefinition",
      name: name,
      parameters: params,
      code: code,
      return_type: type,
      id: this.id++
    }
  }

  Identifier() {
    const variable = this.Variable();
    if (this._lookahead?.type == "PAREN_OPEN"){
      return this.FunctionCall(variable);
    }if (variable.member_access == undefined && this._lookahead?.type == "ASSIGNMENT") {
      return this.VariableAssignment(variable);
    }
    return variable;
  }

  FunctionCall(identifier: Token){
    this._eat("PAREN_OPEN");
    const parameters: any = [];
    while (this._lookahead?.type != "PAREN_CLOSE"){
      parameters.push(this.Expression());
      if (this._lookahead?.type != "PAREN_CLOSE"){
        this._eat("COMMA");
      }
    }
    this._eat("PAREN_CLOSE");
    return {
      type: "FunctionCall",
      name: identifier.value,
      variable: identifier,
      parameters: parameters
    }
  }


  Variable():any {
    let type = "Variable"
    const identifier = this._eat("IDENTIFIER")
    let member_access;
    if (this._lookahead?.type == "PERIOD"){
      type = "MemberAccess";
      this._eat("PERIOD")
      member_access = this.Variable();
    }
    return {
      type: type,
      value: identifier.value,
      member_access: member_access
    }
  }

  VariableCreation() {
    this._eat("VARIABLE");
    const declaration = this.VariableDeclaration();
    let assignment;
    if (this._lookahead?.type == "ASSIGNMENT") {
      this._eat("ASSIGNMENT")
      assignment = this.ExpressionStatement();
    }else{
      this._eat("SEP")
    }
    return {
      type: "VariableCreation",
      declaration: declaration,
      assignment: assignment
    }
  }

  VariableAssignment(variable: any){
    this._eat("ASSIGNMENT");
    const expression = this.Expression();
    return {
      type: "VariableAssignment",
      variable: variable,
      value: expression
    }
  }

  Literal(){
    if (this._lookahead != null){
      switch (this._lookahead.type){
        case "INTEGER":
          return this.IntegerLiteral();
        case "FLOAT":
          return this.FloatLiteral();
        case "STRING":
          return this.StringLiteral();
        case "BOOLEAN":
          return this.BooleanLiteral();
      }
    }
    throw new SyntaxError(`Literal: unexpected literal production`);
  }

  IntegerLiteral(){
    const token = this._eat('INTEGER');
    return {
      type: "IntegerLiteral",
      value: Number(token.value)
    }
  }

  FloatLiteral(){
    const token = this._eat('FLOAT');
    return {
      type: "FloatLiteral",
      value: Number(token.value)
    }
  }

  BooleanLiteral() {
    const token = this._eat('BOOLEAN');
    return {
      type: "BooleanLiteral",
      value: Boolean(token.value)
    }
  }

  StringLiteral(){
    const token = this._eat('STRING');
    return {
      type: "StringLiteral",
      value: token.value.slice(1, -1)
    }
  }
}
