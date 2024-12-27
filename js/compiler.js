//TODO add concept of objects
//TODO add arrays
//TODO add classes
const debug = true;
const debug_token = true;
class Output{

  clear(){
    console.clear()
  }

  print(text){
    console.log(text);
  }

  println(text) {
    console.log(text);
  }
}

class ElementOutput extends Output{
  constructor(id) {
    super();
    this.elementId = id;
    this.element = document.getElementById(id);
    this.text = '';
  }

  clear(){
    this.element.innerText = '';
    this.text = '';
  }

  print(text){
    this.text += text;
    this.element.innerHTML = this.text;
  }

  println(text){
    this.print(text+'\n')
  }

}

class Scope{

  constructor() {
    this.variables = {};
    this.methods = {};
  }

  setMethod(methodName, method) {
    this.methods[methodName] = method;
  }

  getMethod(methodName) {
    return this.methods[methodName];
  }

  setVariable(variableName, variableValue) {
    this.variables[variableName] = variableValue;
  }

  getVariable(variableName) {
    return this.variables[variableName];
  }

  hasVariable(variableName) {
    return !!(this.variables[variableName] || this.variables[variableName] == null);
  }

  createVariable(name) {
    this.variables[name] = null;
  }

}
/*TODO redo scope handling to allow methods to work
Potential Fix is to give methods there own scope handler and to make them extend scope
*/
class ScopeHandler{

  constructor(){
    this.scopes = [new Scope()]
    this.currentScope = -1;
  }

  getMethod(methodName) {
    let method = undefined;
    let scope = this.scopes.length-1;
    if (this.currentScope !== -1){
      scope = this.currentScope;
    }
    for (let i=scope; i>=0; i--) {
      method = this.scopes[i].getMethod(methodName);
      if (method) return method;
    }
    //TODO make error on not found
    return method;
  }

  getVariable(methodName) {
    let variable = undefined;
    let scope = this.scopes.length-1;
    if (this.currentScope !== -1){
      scope = this.currentScope;
    }
    for (let i=scope; i>=0; i--) {
      variable = this.scopes[i].getVariable(methodName);
      if (variable) return variable;
    }
    //TODO make error on not found
    return variable;
  }

  setVariable(variableName, variableValue) {
    let scope = this.scopes.length-1;
    if (this.currentScope !== -1){
      scope = this.currentScope;
    }
    for (let i=scope; i>=0; i--) {
      if (this.scopes[i].hasVariable(variableName)) {
        this.scopes[i].setVariable(variableName, variableValue);
        return;
      }
    }
    //TODO make error on not found
  }

  createVariable(variableName){
    let scope = this.scopes.length-1;
    if (this.currentScope !== -1){
      scope = this.currentScope;
    }
    this.scopes[scope].createVariable(variableName);
  }

  increaseScope(){
    if (this.currentScope === -1) {
      this.scopes.push(new Scope());
    }else{
      this.currentScope += 1
      if (this.currentScope === this.scopes.length - 1){
        this.currentScope = this.scopes.length - 1;
      }
    }
  }

  decreaseScope(){
    if (this.currentScope === -1) {
      this.scopes.pop();
    }else{
      this.currentScope -= 1
      if (this.currentScope === this.scopes.length - 1){
        this.currentScope = this.scopes.length - 1;
      }
    }
  }

}

//TODO add more context methods
class CodeContext{
  constructor() {
    this.scopeHandler = new ScopeHandler();
    this.output = new Output();
  }

  setOutput(output){
    this.output = output;
  }

  getMethod(methodName) {
    return this.scopeHandler.getMethod(methodName);
  }

  getVariable(methodName) {
    return this.scopeHandler.getVariable(methodName);
  }

  setVariable(variableName, variableValue) {
    this.scopeHandler.setVariable(variableName, variableValue);
  }

  createVariable(variableName) {
    this.scopeHandler.createVariable(variableName);
  }

  print(text){
    this.output.print(text);
  }

  println(text){
    this.output.println(text);
  }

  clear(){
    this.output.clear();
  }
}

class ReturnToken{
  static Normal = 0;
  static Return = 1;
  static Error = 2;
  static None = 3;
  constructor(type, ret, data){
    this.type = type;
    this.ret = ret;
    this.data = data;
  }
}

class Code{
  execute(context){

  }
}

class Statement extends Code{
  evaluate(context){
    const returnToken = this.execute(context);
    return returnToken.ret;
  }

  execute(context){

  }
}

class ValueStatement extends Statement{

  constructor(value) {
    super();
    this.value = value;
  }

  execute(context) {
    return new ReturnToken(ReturnToken.Normal, this.value);
  }
}

class VariableStatement extends Statement{

  constructor(variableName) {
    super();
    this.variableName = variableName;
  }

  execute(context) {
    return new ReturnToken(ReturnToken.Normal, context.getVariable(this.variableName));
  }

}

//TODO add custom implementation of Addition
class AdditionStatement extends Statement{

  constructor(statement1, statement2) {
    super();
    this.statement1 = statement1;
    this.statement2 = statement2;
  }

  execute(context) {
    const result = this.statement1.evaluate(context) + this.statement2.evaluate(context);
    return new ReturnToken(ReturnToken.Normal, result);
  }

}

