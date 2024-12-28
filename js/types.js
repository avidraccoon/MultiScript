//TODO shift scopes to use objects

const classMap = new Map();

function registerClass(type, classObject){
  classMap.set(type, classObject);
}

class Types{
  static OBJECT = "Object";
  static INT = "Integer";
  static FLOAT = "Float";
  static STRING = "String";
  static ARRAY = "Array";
}


class Class{

  constructor(baseObjectClass = BaseObject) {
    this.baseObjectClass = baseObjectClass;
    this.static_fields = new Map();
    this.static_methods = new Map();
  }

  registerMethod(methodName, method){
    this.static_fields.set(methodName, method);
  }

  getField(fieldName){
    return this.static_fields.get(fieldName);
  }

  setField(fieldName, value){
    this.static_fields.set(fieldName, value);
  }

  hasField(fieldName){
    return this.static_fields.has(fieldName);
  }

  getMethod(methodSignature){
    this.static_methods.get(methodSignature);
  }

  createObject(){
    return new this.baseObjectClass();
  }

}

//Types are field, array
class ObjectPathNode{
  static Field = 0;
  static Array = 1;
  constructor(type, path) {
    this.type = type;
    this.path = path
  }

  clone(){
    return new ObjectPathNode(this.type, this.path);
  }
}

class ObjectPath{
  constructor(base_object){
    this.base_object = base_object;
    this.path = [];
    this.offset = 0;
  }

  getCurrentNode(){
    return this.path[this.currentLength()-1];
  }

  currentLength(){
    return this.path.length-this.offset;
  }

  addNode(node){
    this.path.push(node);
  }

  resetOffset(){
    this.offset = 0;
  }

  forwardNode(){
    this.offset--;
  }

  backNode(){
    this.offset++;
  }

  atStart(){
    return this.offset >= this.path.length-1;
  }

  atEnd(){
    return this.offset <= 0;
  }

  removeNode(node){
    this.path.pop();
  }

  getObject(){
    let obj = this.base_object;
    if (this.base_object instanceof ObjectPath){
      obj = obj.getObject();
    }
    for (let i = 0; i < this.path.length-this.offset; i++){
      const node = this.path[i];
      if (obj) {
        if (node.type === ObjectPathNode.Field) {
          obj = obj.getField(node.path);
        } else if (node.type === ObjectPathNode.Array) {
          obj = obj.getElement(node.path);
        }
      }else{
        //TODO create error on undefined
      }
    }
    return obj;
  }

  clone(){
    const path = new ObjectPath(this.base_object);
    path.path = [];
    for (let i = 0; i < this.path.length-this.offset; i++){
      const node = this.path[i];
      path.addNode(node.clone());
    }
    return path;
  }

}

class BaseObject{

  constructor(type = Types.OBJECT){
    this.type = type;
    this.class = classMap.get(type);
    this.methods = new Map();
    this.fields = new Map();
  }

  cast(other_object){
    return other_object;
  }

  setMethod(methodName, method){
    /*if (this.methods.has(methodName)){
      this.methods.get(methodName).scope = undefined;
    }
    this.methods.set(methodName, method);*/
    this.setField(methodName, method);
  }

  hasMethod(methodName){
    return (this.methods.has(methodName) || this.class.static_methods.has(methodName));
  }

  getMethod(methodName){
    this.getField(methodName)
    /*if (this.methods.has(methodName)){
      return this.methods.get(methodName);
    }else{
      return this.class.static_methods.get(methodName);
    }*/
  }

  getField(fieldName){
    if (this.fields.has(fieldName)){
      return this.fields.get(fieldName);
    }else{
      return this.class.getField(fieldName);
    }
  }

  setField(fieldName, value){
    console.log(this.fields, fieldName)
    if (this.fields.has(fieldName)) {
      this.fields.set(fieldName, value);
    } else {
      this.class.setField(fieldName, value);
    }
  }

  createField(fieldName){
    this.fields.set(fieldName, undefined);
  }

  hasField(fieldName){
    return (this.fields.has(fieldName) || this.class.hasField(fieldName));
  }

  toString(){
    return `[object ${this.type}]`
  }


}

class StringObject extends BaseObject{
  constructor() {
    super(Types.STRING);
  }

  cast(other_object){
    return other_object.toString();
  }
}

class IntObject extends BaseObject{
  constructor(){
    super(Types.INT);

  }
}

class FloatObject extends BaseObject{
  constructor(){
    super(Types.FLOAT);

  }
}

class ArrayObject extends BaseObject{
  constructor() {
    super(Types.ARRAY);
    this.elements = [];
  }

  getElement(index){
    return this.elements[index];
  }

  setElement(index, value){
    this.elements[index] = value;
  }

  pushElement(element){
    this.elements.push(element);
  }

  popElement(){
    return this.elements.pop();
  }

  length(){
    return this.elements.length;
  }
}

const ObjectClass = new Class(BaseObject);
const IntegerClass = new Class(IntObject);
const FloatClass = new Class(FloatObject);
const StringClass = new Class(StringObject);
const ArrayClass = new Class(ArrayObject);

registerClass(Types.OBJECT, ObjectClass);
registerClass(Types.INT, IntegerClass);
registerClass(Types.FLOAT, FloatClass);
registerClass(Types.STRING, StringClass);
registerClass(Types.ARRAY, ArrayClass);
