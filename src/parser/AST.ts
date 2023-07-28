export abstract class ExpressionNode {}

export abstract class StatementNode {
  abstract line: number;
}

export class ProgramNode {
  constructor(public readonly statements: StatementNode[]) {}
}

export type Type = 'str' | 'num' | 'none' | 'bool';

export class TypeAnnotation {
  constructor(public readonly type: Type) {}
}

export abstract class LiteralNode extends ExpressionNode {
  abstract type: Type;
  abstract value: string | number | boolean;
}

export class StringNode extends LiteralNode {
  public readonly type: Type = 'str';
  constructor(public readonly value: string) {
    super();
  }
}

export class NumberNode extends LiteralNode {
  public readonly type: Type = 'num';
  constructor(public readonly value: number) {
    super();
  }
}

export class NoneNode extends LiteralNode {
  public readonly type: Type = 'none';
  public readonly value: 'None' = 'None' as const;
  constructor() {
    super();
  }
}

export class BooleanNode extends LiteralNode {
  public readonly type: Type = 'bool';
  constructor(public readonly value: boolean) {
    super();
  }
}

export class IdentifierNode extends ExpressionNode {
  constructor(public readonly value: string) {
    super();
  }
}

export class VariableDeclarationNode extends StatementNode {
  constructor(
    public readonly variableName: IdentifierNode,
    public readonly variableType: TypeAnnotation,
    public readonly variableValue: ExpressionNode,
    public readonly line: number
  ) {
    super();
  }
}

export class AssignmentVariableNode extends StatementNode {
  constructor(
    public readonly variableName: IdentifierNode,
    public readonly variableValue: ExpressionNode,
    public readonly line: number
  ) {
    super();
  }
}

export abstract class ArithmeticExpressionNode extends ExpressionNode {
  abstract leftOperand: ExpressionNode;
  abstract rightOperand: ExpressionNode;
}

export class AdditionNode extends ArithmeticExpressionNode {
  constructor(
    public readonly leftOperand: ExpressionNode,
    public readonly rightOperand: ExpressionNode
  ) {
    super();
  }
}

export class SubtractionNode extends ArithmeticExpressionNode {
  constructor(
    public readonly leftOperand: ExpressionNode,
    public readonly rightOperand: ExpressionNode
  ) {
    super();
  }
}

export class DivisionNode extends ArithmeticExpressionNode {
  constructor(
    public readonly leftOperand: ExpressionNode,
    public readonly rightOperand: ExpressionNode
  ) {
    super();
  }
}

export class MultiplicationNode extends ArithmeticExpressionNode {
  constructor(
    public readonly leftOperand: ExpressionNode,
    public readonly rightOperand: ExpressionNode
  ) {
    super();
  }
}

export class NegationNode extends ExpressionNode {
  constructor(public readonly operand: ExpressionNode) {
    super();
  }
}

export abstract class ConditionalExpressionNode extends ExpressionNode {
  abstract leftOperand: ExpressionNode;
  abstract rightOperand: ExpressionNode;
}

export class EqualNode extends ConditionalExpressionNode {
  constructor(
    public readonly leftOperand: ExpressionNode,
    public readonly rightOperand: ExpressionNode
  ) {
    super();
  }
}

export class NotEqualNode extends ConditionalExpressionNode {
  constructor(
    public readonly leftOperand: ExpressionNode,
    public readonly rightOperand: ExpressionNode
  ) {
    super();
  }
}

export class GreaterThanNode extends ConditionalExpressionNode {
  constructor(
    public readonly leftOperand: ExpressionNode,
    public readonly rightOperand: ExpressionNode
  ) {
    super();
  }
}

export class LessThanNode extends ConditionalExpressionNode {
  constructor(
    public readonly leftOperand: ExpressionNode,
    public readonly rightOperand: ExpressionNode
  ) {
    super();
  }
}

export class GreaterThanOrEqualNode extends ConditionalExpressionNode {
  constructor(
    public readonly leftOperand: ExpressionNode,
    public readonly rightOperand: ExpressionNode
  ) {
    super();
  }
}

export class LessThanOrEqualNode extends ConditionalExpressionNode {
  constructor(
    public readonly leftOperand: ExpressionNode,
    public readonly rightOperand: ExpressionNode
  ) {
    super();
  }
}

export abstract class LogicalExpressionNode extends ExpressionNode {
  abstract leftOperand: ExpressionNode;
  abstract rightOperand: ExpressionNode;
}

export class ANDLogicalNode extends LogicalExpressionNode {
  constructor(
    public readonly leftOperand: ExpressionNode,
    public readonly rightOperand: ExpressionNode
  ) {
    super();
  }
}

export class ORLogicalNode extends LogicalExpressionNode {
  constructor(
    public readonly leftOperand: ExpressionNode,
    public readonly rightOperand: ExpressionNode
  ) {
    super();
  }
}

export class IfStatementNode extends StatementNode {
  constructor(
    public readonly conditional: ExpressionNode,
    public readonly ifBlock: ProgramNode,
    public readonly line: number
  ) {
    super();
  }
}

export class ElseStatementNode extends StatementNode {
  constructor(
    public readonly elseBlock: ProgramNode,
    public readonly line: number
  ) {
    super();
  }
}

export class IfElseStatementNode extends StatementNode {
  constructor(
    public readonly conditional: ExpressionNode,
    public readonly ifBlock: ProgramNode,
    public readonly line: number,
    public readonly elseIfBlock: IfStatementNode[],
    public readonly elseBlock?: ElseStatementNode
  ) {
    super();
  }
}

export class WhileStatementNode extends StatementNode {
  constructor(
    public readonly conditional: ExpressionNode,
    public readonly block: ProgramNode,
    public readonly line: number
  ) {
    super();
  }
}

export class PrintNode extends StatementNode {
  constructor(
    public readonly args: ExpressionNode[],
    public readonly line: number
  ) {
    super();
  }
}

export class ReturnStatmentNode extends StatementNode {
  constructor(
    public readonly returnValue: ExpressionNode,
    public readonly line: number
  ) {
    super();
  }
}

export class FunctionParamterNode extends ExpressionNode {
  constructor(
    public readonly paramName: IdentifierNode,
    public readonly paramType: TypeAnnotation
  ) {
    super();
  }
}

export class FunctionDefinitionNode extends StatementNode {
  constructor(
    public readonly functionName: IdentifierNode,
    public readonly params: FunctionParamterNode[],
    public readonly returnType: TypeAnnotation,
    public readonly body: ProgramNode,
    public readonly line: number
  ) {
    super();
  }
}

export class FunctionCallNode extends ExpressionNode {
  constructor(
    public readonly functionName: IdentifierNode,
    public readonly args: ExpressionNode[],
    public readonly line: number
  ) {
    super();
  }
}