//TODO add custom implementation of Subtraction
class SubtractionStatement extends Statement{

  constructor(statement1, statement2) {
    super();
    this.statement1 = statement1;
    this.statement2 = statement2;
  }

  execute(context) {
    const result = this.statement1.evaluate(context) - this.statement2.evaluate(context);
    return new ReturnToken(ReturnToken.Normal, result);
  }

}

//TODO add custom implementation of Multiplication
class MultiplicationStatement extends Statement{

  constructor(statement1, statement2) {
    super();
    this.statement1 = statement1;
    this.statement2 = statement2;
  }

  execute(context) {
    const result = this.statement1.evaluate(context) * this.statement2.evaluate(context);
    return new ReturnToken(ReturnToken.Normal, result);
  }

}

//TODO add custom implementation of Division
class DivisionStatement extends Statement{

  constructor(statement1, statement2) {
    super();
    this.statement1 = statement1;
    this.statement2 = statement2;
  }

  execute(context) {
    const result = this.statement1.evaluate(context) / this.statement2.evaluate(context);
    return new ReturnToken(ReturnToken.Normal, result);
  }

}

//TODO add custom implementation of Equals
class EqualsStatement extends Statement{

  constructor(statement1, statement2) {
    super();
    this.statement1 = statement1;
    this.statement2 = statement2;
  }

  execute(context) {
    const result = this.statement1.evaluate(context) === this.statement2.evaluate(context);
    return new ReturnToken(ReturnToken.Normal, result);
  }

}

//TODO add custom implementation of Less Than
class LessThanStatement extends Statement{

  constructor(statement1, statement2) {
    super();
    this.statement1 = statement1;
    this.statement2 = statement2;
  }

  execute(context) {
    const result = this.statement1.evaluate(context) < this.statement2.evaluate(context);
    return new ReturnToken(ReturnToken.Normal, result);
  }

}

//TODO add custom implementation of Greater Than
class GreaterThanStatement extends Statement{

  constructor(statement1, statement2) {
    super();
    this.statement1 = statement1;
    this.statement2 = statement2;
  }

  execute(context) {
    const result = this.statement1.evaluate(context) < this.statement2.evaluate(context);
    return new ReturnToken(ReturnToken.Normal, result);
  }

}

class AndStatement extends Statement{

  constructor(statement1, statement2) {
    super();
    this.statement1 = statement1;
    this.statement2 = statement2;
  }

  execute(context) {
    const result = this.statement1.evaluate(context) && this.statement2.evaluate(context);
    return new ReturnToken(ReturnToken.Normal, result);
  }

}

class OrStatement extends Statement{

  constructor(statement1, statement2) {
    super();
    this.statement1 = statement1;
    this.statement2 = statement2;
  }

  execute(context) {
    const result1 = this.statement1.evaluate(context);
    const result2 = this.statement2.evaluate(context);
    const result = result1 || result2;
    return new ReturnToken(ReturnToken.Normal, result);
  }

}

class ConditionalStatement extends Statement{
  constructor(statement) {
    super();
    this.statement = statement;
  }

  execute(context){
    return this.statement.execute(context);
  }

  evaluate(context){
    return Boolean(super.evaluate(context));
  }
}

class CodeBlock extends Code {
  constructor() {
    super();
    this.lines = [];
  }

  addLine(line){
    this.lines.push(line);
  }

  execute(context) {
    for (let line of this.lines) {
      if (line instanceof ReturnStatement ) {
        return new ReturnToken(ReturnToken.Return, line.execute(context));
      }
      line.execute(context);
    }
    return new ReturnToken(ReturnToken.Normal);
  }
}

class ReturnStatement extends Statement{
  constructor(statement) {
    super();
    this.statement = statement;
  }

  execute(context) {
    return new ReturnToken(ReturnToken.Return, this.statement.execute(context).ret);
  }
}

//TODO: fix methods to have parameters
class Method {

  constructor(code_block) {
    this.code_block = code_block;
  }

  execute(context){
    return new ReturnToken(ReturnToken.Normal, this.code_block.execute(context));
  }
}

//TODO: fix method calls to have parameters
class MethodCall extends Statement{

  constructor(methodName) {
    super();
    this.methodName = methodName;
  }

  execute(context){
    return context.getMethod(this.methodName).execute(context);
  }
}

class VariableAssignment extends Code{
  constructor(variableName, statement) {
    super();
    this.variableName = variableName;
    this.statement = statement;
  }

  execute(context) {
    context.setVariable(this.variableName, this.statement.evaluate(context))
    return new ReturnToken(ReturnToken.None);
  }
}

class VariableCreation extends Code{
  constructor(variableName) {
    super();
    this.variableName = variableName;
  }

  execute(context) {
    context.createVariable(this.variableName);
    return new ReturnToken(ReturnToken.None);
  }
}

class VariableCreationAndAssignment extends Code{
  constructor(variableName, statement) {
    super();
    this.variableName = variableName;
    this.statement = statement;
  }

  execute(context) {
    context.createVariable(this.variableName);
    context.setVariable(this.variableName, this.statement.evaluate(context));
    return new ReturnToken(ReturnToken.None);
  }
}

class IfStatement extends Code{

