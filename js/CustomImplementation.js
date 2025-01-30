"use strict";
//TODO Clean up
//TODO write documentation
//JavaScript
const JAVASCRIPT_ADDITION_IMPLEMENTATION = `
function fixed_javascript_add(a, b){
  if (a instanceof Array) {
    if (b instanceof Array) {
      return a.concat(b);
    }
  }
  return a + b;
}
`;
const JAVASCRIPT_MATH_IMPLEMENTATION = ``;
var JavaScriptCustomImplementations;
(function (JavaScriptCustomImplementations) {
    JavaScriptCustomImplementations[JavaScriptCustomImplementations["ADDITION"] = 0] = "ADDITION";
    JavaScriptCustomImplementations[JavaScriptCustomImplementations["MATH_FUNCTIONS"] = 1] = "MATH_FUNCTIONS";
})(JavaScriptCustomImplementations || (JavaScriptCustomImplementations = {}));
const JavaScriptCustomImplementationsCode = new Map();
JavaScriptCustomImplementationsCode.set(JavaScriptCustomImplementations.ADDITION, JAVASCRIPT_ADDITION_IMPLEMENTATION);
JavaScriptCustomImplementationsCode.set(JavaScriptCustomImplementations.MATH_FUNCTIONS, JAVASCRIPT_MATH_IMPLEMENTATION);
class CustomImplementationUsage {
    constructor(customImplementations) {
        this.usedImplementations = new Map();
        this.customImplementations = customImplementations;
    }
    hasUsedImplementation(implementation) {
        return this.usedImplementations.has(implementation);
    }
    useCustomImplemtation(implementation) {
        if (!this.hasUsedImplementation(implementation)) {
            this.usedImplementations.set(implementation, true);
            return this.customImplementations.get(implementation);
        }
        return "";
    }
}
