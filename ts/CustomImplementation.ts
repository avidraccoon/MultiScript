//TODO Clean up
//TODO write documentation



//JavaScript
const JAVASCRIPT_ADDITION_IMPLEMENTATION: string = `
function fixed_javascript_add(a, b){
  if (a instanceof Array) {
    if (b instanceof Array) {
      return a.concat(b);
    }
  }
  return a + b;
}
`;
const JAVASCRIPT_MATH_IMPLEMENTATION: string = ``;

enum JavaScriptCustomImplementations {
  ADDITION ,
  MATH_FUNCTIONS
}
const JavaScriptCustomImplementationsCode = new Map<CustomImplementations, string>();
JavaScriptCustomImplementationsCode.set(JavaScriptCustomImplementations.ADDITION, JAVASCRIPT_ADDITION_IMPLEMENTATION);
JavaScriptCustomImplementationsCode.set(JavaScriptCustomImplementations.MATH_FUNCTIONS, JAVASCRIPT_MATH_IMPLEMENTATION);



type CustomImplementations = JavaScriptCustomImplementations;

class CustomImplementationUsage {

  private usedImplementations: Map<CustomImplementations, boolean> = new Map();
  private customImplementations: Map<CustomImplementations, string>;

  public constructor(customImplementations: Map<CustomImplementations, string>) {
    this.customImplementations = customImplementations;
  }

  private hasUsedImplementation(implementation: CustomImplementations): boolean {
    return this.usedImplementations.has(implementation)
  }

  public useCustomImplemtation(implementation: CustomImplementations): string {
    if (!this.hasUsedImplementation(implementation)) {
      this.usedImplementations.set(implementation, true);
      return <string>this.customImplementations.get(implementation);
    }
    return "";
  }

}