  constructor(statement, code_block, else_statement) {
    super();
    this.conditional_statement = new ConditionalStatement(statement);
    this.code_block = code_block;
    if (else_statement){
      this.else_statement = else_statement;
    }else{
      this.else_statement = undefined;
    }
  }

  execute(context){
    context.scopeHandler.increaseScope();
    if (this.conditional_statement.evaluate(context)){
      this.code_block.execute(context);
    }else if (this.else_statement){
      this.else_statement.execute(context);
    }
    context.scopeHandler.decreaseScope();
  }

}

class ElseStatement extends Code {

  constructor(code_block) {
    super();
    this.code_block = code_block;
  }

  execute(context) {
    this.code_block.execute(context);
  }

}

class ElseIfStatement extends IfStatement {
  constructor(statement, code_block, else_statement) {
    super(statement, code_block, else_statement);
  }
}

class WhileStatement extends Code{
  constructor(statement, code_block) {
    super();
    this.conditional_statement = new ConditionalStatement(statement);
    this.code_block = code_block;
  }

  execute(context) {
    while (this.conditional_statement.evaluate(context)){
      this.code_block.execute(context);
    }
  }
}

class ForLoop extends Code{
  constructor(init_statement, condition, loop_end, loop_code) {
    super();
    this.init_statement = init_statement;
    this.condition = new ConditionalStatement(condition);
    this.loop_end = loop_end;
    this.loop_code = loop_code;
  }

  execute(context) {
    this.init_statement.execute(context);
    while (this.conditional_statement.evaluate(context)){
      this.loop_code.execute(context);
      this.loop_end.execute(context);
    }
  }
}

class Print extends Code {
  constructor(statement) {
    super();
    this.statement = statement;
  }

  execute(context) {
    context.print(this.statement.evaluate(context));
    return new ReturnToken(ReturnToken.None);
  }
}

class PrintLine extends Code {
  constructor(statement) {
    super();
    this.statement = statement;
  }

  execute(context) {
    context.println(this.statement.evaluate(context));
    return new ReturnToken(ReturnToken.None);
  }
}

class Token {
  constructor(type, line_number=0, character_number=0) {
    this.type = type;
    this.line_number = line_number;
    this.character_number = character_number;
    this.content = "";
  }
}

class Tokens {
  static IDENTITY_TOKEN = 0;
  static METHOD_TOKEN = 1;
  static METHOD_CALL_TOKEN = 2;
  static RETURN_TOKEN = 3;
  static IF_TOKEN = 4;
  static ELSE_IF_TOKEN = 5;
  static ELSE_TOKEN = 6;
  static WHILE_TOKEN = 7;
  static FOR_TOKEN = 8;
  static SPACE_TOKEN = 9;
  static STRING_TOKEN = 10;
  static EOL_TOKEN = 11;
  static L_PAREN_TOKEN = 12;
  static R_PAREN_TOKEN = 13;
  static COMMENT_TOKEN = 14;
  static VARIABLE_CREATION_TOKEN = 15;
  static CATCH_TOKEN = 16;
  static L_BRACKET_TOKEN = 17;
  static R_BRACKET_TOKEN = 18;
  static VARIABLE_CREATION_AND_ASSIGNMENT_TOKEN = 19;
  static ADDITION_TOKEN = 20;
  static SUBTRACTION_TOKEN = 21;
  static MULTIPLICATION_TOKEN = 22;
  static DIVISION_TOKEN = 23;
  static ASSIGNMENT_TOKEN = 24;
  static VARIABLE_ASSIGNMENT_TOKEN = 25;
  static NUMBER_TOKEN = 26;
  static PRINT_TOKEN = 27;
  static PRINT_LINE_TOKEN = 28;
  static EQUALS_TOKEN = 29;
  static LESS_THAN_TOKEN = 30;
  static GREATER_THAN_TOKEN = 31;
  static AND_TOKEN = 32;
  static OR_TOKEN = 33;
  static NOT_TOKEN = 34;
}

class TokenResponse {
  constructor(hasToken=false, char_count=0, token, content, index) {
    this.hasToken = hasToken;
    this.char_count = char_count;
    this.token = token;
    this.content = content;
    this.index = index;
  }
}

class TokenMatch {
  constructor(level, pattern, match, offset){
    this.level = level;
    this.pattern = pattern;
    this.match = match;
  }
}

class TokenPattern {
  static Patterns = new Map();

  static setPattern(ID, pattern){
    this.Patterns.set(ID, pattern);
  }

  static getPattern(ID){
    return this.Patterns.get(ID);
  }

  static getMatchingPattern(text, end_of_line){
    const keys = Array.from(this.Patterns.keys());
    const patterns = keys.map((key) => this.Patterns.get(key));
    patterns.sort((a, b) => a.level-b.level);
    const matches = [];
    for (let i = 0; i < patterns.length; i++) {
      const pattern = patterns[i];
      let match;
      if (pattern.conditional_pattern){
        match = pattern.conditional_pattern.exec(text);
      }else{
        match = pattern.pattern.exec(text);
      }
      if (match) {
        if (pattern.conditional_pattern){
          match = pattern.pattern.exec(text);
        }
        if (match) {
          const response = new TokenResponse(true, match[0].length, new Token(pattern.type), match[0], match.index);
          matches.push(response);
        }
      }
    }
    matches.sort((a, b) => {
      if (a.index < b.index) return -1;
      if (a.index > b.index) return 1;
      if (b.char_count < a.char_count) return -1;
      if (b.char_count > a.char_count) return 1;
      return a.level-b.level;
    });
    if (matches.length > 0) {
      return matches[0];
    }
    return new TokenResponse();
  }

