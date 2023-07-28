import {FunctionDefinitionNode, LiteralNode} from '../parser/AST.js';

type Scope = string;
type FunctionName = string;

export class FunctionTable {
  private functions: Map<Scope, Map<FunctionName, FunctionDefinitionNode[]>>;
  private currentScope: Scope;

  constructor() {
    this.functions = new Map();
    this.currentScope = 'global';
    this.functions.set(this.currentScope, new Map());
  }

  public enterScope(scope: Scope) {
    this.currentScope = `${this.currentScope}=>${scope}`;
    if (!this.functions.has(this.currentScope)) {
      this.functions.set(this.currentScope, new Map());
    }
  }

  public exitScope() {
    this.functions.delete(this.currentScope);
    const scopes = Array.from(this.functions.keys());
    this.currentScope = scopes[scopes.length - 1] || 'global';
  }

  public addFunction(func: FunctionDefinitionNode) {
    const {functionName, params} = func;
    const name = functionName.value;

    const scopeFunctions = this.functions.get(this.currentScope)!;

    if (!scopeFunctions.has(functionName.value)) {
      return scopeFunctions.set(name, [func]);
    }

    const functions = scopeFunctions.get(functionName.value)!;
    for (const fn of functions) {
      if (!fn.params.length && !params.length) {
        throw new SyntaxError(
          `SyntaxError: Function '${functionName.value}' is already defined.`
        );
      }

      if (fn.params.length === params.length) {
        if (
          fn.params.every((param, i) => param.paramType === params[i].paramType)
        ) {
          throw new SyntaxError(
            `SyntaxError: Function '${functionName.value}' is already defined with the same parameter types.`
          );
        }
      }
    }

    functions.push(func);
    return scopeFunctions.set(functionName.value, functions);
  }

  public getFunction(
    name: string,
    args: LiteralNode[]
  ): FunctionDefinitionNode {
    const scopes = Array.from(this.functions.keys()).reverse();

    for (const scope of scopes) {
      const scopeFunctions = this.functions.get(scope)!;

      if (scopeFunctions.has(name)) {
        const functions = scopeFunctions.get(name)!;

        for (const fn of functions) {
          if (
            fn.params.every((param, i) => param.paramType.type === args[i].type)
          ) {
            return fn;
          }
        }

        throw new TypeError(
          `TypeError: No matching function found for call to '${name}'`
        );
      }
    }

    throw new ReferenceError(
      `ReferenceError: Function '${name}' is not defined.`
    );
  }
}
