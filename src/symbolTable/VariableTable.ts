import {LiteralNode} from '../parser/AST.js';

type Scope = string;
type VariableName = string;

export class VariableTable {
  private variables: Map<Scope, Map<VariableName, LiteralNode>>;
  private currentScope: Scope;

  constructor() {
    this.variables = new Map();
    this.currentScope = 'global';
    this.variables.set(this.currentScope, new Map());
  }

  public enterScope(scope: Scope) {
    this.currentScope = `${this.currentScope}=>${scope}`;
    if (!this.variables.has(this.currentScope)) {
      this.variables.set(this.currentScope, new Map());
    }
  }

  public exitScope() {
    this.variables.delete(this.currentScope);
    const scopes = Array.from(this.variables.keys());
    this.currentScope = scopes[scopes.length - 1] || 'global';
  }

  public addVariable(name: string, value: LiteralNode) {
    const scopeVariables = this.variables.get(this.currentScope);

    if (scopeVariables && !scopeVariables.has(name)) {
      return scopeVariables.set(name, value);
    }

    throw new SyntaxError(
      `SyntaxError: Variable '${name}' has already been declared.`
    );
  }

  public getVariableValue(name: string): LiteralNode | undefined {
    const scopes = Array.from(this.variables.keys()).reverse();

    for (const scope of scopes) {
      const scopeVariables = this.variables.get(scope);

      if (scopeVariables && scopeVariables.has(name)) {
        return scopeVariables.get(name);
      }
    }

    throw new ReferenceError(
      `ReferenceError: Variable '${name}' is not defined.`
    );
  }

  public updateVariableValue(name: string, value: LiteralNode, line: number) {
    const scopes = Array.from(this.variables.keys()).reverse();

    for (const scope of scopes) {
      const scopeVariables = this.variables.get(scope);

      if (scopeVariables && scopeVariables.has(name)) {
        const currentVariableType = this.getVariableValue(name)?.type;

        if (value.type === currentVariableType) {
          return scopeVariables.set(name, value);
        }

        throw new TypeError(
          `TypeError: Type '${value.type}' is not assignable to variable type '${currentVariableType}' at line ${line}.`
        );
      }
    }

    throw new ReferenceError(
      `ReferenceError: Variable '${name}' is not declared.`
    );
  }
}