  constructor(type, pattern = new RegExp(""), level = 999, conditional_pattern) {
    this.pattern = pattern;
    this.level = level;
    this.conditional_pattern = conditional_pattern;
    this.type = type;
  }
}
// Token Pattern Definition
TokenPattern.setPattern(Tokens.IDENTITY_TOKEN,
  new TokenPattern(Tokens.IDENTITY_TOKEN, /\w+/, 10));
TokenPattern.setPattern(Tokens.RETURN_TOKEN,
  new TokenPattern(Tokens.RETURN_TOKEN, /return/, 9));
TokenPattern.setPattern(Tokens.IF_TOKEN,
  new TokenPattern(Tokens.IF_TOKEN, /if/, 9));
TokenPattern.setPattern(Tokens.ELSE_TOKEN,
  new TokenPattern(Tokens.ELSE_TOKEN, /else/, 9));
TokenPattern.setPattern(Tokens.WHILE_TOKEN,
  new TokenPattern(Tokens.WHILE_TOKEN, /while/, 9));
TokenPattern.setPattern(Tokens.FOR_TOKEN,
  new TokenPattern(Tokens.FOR_TOKEN, /for/, 9));
TokenPattern.setPattern(Tokens.VARIABLE_CREATION_TOKEN,
  new TokenPattern(Tokens.VARIABLE_CREATION_TOKEN, /var/, 9));
TokenPattern.setPattern(Tokens.PRINT_TOKEN,
  new TokenPattern(Tokens.PRINT_TOKEN, /print/, 9));
TokenPattern.setPattern(Tokens.PRINT_LINE_TOKEN,
  new TokenPattern(Tokens.PRINT_LINE_TOKEN, /println/, 9));
TokenPattern.setPattern(Tokens.SPACE_TOKEN,
  new TokenPattern(Tokens.SPACE_TOKEN, / /, 11));
