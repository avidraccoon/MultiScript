"use strict";
const ADDITION_IMPLEMENTATION = ``;
const MATH_IMPLEMENTATION = ``;
var CustomImplementations;
(function (CustomImplementations) {
    CustomImplementations[CustomImplementations["ADDITION"] = 0] = "ADDITION";
    CustomImplementations[CustomImplementations["MATH_FUNCTIONS"] = 1] = "MATH_FUNCTIONS";
})(CustomImplementations || (CustomImplementations = {}));
const CustomImplementationsCode = new Map();
CustomImplementationsCode.set(CustomImplementations.ADDITION, ADDITION_IMPLEMENTATION);
CustomImplementationsCode.set(CustomImplementations.MATH_FUNCTIONS, MATH_IMPLEMENTATION);
class CustomImplementationUsage {
    constructor() {
        this.usedImplementations = new Map();
    }
    hasUsedImplementation(implementation) {
        return this.usedImplementations.has(implementation);
    }
    useCustomImplemtation(implementation) {
        if (!this.hasUsedImplementation(implementation)) {
            this.usedImplementations.set(implementation, true);
            return CustomImplementationsCode.get(implementation);
        }
        return "";
    }
}
