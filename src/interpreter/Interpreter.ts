import builtins from '../builtins/index.js';
import {
  ANDLogicalNode,
  AdditionNode,
  ArithmeticExpressionNode,
  AssignmentVariableNode,
  BooleanNode,
  ConditionalExpressionNode,
  DivisionNode,
  EqualNode,
  ExpressionNode,
  FunctionCallNode,
  FunctionDefinitionNode,
  GreaterThanNode,
  GreaterThanOrEqualNode,
  IdentifierNode,
  IfElseStatementNode,
  LessThanNode,
  LessThanOrEqualNode,
  LiteralNode,
  LogicalExpressionNode,
  MultiplicationNode,
  NegationNode,
  NoneNode,
  NotEqualNode,
  NumberNode,
  ORLogicalNode,
  PrintNode,
  ProgramNode,
  ReturnStatmentNode,
  StatementNode,
  StringNode,
  SubtractionNode,
  VariableDeclarationNode,
  WhileStatementNode,
} from '../parser/AST.js';
import {FunctionTable} from '../symbolTable/FunctionTable.js';
import {VariableTable} from '../symbolTable/VariableTable.js';

export default class Interpreter {
  private variableTable: VariableTable;
  private functionTable: FunctionTable;

  constructor() {
    this.variableTable = new VariableTable();
    this.functionTable = new FunctionTable();
  }

  public async interpret({statements}: ProgramNode) {
    for (const statement of statements) {
      const value = await this.executeStatement(statement);
      if (value) return value;
    }
  }

  private async executeStatement(statement: StatementNode) {
    if (statement instanceof VariableDeclarationNode) {
      await this.executeVariableDeclaration(statement);
    } else if (statement instanceof AssignmentVariableNode) {
      await this.executeAssigmentVariable(statement);
    } else if (statement instanceof PrintNode) {
      await this.executePrint(statement);
    } else if (statement instanceof FunctionDefinitionNode) {
      this.executeFunctionDefinition(statement);
    } else if (statement instanceof FunctionCallNode) {
      await this.executeFunctionCall(statement);
    } else if (statement instanceof ReturnStatmentNode) {
      return await this.executeReturn(statement);
    } else if (statement instanceof IfElseStatementNode) {
      const value = await this.executeIfElseStatement(statement);
      if (!(value instanceof NoneNode)) return value;
    } else if (statement instanceof WhileStatementNode) {
      const value = await this.executeWhileStatementNode(statement);
      if (!(value instanceof NoneNode)) return value;
    } else {
      throw new SyntaxError('SyntaxError: Invalid statement.');
    }
  }

  private async executeWhileStatementNode(
    statement: WhileStatementNode
  ): Promise<LiteralNode> {
    const conditional = await this.evaluateExpression(statement.conditional);

    let value: LiteralNode = new NoneNode();
    if (conditional.value) {
      this.functionTable.enterScope('while');
      this.variableTable.enterScope('while');
      value = (await this.interpret(statement.block)) || new NoneNode();
      this.variableTable.exitScope();
      this.functionTable.exitScope();
      if (!(value instanceof NoneNode)) return value;
      await this.executeWhileStatementNode(statement);
    }
    return value;
  }

  private async executeIfElseStatement({
    conditional,
    ifBlock,
    elseIfBlock,
    elseBlock,
  }: IfElseStatementNode) {
    const condition = await this.evaluateExpression(conditional);
    if (condition.value) {
      this.functionTable.enterScope('if');
      this.variableTable.enterScope('if');
      const value: LiteralNode =
        (await this.interpret(ifBlock)) || new NoneNode();
      this.variableTable.exitScope();
      this.functionTable.exitScope();
      return value;
    } else {
      for (const {conditional, ifBlock} of elseIfBlock) {
        const condition = await this.evaluateExpression(conditional);
        if (condition.value) {
          this.functionTable.enterScope('if');
          this.variableTable.enterScope('if');
          const value: LiteralNode =
            (await this.interpret(ifBlock)) || new NoneNode();
          this.variableTable.exitScope();
          this.functionTable.exitScope();
          return value;
        }
      }
      if (elseBlock) {
        this.functionTable.enterScope('else');
        this.variableTable.enterScope('else');
        const value: LiteralNode =
          (await this.interpret(elseBlock.elseBlock)) || new NoneNode();
        this.variableTable.exitScope();
        this.functionTable.exitScope();
        return value;
      }
    }
  }