TokenPattern.setPattern(Tokens.STRING_TOKEN,
  new TokenPattern(Tokens.STRING_TOKEN, /".+"/, 1, /".+/));
TokenPattern.setPattern(Tokens.EOL_TOKEN,
  new TokenPattern(Tokens.EOL_TOKEN, /;/, 2));
TokenPattern.setPattern(Tokens.L_PAREN_TOKEN,
  new TokenPattern(Tokens.L_PAREN_TOKEN, /\(/, 2));
TokenPattern.setPattern(Tokens.R_PAREN_TOKEN,
  new TokenPattern(Tokens.R_PAREN_TOKEN, /\)/, 2));
TokenPattern.setPattern(Tokens.COMMENT_TOKEN,
  new TokenPattern(Tokens.COMMENT_TOKEN, /\/\/.*/, 0));
TokenPattern.setPattern(Tokens.CATCH_TOKEN,
  new TokenPattern(Tokens.CATCH_TOKEN, /./, 999));
TokenPattern.setPattern(Tokens.ASSIGNMENT_TOKEN,
  new TokenPattern(Tokens.ASSIGNMENT_TOKEN, /=/, 2));
TokenPattern.setPattern(Tokens.ADDITION_TOKEN,
  new TokenPattern(Tokens.ADDITION_TOKEN, /\+/, 2));
TokenPattern.setPattern(Tokens.SUBTRACTION_TOKEN,
  new TokenPattern(Tokens.SUBTRACTION_TOKEN, /-/, 2));
TokenPattern.setPattern(Tokens.MULTIPLICATION_TOKEN,
  new TokenPattern(Tokens.MULTIPLICATION_TOKEN, /\*/, 2));
TokenPattern.setPattern(Tokens.DIVISION_TOKEN,
  new TokenPattern(Tokens.DIVISION_TOKEN, /\//, 2));

TokenPattern.setPattern(Tokens.EQUALS_TOKEN,
  new TokenPattern(Tokens.EQUALS_TOKEN, /==/, 2));
TokenPattern.setPattern(Tokens.GREATER_THAN_TOKEN,
  new TokenPattern(Tokens.GREATER_THAN_TOKEN, /</, 2));
TokenPattern.setPattern(Tokens.LESS_THAN_TOKEN,
  new TokenPattern(Tokens.LESS_THAN_TOKEN, />/, 2));
TokenPattern.setPattern(Tokens.NOT_TOKEN,
  new TokenPattern(Tokens.NOT_TOKEN, /!/, 2));
TokenPattern.setPattern(Tokens.OR_TOKEN,
  new TokenPattern(Tokens.OR_TOKEN, /\|\|/, 2));
TokenPattern.setPattern(Tokens.AND_TOKEN,
  new TokenPattern(Tokens.AND_TOKEN, /&&/, 2));

TokenPattern.setPattern(Tokens.L_BRACKET_TOKEN,
  new TokenPattern(Tokens.L_BRACKET_TOKEN, /\{/, 2));
TokenPattern.setPattern(Tokens.R_BRACKET_TOKEN,
  new TokenPattern(Tokens.R_BRACKET_TOKEN, /}/, 2));
TokenPattern.setPattern(Tokens.NUMBER_TOKEN,
  new TokenPattern(Tokens.NUMBER_TOKEN, /\d+/, 1));
console.log(TokenPattern.getPattern(Tokens.IDENTITY_TOKEN));

class TokenList {
  constructor(tokens) {
    this.tokens = []
    if (tokens){
      this.tokens = tokens;
    }
  }

  hasToken(){
    return this.tokens.length > 0;
  }

  addToken(token){
    this.tokens.push(token);
  }

  reverseTokens(){
    this.tokens.reverse();
  }

  consumeTokens(count){
    for (let i = 0; i < count; i++) {
      this.tokens.pop();
    }
  }

  removeToken(distance){
    return this.tokens.splice(this.tokens.length-1-distance, 1)[0];
  }

  consumeToken(){
    this.consumeTokens(1);
  }

  peekAhead(distance){
    return this.tokens[this.tokens.length - 1 - distance];
  }

  peek(){
    return this.peekAhead(0);
  }

  getToken(){
    return this.tokens.pop();
  }

  getTokens(count){
    const retTokens = [];
    for (let i = 0; i < count; i++) {
      retTokens.push(this.getToken());
    }
    return new TokenList(retTokens);
  }

  distanceToNext(tokenType){
    for (let i = 0; i < this.tokens.length; i++) {
      if (this.tokens[this.tokens.length-1-i].type === tokenType){
        return i;
      }
    }
    return -1;
  }

  consumeTillNext(tokenType){
    this.consumeTokens(this.distanceToNext(tokenType));
  }

  consumeNext(tokenType){
    this.consumeTokens(this.distanceToNext(tokenType)+1);
  }

  getTillNext(tokenType){
    return this.getTokens(this.distanceToNext(tokenType));
  }

  getNext(tokenType){
    return this.getTokens(this.distanceToNext(tokenType)+1);
  }

  containsToken(tokenType){
    return (this.distanceToNext(tokenType) !== -1);
  }
}

class Lexer{

  constructor() {

  }

  handleTokenGeneration(tokens, text, line_num, end_of_line){
    let remaining_text = text;
    let response;
    const length = text.length;
    do {
      response = TokenPattern.getMatchingPattern(remaining_text, end_of_line);
      if (response.hasToken){
        const token = response.token;
        token.line_number = line_num;
        token.character_number = length-remaining_text.length+1+response.index;
        token.content = response.content;
        tokens.addToken(token);
      }
      remaining_text = remaining_text.slice(response.char_count);

    }while (response.hasToken);
    return remaining_text;
  }

  tokenize(text) {
    const tokens = new TokenList();
    let lines = text.split("\n");
    let line_number = 1;
    for (let line of lines) {
      let character_number = 1;
      let current_text = "";
      this.handleTokenGeneration(tokens, line, line_number, true);
      line_number++;
    }
    return tokens;
  }
}

class TokenFilter{
  constructor() {
    this.blackList = [];
  }

  addTokenToFilter(token_type){
    this.blackList.push(token_type);
  }

  containsToken(token_type){
    return this.blackList.includes(token_type);
  }

  filter(tokens){
    tokens.reverseTokens();
    let filtered_tokens = new TokenList();
    while (tokens.hasToken(tokens)){
      const token = tokens.getToken();
      if (!this.containsToken(token.type)){
        filtered_tokens.addToken(token);
      }
    }
    return filtered_tokens;
  }

}

class TokenMergePattern{
  static Patterns = new Map();
  static defaultPattern = new TokenMergePattern();

  static setPattern(token_type, pattern){
    this.Patterns.set(token_type, new TokenMergePattern(pattern));
  }

  static getPattern(token_type){
    const pattern = this.Patterns.get(token_type);
    if (pattern){
      return pattern;
    }else{
      return this.defaultPattern;
    }
  }

  constructor(merge_function){
    if (merge_function) {
      this.merge_function = merge_function;
    }else{
      this.merge_function = (tokens, merged_tokens) => {
        merged_tokens.addToken(tokens.getToken());
      }
    }
  }

  merge(tokens, merged_tokens){
    this.merge_function(tokens, merged_tokens);
  }
}

TokenMergePattern.setPattern(Tokens.VARIABLE_CREATION_TOKEN, (tokens, merged_tokens) => {
  const token = tokens.getToken();
  const next_token = tokens.peekAhead(1);
  if (next_token && next_token.type === Tokens.ASSIGNMENT_TOKEN){
    tokens.removeToken(1);
    token.type = Tokens.VARIABLE_CREATION_AND_ASSIGNMENT_TOKEN;
    token.content = [token.content, next_token.content];
  }
  merged_tokens.addToken(token);
});

TokenMergePattern.setPattern(Tokens.IDENTITY_TOKEN, (tokens, merged_tokens) => {
  const token = tokens.getToken();
  const next_token = tokens.peek();
  if (next_token && next_token.type === Tokens.ASSIGNMENT_TOKEN){
    tokens.consumeToken();
    token.type = Tokens.VARIABLE_ASSIGNMENT_TOKEN;
    token.content = [token.content, next_token.content];
  }
  merged_tokens.addToken(token);
});

class TokenMerger{
  merge(tokens){
    tokens.reverseTokens();
    let merged_tokens = new TokenList();
    while (tokens.hasToken(tokens)){
      const pattern = TokenMergePattern.getPattern(tokens.peek().type);
      pattern.merge(tokens, merged_tokens);
    }
    return merged_tokens;
  }
}

class Statements{
  static BASE_STATEMENT = 0;
  static CODE_BLOCK = 10;
  static IF_BLOCK = 11;
  static ELSE_BLOCK = 12;
  static FOR_BLOCK = 13;
  static WHILE_BLOCK = 14;
  static VARIABLE_CREATION_STATEMENT = 15;
  static VARIABLE_ASSIGNMENT_STATEMENT = 16;
  static VARIABLE_CREATION_ASSIGNMENT_STATEMENT = 17;
  static EQUATION_STATEMENT = 18;
  static PRINT_STATEMENT = 19;
  static PRINT_LINE_STATEMENT = 20;
}

class TokenStatementMap{
  static tokenStatementMap = new Map();

  static mapToken(token_type, statement_type){
    this.tokenStatementMap.set(token_type, statement_type);
  }

  static getStatement(token_type){
    return this.tokenStatementMap.get(token_type);
    //TODO: add error on no statement found
  }
}

TokenStatementMap.mapToken(Tokens.IF_TOKEN, Statements.IF_BLOCK);
TokenStatementMap.mapToken(Tokens.ELSE_IF_TOKEN, Statements.IF_BLOCK);
TokenStatementMap.mapToken(Tokens.ELSE_TOKEN, Statements.ELSE_BLOCK);
TokenStatementMap.mapToken(Tokens.FOR_TOKEN, Statements.FOR_BLOCK);
TokenStatementMap.mapToken(Tokens.WHILE_TOKEN, Statements.WHILE_BLOCK);
TokenStatementMap.mapToken(Tokens.VARIABLE_CREATION_TOKEN, Statements.VARIABLE_CREATION_STATEMENT);
TokenStatementMap.mapToken(Tokens.VARIABLE_CREATION_AND_ASSIGNMENT_TOKEN, Statements.VARIABLE_CREATION_ASSIGNMENT_STATEMENT);
TokenStatementMap.mapToken(Tokens.VARIABLE_ASSIGNMENT_TOKEN, Statements.VARIABLE_ASSIGNMENT_STATEMENT);
TokenStatementMap.mapToken(Tokens.ADDITION_TOKEN, Statements.EQUATION_STATEMENT);
TokenStatementMap.mapToken(Tokens.SUBTRACTION_TOKEN, Statements.EQUATION_STATEMENT);
TokenStatementMap.mapToken(Tokens.MULTIPLICATION_TOKEN, Statements.EQUATION_STATEMENT);
TokenStatementMap.mapToken(Tokens.DIVISION_TOKEN, Statements.EQUATION_STATEMENT);
TokenStatementMap.mapToken(Tokens.IDENTITY_TOKEN, Statements.EQUATION_STATEMENT);
TokenStatementMap.mapToken(Tokens.NUMBER_TOKEN, Statements.EQUATION_STATEMENT);
TokenStatementMap.mapToken(Tokens.L_PAREN_TOKEN, Statements.EQUATION_STATEMENT);
TokenStatementMap.mapToken(Tokens.R_PAREN_TOKEN, Statements.EQUATION_STATEMENT);

TokenStatementMap.mapToken(Tokens.EQUALS_TOKEN, Statements.EQUATION_STATEMENT);
TokenStatementMap.mapToken(Tokens.LESS_THAN_TOKEN, Statements.EQUATION_STATEMENT);
TokenStatementMap.mapToken(Tokens.GREATER_THAN_TOKEN, Statements.EQUATION_STATEMENT);
TokenStatementMap.mapToken(Tokens.AND_TOKEN, Statements.EQUATION_STATEMENT);
TokenStatementMap.mapToken(Tokens.OR_TOKEN, Statements.EQUATION_STATEMENT);
TokenStatementMap.mapToken(Tokens.NOT_TOKEN, Statements.EQUATION_STATEMENT);

TokenStatementMap.mapToken(Tokens.PRINT_TOKEN, Statements.PRINT_STATEMENT);
TokenStatementMap.mapToken(Tokens.PRINT_LINE_TOKEN, Statements.PRINT_LINE_STATEMENT);


class StatementCreators{
  static Creators = new Map();

  static setCreator(statement_type, creator){
    this.Creators.set(statement_type, creator);
  }

  static getCreator(statement_type){
    return this.Creators.get(statement_type);
  }

  static createStatement(statement_type, tokens){
    return this.getCreator(statement_type).createStatement(tokens);
  }
}

class StatementCreator{

  createStatement(tokens){
    if (!tokens.hasToken()){
      //TODO Add Error
    }
    while (tokens.hasToken() && tokens.peek().type === Tokens.EOL_TOKEN){
      tokens.consumeToken();
    }
    if (!tokens.hasToken()){
      return new Code();
    }
    if (debug) printTokens(tokens);
    const token_type = tokens.peek().type;
    if (debug) console.log(token_type);
    const statement_type = TokenStatementMap.getStatement(token_type);
    if (debug) console.log(statement_type)
    const statement_constructor = StatementCreators.getCreator(statement_type);
    if (debug) console.log(statement_constructor)
    const statement = statement_constructor.createStatement(tokens);
    return statement;
  }
}

class VariableCreationCreator extends StatementCreator{

  createStatement(tokens) {
    tokens.consumeToken();
    return new VariableCreation(tokens.getToken().content);
  }

}

class VariableCreationAssignmentCreator extends StatementCreator{
  createStatement(tokens) {
    tokens.consumeToken();
    const token = tokens.getToken();
    return new VariableCreationAndAssignment(token.content, StatementCreators.createStatement(Statements.BASE_STATEMENT, tokens));
  }
}

class VariableAssignmentCreator extends StatementCreator{

  createStatement(tokens) {
    const token = tokens.getToken();
    return new VariableAssignment(token.content[0], StatementCreators.createStatement(Statements.BASE_STATEMENT, tokens));
  }

}

class CodeBlockCreator extends StatementCreator{

  createLine(tokens){
    return StatementCreators.createStatement(Statements.BASE_STATEMENT, tokens);
  }

  createStatement(tokens){
    const code_block = new CodeBlock();
    let next_token = tokens.peek()
    while (next_token && next_token.type !== Tokens.R_BRACKET_TOKEN){
      const line = this.createLine(tokens)
      code_block.addLine(line);
      next_token = tokens.peek();
      console.log(code_block)
    }
    return code_block;
  }

}

class IfBlockCreator extends StatementCreator{

  createStatement(tokens){
    //TODO: handle parenthesis and structure of if block;
    //tokens.consumeTillNext(Tokens.L_PAREN_TOKEN);
    tokens.consumeToken();
    const condition = StatementCreators.createStatement(Statements.BASE_STATEMENT, tokens);
    tokens.consumeNext(Tokens.L_BRACKET_TOKEN);
    console.log("test")
    const code_block = StatementCreators.createStatement(Statements.CODE_BLOCK, tokens);
    let else_block;
    if (tokens.hasToken()){
      if (tokens.peek().type === Tokens.ELSE_IF_TOKEN || tokens.peek().type === Tokens.ELSE_TOKEN){
        else_block = StatementCreators.createStatement(Statements.BASE_STATEMENT, tokens);
      }
    }
    const if_block = new IfStatement(condition, code_block, else_block);
    return if_block;
  }

}

class EquationStatementCreator extends StatementCreator{

  handleTokenType(tokens, token_type, statement){
    if (tokens.containsToken(token_type)){
      const before = tokens.getTillNext(token_type);
      const token = tokens.getToken();
      const after = tokens;
      const constructed_statement =  new statement(StatementCreators.createStatement(Statements.BASE_STATEMENT, before), StatementCreators.createStatement(Statements.BASE_STATEMENT, after));
      before.reverseTokens();
      while (before.hasToken()){
        tokens.addToken(before.getToken());
      }
      return constructed_statement
    }
  }

  handleParenthesis(tokens){
    if (tokens.containsToken(Tokens.L_PAREN_TOKEN)){
      let level = 1;
      tokens.consumeToken();
      const parenthesis_tokens = new TokenList();
      while (level>0){
        const token = tokens.getToken();
        //TODO add error on no matching Parenthesis
        if (token.type === Tokens.L_PAREN_TOKEN) {
          level += 1;
        }else if (token.type === Tokens.R_PAREN_TOKEN){
          level -= 1;
          if (level === 0) continue;
        }
        parenthesis_tokens.addToken(token);
      }
      //parenthesis_tokens.reverseTokens();
      return StatementCreators.createStatement(Statements.BASE_STATEMENT, parenthesis_tokens);
    }
  }

  handleNot(tokens){
    return undefined;
  }

  handleMethod(tokens){
    return undefined;
  }

  handleIdentity(tokens){
    if (tokens.containsToken(Tokens.IDENTITY_TOKEN)){
      const token = tokens.removeToken(tokens.distanceToNext(Tokens.IDENTITY_TOKEN));
      return new VariableStatement(token.content);
    }
  }

  handleInt(tokens){
    if (tokens.containsToken(Tokens.NUMBER_TOKEN)){
      const token = tokens.removeToken(tokens.distanceToNext(Tokens.NUMBER_TOKEN));
      return new ValueStatement(Number.parseFloat(token.content));
    }
  }

  handleValue(tokens){
    const int = this.handleInt(tokens);
    if (int) return int;
  }

  handleLogic(tokens){
    const and = this.handleTokenType(tokens, Tokens.AND_TOKEN, AndStatement)
    if (and) return and;
    const or = this.handleTokenType(tokens, Tokens.OR_TOKEN, OrStatement);
    if (or) return or;
    const equals =  this.handleTokenType(tokens, Tokens.EQUALS_TOKEN, EqualsStatement);
    if (equals) return equals
    const less = this.handleTokenType(tokens, Tokens.LESS_THAN_TOKEN, LessThanStatement);
    if (less) return less
    const greater =  this.handleTokenType(tokens, Tokens.GREATER_THAN_TOKEN, GreaterThanStatement);
    if (greater) return greater;
  }

  handleArithmetic(tokens){
    const mult = this.handleTokenType(tokens, Tokens.MULTIPLICATION_TOKEN, MultiplicationStatement)
    if (mult) return mult;
    const div = this.handleTokenType(tokens, Tokens.DIVISION_TOKEN, DivisionStatement);
    if (div) return div;
    const add = this.handleTokenType(tokens, Tokens.ADDITION_TOKEN, AdditionStatement);
    if (add) return add;
    const sub =  this.handleTokenType(tokens, Tokens.SUBTRACTION_TOKEN, SubtractionStatement);
    if (sub) return sub;
  }

  getStatement(tokens){
    const method = this.handleMethod(tokens);
    if (method) return  method;
    const parenthesis = this.handleParenthesis(tokens);
    if (parenthesis) return parenthesis;
    const logic = this.handleLogic(tokens);
    if (logic) return logic;
    const arithmetic = this.handleArithmetic(tokens);
    if (arithmetic) return arithmetic;
    const not = this.handleNot(tokens);
    if (not) return not;
    const identity = this.handleIdentity(tokens);
    if (identity) return identity;
    const value = this.handleValue(tokens);
    if (value) return value;
  }

  createStatement(tokens){
    let equation_tokens = tokens
    if (tokens.containsToken(Tokens.EOL_TOKEN)){
      equation_tokens = tokens.getNext(Tokens.EOL_TOKEN);
    }else if (tokens.containsToken(Tokens.L_BRACKET_TOKEN)){
      equation_tokens = tokens.getNext(Tokens.L_BRACKET_TOKEN);
    }else if (tokens.containsToken(Tokens.R_BRACKET_TOKEN)){
      equation_tokens = tokens.getNext(Tokens.R_BRACKET_TOKEN);
    }
    equation_tokens.reverseTokens();
    const statement = this.getStatement(equation_tokens)
    equation_tokens.reverseTokens();
    if (equation_tokens.tokens.length>0 && equation_tokens !== tokens){
      equation_tokens.reverseTokens();
      while (equation_tokens.hasToken()){
        tokens.addToken(equation_tokens.getToken());
      }
    }
    return statement
  }

}

class PrintStatementCreator extends StatementCreator{

  createStatement(tokens)  {
    tokens.consumeToken()
    return new Print(StatementCreators.createStatement(Statements.BASE_STATEMENT, tokens));
  }

}

class PrintLineStatementCreator extends StatementCreator{
  createStatement(tokens) {
    tokens.consumeToken()
    return new PrintLine(StatementCreators.createStatement(Statements.BASE_STATEMENT, tokens));
  }
}

StatementCreators.setCreator(Statements.BASE_STATEMENT, new StatementCreator());
StatementCreators.setCreator(Statements.CODE_BLOCK, new CodeBlockCreator());
StatementCreators.setCreator(Statements.IF_BLOCK, new IfBlockCreator());
StatementCreators.setCreator(Statements.VARIABLE_CREATION_STATEMENT, new VariableCreationCreator());
StatementCreators.setCreator(Statements.VARIABLE_ASSIGNMENT_STATEMENT, new VariableAssignmentCreator());
StatementCreators.setCreator(Statements.VARIABLE_CREATION_ASSIGNMENT_STATEMENT, new VariableCreationAssignmentCreator());
StatementCreators.setCreator(Statements.EQUATION_STATEMENT, new EquationStatementCreator());
StatementCreators.setCreator(Statements.PRINT_STATEMENT, new PrintStatementCreator());
StatementCreators.setCreator(Statements.PRINT_LINE_STATEMENT, new PrintLineStatementCreator());


class Parser {

  constructor(){}

  createCode(tokens){
    tokens.reverseTokens()
    return StatementCreators.createStatement(Statements.CODE_BLOCK, tokens);
  }

}

class Compiler {
  constructor(){}

  compile(code){}

}



function printTokens(tokens){
  for (let token of tokens.tokens){
    if (debug_token) console.log(token);
  }
}

const pre_merge_filter = new TokenFilter();
pre_merge_filter.addTokenToFilter(Tokens.SPACE_TOKEN);
pre_merge_filter.addTokenToFilter(Tokens.COMMENT_TOKEN);

const post_merge_filter = new TokenFilter();


const lexer = new Lexer();
const merger = new TokenMerger();
const parser = new Parser();
const context = new CodeContext();
let tokens;
function run(){
  const code = document.getElementById("code");
  tokens = lexer.tokenize(code.value);
  printTokens(tokens);
  console.log("Filtering")
  tokens = pre_merge_filter.filter(tokens);
  printTokens(tokens);
  console.log("Merging")
  tokens = merger.merge(tokens);
  printTokens(tokens);
  console.log("Filtering")
  tokens = post_merge_filter.filter(tokens);
  printTokens(tokens);
  console.log("Creating Code");
  let code_block = parser.createCode(tokens);
  console.log(code_block);
  const line = code_block.lines[code_block.lines.length-1];
  //code_block.lines[code_block.lines.length-1] = new PrintLine(line);
  code_block.execute(context);
  console.log(context);
}
function onload(){
  document.getElementById("code").value ="var a;\na = 1;\nvar b = 4;\nprintln a+b"
  const output = new ElementOutput("output");
  context.setOutput(output);
  document.getElementById("run").onclick = run;
}
document.body.onload = onload;
