
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

class ScopeHandler{

  constructor(){
    this.scopes = [new Scope()]
  }

  getMethod(methodName) {
    let method = undefined;
    for (let i=0; i<this.scopes.length; i++) {
      method = this.scopes[i].getMethod(methodName);
      if (method) return method;
    }
    //TODO make error on not found
    return method;
  }

  getVariable(methodName) {
    let variable = undefined;
    for (let i=0; i<this.scopes.length; i++) {
      variable = this.scopes[i].getVariable(methodName);
      if (variable) return variable;
    }
    //TODO make error on not found
    return variable;
  }

  setVariable(variableName, variableValue) {
    for (let i=0; i<this.scopes.length; i++) {
      if (this.scopes[i].hasVariable(variableName)) {
        this.scopes[i].setVariable(variableName, variableValue);
        return;
      }
    }
    //TODO make error on not found
  }

  createVariable(variableName){
    this.scopes[this.scopes.length-1].createVariable(variableName);
  }

  increaseScope(){
    this.scopes.push(new Scope());
  }

  decreaseScope(){
    this.scopes.pop();
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
    const result = this.statement1.evaluate(context) == this.statement2.evaluate(context);
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
    const result = this.statement1.evaluate(context) || this.statement2.evaluate(context);
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
      //console.log(line)
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

class Method {

  constructor(code_block) {
    this.code_block = code_block;
  }

  execute(context){
    return new ReturnToken(ReturnToken.Normal, this.code_block.execute(context));
  }
}

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
    if (this.conditional_statement.evaluate(context)){
      this.code_block.execute(context);
    }else if (this.else_statement){
      this.else_statement.execute(context);
    }
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
}

class TokenResponse {
  constructor(hasToken=false, char_count=0, token, content) {
    this.hasToken = hasToken;
    this.char_count = char_count;
    this.token = token;
    this.content = content;
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
    let ignore_terminating = false;
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
        console.log(pattern.pattern, (match)?match[0]:0, ignore_terminating, text)
        //console.log(pattern.terminating, !ignore_terminating, (pattern.terminating && !ignore_terminating))
        if (pattern.terminating && matches.length > 0){
          for (let prev of matches){
            let prev_match = prev.pattern.pattern.exec(text);
            if (prev_match) {
              return new TokenResponse(true, prev_match[0].length, new Token(prev.pattern.type), prev_match[0]);
            }
          }
        }
        if (match && (end_of_line || (match[0].length < text.length && matches.length === 0) || (pattern.terminating && !ignore_terminating) || pattern.bypass_ignore)) {
          return new TokenResponse(true, match[0].length, new Token(pattern.type), match[0]);
        }else{
          matches.push(new TokenMatch(pattern.level, pattern, match, 0));
          if (pattern.ignore_terminating){
            ignore_terminating = true;
          }
        }
      }
    }
    return new TokenResponse();
  }

  constructor(type, pattern = new RegExp(""), level = 999, terminating = false, ignore_terminating = false, bypass_ignore = false, conditional_pattern) {
    this.pattern = pattern;
    this.level = level;
    this.terminating = terminating;
    this.conditional_pattern = conditional_pattern;
    this.ignore_terminating = ignore_terminating;
    this.bypass_ignore = bypass_ignore;
    this.type = type;
  }
}
// Token Pattern Definition
TokenPattern.setPattern(Tokens.IDENTITY_TOKEN,
  new TokenPattern(Tokens.IDENTITY_TOKEN, /\w+/, 10));
TokenPattern.setPattern(Tokens.RETURN_TOKEN,
  new TokenPattern(Tokens.RETURN_TOKEN, /return/, 9));
TokenPattern.setPattern(Tokens.SPACE_TOKEN,
  new TokenPattern(Tokens.SPACE_TOKEN, / /, 11, true));
TokenPattern.setPattern(Tokens.STRING_TOKEN,
  new TokenPattern(Tokens.STRING_TOKEN, /".+"/, 5, true, true, true, /".+/));

console.log(TokenPattern.getPattern(Tokens.IDENTITY_TOKEN));

class TokenList {
  constructor(tokens) {
    this.tokens = []
    if (tokens){
      this.tokens = tokens;
    }
  }

  addToken(token){
    this.tokens.push(token);
  }

  startParsing(){
    this.tokens.reverse();
  }

  consumeTokens(count){
    for (let i = 0; i < count; i++) {
      this.tokens.pop();
    }
  }

  consumeToken(){
    this.consumeTokens(1);
  }

  peekAhead(distance){
    return this.tokens[this.tokens.length - 1 - distance];
  }

  peek(){
    return this.peekAhead(1);
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
}

class Lexer{

  constructor() {

  }

  handleTokenGeneration(tokens, text, line_num, character_num, end_of_line){
    let remaining_text = text;
    let response;
    do {
      response = TokenPattern.getMatchingPattern(remaining_text, end_of_line);
      console.log(response)
      if (response.hasToken){
        const token = response.token;
        token.line_number = line_num;
        token.character_number = character_num-response.char_count+1;
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
      const line_length = line.length;
      for (let char of line) {
        current_text+=char;
        current_text = this.handleTokenGeneration(tokens, current_text, line_number, character_number, character_number===line_length);
        character_number++;
      }
      line_number++;
    }
    for (let token of tokens.tokens){
      console.log(token)
    }
    return tokens;
  }
}

class Parser {
}

class Compiler {
  constructor(){}

  compile(code){}

}

const lexer = new Lexer();
function run(){
  const code = document.getElementById("code");
  lexer.tokenize(code.value);
}

document.getElementById("run").onclick = run;