  private async executeVariableDeclaration(statement: VariableDeclarationNode) {
    const variableName = statement.variableName.value;
    const variableType = statement.variableType.type;

    const variableValue = await this.evaluateExpression(
      statement.variableValue
    );

    if (variableValue.type !== variableType) {
      throw new TypeError(
        `TypeError: Type '${variableValue.type}' is not assignable to variable type '${variableType}' at line ${statement.line}.`
      );
    }

    this.variableTable.addVariable(variableName, variableValue);
  }

  private async executeAssigmentVariable(statement: AssignmentVariableNode) {
    const variableName = statement.variableName.value;

    const variableValue = await this.evaluateExpression(
      statement.variableValue
    );

    this.variableTable.updateVariableValue(
      variableName,
      variableValue,
      statement.line
    );
  }

  private async executePrint(statement: PrintNode) {
    const currentArgs = statement.args;
    const args: ExpressionNode[] = [];

    for await (const arg of currentArgs) {
      const value = (await this.evaluateExpression(arg)).value;
      args.push(value);
    }

    console.log(...args);
  }

  private executeFunctionDefinition(statement: FunctionDefinitionNode) {
    this.functionTable.addFunction(statement);
  }

  private async executeReturn(
    statement: ReturnStatmentNode
  ): Promise<LiteralNode> {
    return await this.evaluateExpression(statement.returnValue);
  }

  private async executeFunctionCall(
    statement: FunctionCallNode
  ): Promise<LiteralNode> {
    const name = statement.functionName.value;

    const args: LiteralNode[] = [];

    for await (const arg of statement.args) {
      const value = await this.evaluateExpression(arg);
      args.push(value);
    }

    const builtin = builtins[name];
    if (builtin) {
      if (
        args.length < builtin.requiredArgs ||
        args.length > builtin.paramsType.length
      ) {
        throw new Error(
          `Error: required ${
            builtin.requiredArgs
          } argument type '${builtin.paramsType.join(',')}' but found ${
            args.length
          } argument at line ${statement.line}`
        );
      }
      for (let i = 0; i < args.length; i++) {
        if (args[i].type !== builtin.paramsType[i]) {
          throw new Error(
            `TypeError: Argument type '${args[i].type}' is not assignable to parameter type '${builtin.paramsType[i]}' at line ${statement.line}.`
          );
        }
      }
      const value = await builtin.fn(...args.map((arg) => arg.value));
      if (builtin.returnType === 'str') return new StringNode(value as string);
      if (builtin.returnType === 'num') return new NumberNode(value as number);
    }

    const {params, body, returnType, line} = this.functionTable.getFunction(
      name,
      args
    );

    this.variableTable.enterScope(name);
    this.functionTable.enterScope(name);
    // Assign param with argument
    for (let i = 0; i < params.length; i++) {
      const paramName = params[i].paramName.value;
      const arg = args[i];
      this.variableTable.addVariable(paramName, arg);
    }

    const value = (await this.interpret(body)) || new NoneNode();

    this.functionTable.exitScope();
    this.variableTable.exitScope();

    if (value.type !== returnType.type) {
      throw new TypeError(
        `TypeError: Type '${value.type}' is not assignable to 'return' type '${returnType.type}' at line ${line}.`
      );
    }

    return value;
  }

