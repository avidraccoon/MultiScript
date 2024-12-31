
const ADDITION_IMPLEMENTATION: string = ``;
const MATH_IMPLEMENTATION: string = ``;

enum CustomImplementations {
  ADDITION ,
  MATH_FUNCTIONS
}

const CustomImplementationsCode = new Map<CustomImplementations, string>();
CustomImplementationsCode.set(CustomImplementations.ADDITION, ADDITION_IMPLEMENTATION);
CustomImplementationsCode.set(CustomImplementations.MATH_FUNCTIONS, MATH_IMPLEMENTATION);

class CustomImplementationUsage {

  private usedImplementations: Map<CustomImplementations, boolean> = new Map();


  public constructor() {

  }

  private hasUsedImplementation(implementation: CustomImplementations): boolean {
    return this.usedImplementations.has(implementation)
  }

  public useCustomImplemtation(implementation: CustomImplementations): string {
    if (!this.hasUsedImplementation(implementation)) {
      this.usedImplementations.set(implementation, true);
      return <string>CustomImplementationsCode.get(implementation);
    }
    return "";
  }

}