  private async evaluateArithmeticExpression(
    expression: ArithmeticExpressionNode
  ): Promise<LiteralNode> {
    const leftOperand = await this.evaluateExpression(
      expression.leftOperand as LiteralNode
    );
    const rightOperand = await this.evaluateExpression(
      expression.rightOperand as LiteralNode
    );
    if (leftOperand.type === 'str' && rightOperand.type === 'str') {
      if (expression instanceof AdditionNode) {
        return new StringNode(
          (leftOperand.value as string) + (rightOperand.value as string)
        );
      }
    }
    if (leftOperand.type !== 'num' || rightOperand.type !== 'num') {
      throw new TypeError(
        `TypeError: unsupported operand type(s) for: '${leftOperand.type}' and '${rightOperand.type}'`
      );
    }

    switch (expression.constructor) {
      case AdditionNode:
        return new NumberNode(
          (leftOperand.value as number) + (rightOperand.value as number)
        );
      case SubtractionNode:
        return new NumberNode(
          (leftOperand.value as number) - (rightOperand.value as number)
        );
      case MultiplicationNode:
        return new NumberNode(
          (leftOperand.value as number) * (rightOperand.value as number)
        );
      case DivisionNode:
        return new NumberNode(
          (leftOperand.value as number) / (rightOperand.value as number)
        );
      default:
        throw new SyntaxError('SyntaxError: Invalid arithmetic expression.');
    }
  }

  private evaluateString(value: string): LiteralNode {
    const regex = /{[a-zA-Z_]+}|{[a-zA-Z_][a-zA-Z0-9_]+}/g;
    const identifiers = value.match(regex);

    if (identifiers) {
      const values = identifiers.map((identifire) => {
        return this.variableTable.getVariableValue(identifire.slice(1, -1));
      });

      values.forEach((variableValue, i) => {
        value = value.replace(`${identifiers[i]}`, `${variableValue?.value}`);
      });
    }

    return new StringNode(value);
  }

  private async evaluateLogicalExpression(
    expression: LogicalExpressionNode
  ): Promise<boolean> {
    const leftOperand = await this.evaluateExpression(
      expression.leftOperand as LiteralNode
    );
    const rightOperand = await this.evaluateExpression(
      expression.rightOperand as LiteralNode
    );

    switch (expression.constructor) {
      case ANDLogicalNode:
        return leftOperand.value && rightOperand.value ? true : false;
      case ORLogicalNode:
        return leftOperand.value || rightOperand.value ? true : false;
      default:
        throw new SyntaxError('SyntaxError: Invalid logical expression.');
    }
  }

  private async evaluateConditionalExpression(
    expression: ConditionalExpressionNode
  ) {
    const leftOperand = await this.evaluateExpression(
      expression.leftOperand as LiteralNode
    );
    const rightOperand = await this.evaluateExpression(
      expression.rightOperand as LiteralNode
    );
    switch (expression.constructor) {
      case EqualNode:
        return leftOperand.value == rightOperand.value ? true : false;
      case NotEqualNode:
        return leftOperand.value != rightOperand.value ? true : false;
      case GreaterThanNode:
        return leftOperand.value > rightOperand.value ? true : false;
      case LessThanNode:
        return leftOperand.value < rightOperand.value ? true : false;
      case GreaterThanOrEqualNode:
        return leftOperand.value >= rightOperand.value ? true : false;
      case LessThanOrEqualNode:
        return leftOperand.value <= rightOperand.value ? true : false;
      default:
        throw new SyntaxError('SyntaxError: Invalid conditional expression.');
    }
  }

  private async evaluateExpression(
    expression: ExpressionNode
  ): Promise<LiteralNode> {
    if (expression instanceof LiteralNode) {
      if (expression instanceof StringNode) {
        return this.evaluateString(expression.value);
      }
      return expression;
    } else if (expression instanceof FunctionCallNode) {
      return await this.executeFunctionCall(expression);
    } else if (expression instanceof IdentifierNode) {
      const variableName = expression.value;
      const variableValue = this.variableTable.getVariableValue(variableName)!;
      if (variableValue instanceof ExpressionNode) {
        return await this.evaluateExpression(variableValue);
      }
      return variableValue;
    } else if (expression instanceof ArithmeticExpressionNode) {
      return await this.evaluateArithmeticExpression(expression);
    } else if (expression instanceof NegationNode) {
      const operand = expression.operand as LiteralNode;
      return new NumberNode(-operand.value);
    } else if (expression instanceof ConditionalExpressionNode) {
      const value = await this.evaluateConditionalExpression(expression);
      return new BooleanNode(value);
    } else if (expression instanceof LogicalExpressionNode) {
      const value = await this.evaluateLogicalExpression(expression);
      return new BooleanNode(value);
    } else {
      throw new SyntaxError('SyntaxError: Invalid expression.');
    }
  }
}
