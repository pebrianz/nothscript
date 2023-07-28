import Token, {TokenType} from '../lexer/Token.js';
import {
  ANDLogicalNode,
  AdditionNode,
  AssignmentVariableNode,
  BooleanNode,
  DivisionNode,
  ElseStatementNode,
  EqualNode,
  ExpressionNode,
  FunctionCallNode,
  FunctionDefinitionNode,
  FunctionParamterNode,
  GreaterThanNode,
  GreaterThanOrEqualNode,
  IdentifierNode,
  IfElseStatementNode,
  IfStatementNode,
  LessThanNode,
  LessThanOrEqualNode,
  MultiplicationNode,
  NegationNode,
  NotEqualNode,
  NumberNode,
  ORLogicalNode,
  PrintNode,
  ProgramNode,
  ReturnStatmentNode,
  StatementNode,
  StringNode,
  SubtractionNode,
  Type,
  TypeAnnotation,
  VariableDeclarationNode,
  WhileStatementNode,
} from './AST.js';

export default class Parser {
  private tokens: Token[];
  private currentToken: Token | null;
  private currentLine: number;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
    this.currentToken = null;
    this.currentLine = 0;
    this.advance();
  }

  private advance() {
    this.currentToken = this.tokens.shift() || null;
    this.currentLine = this.currentToken?.line || this.currentLine;
  }

  private expect(tokenType: TokenType) {
    if (this.currentToken?.type !== tokenType) {
      const line = this.currentLine;

      if (!this.currentToken?.value) {
        throw new SyntaxError(
          `SyntaxError: Expected '${tokenType}' at line ${line}.`
        );
      }

      if (this.currentToken.type === TokenType.IDENTIFIER) {
        throw new SyntaxError(
          `SyntaxError: Expected '${tokenType}' but found ${this.currentToken.type} '${this.currentToken?.value}' at line ${line}.`
        );
      }

      throw new SyntaxError(
        `SyntaxError: Expected '${tokenType}' but found '${this.currentToken.value}' at line ${line}.`
      );
    }

    this.advance();
  }

  private parseExpression(): ExpressionNode {
    let leftOperand = this.parseConditionalExpression();

    while (
      this.currentToken?.type === TokenType.AND ||
      this.currentToken?.type === TokenType.OR
    ) {
      const operator = this.currentToken.type;
      this.advance();

      const rightOperand = this.parseConditionalExpression();

      if (operator === TokenType.AND) {
        leftOperand = new ANDLogicalNode(leftOperand, rightOperand);
      } else if (operator === TokenType.OR) {
        leftOperand = new ORLogicalNode(leftOperand, rightOperand);
      }
    }

    return leftOperand;
  }

  private parseConditionalExpression(): ExpressionNode {
    let leftOperand = this.parseArithmeticExpression();

    while (
      this.currentToken?.type === TokenType.EQUAL ||
      this.currentToken?.type === TokenType.NOT_EQUAL ||
      this.currentToken?.type === TokenType.GREATER_THAN ||
      this.currentToken?.type === TokenType.LESS_THAN ||
      this.currentToken?.type === TokenType.GREATER_THAN_OR_EQUAL ||
      this.currentToken?.type === TokenType.LESS_THAN_OR_EQUAL
    ) {
      const operator = this.currentToken.type;
      this.advance();

      const rightOperand = this.parseArithmeticExpression();
      if (operator === TokenType.EQUAL) {
        leftOperand = new EqualNode(leftOperand, rightOperand);
      } else if (operator === TokenType.NOT_EQUAL) {
        leftOperand = new NotEqualNode(leftOperand, rightOperand);
      } else if (operator === TokenType.GREATER_THAN) {
        leftOperand = new GreaterThanNode(leftOperand, rightOperand);
      } else if (operator === TokenType.LESS_THAN) {
        leftOperand = new LessThanNode(leftOperand, rightOperand);
      } else if (operator === TokenType.GREATER_THAN_OR_EQUAL) {
        leftOperand = new GreaterThanOrEqualNode(leftOperand, rightOperand);
      } else if (operator === TokenType.LESS_THAN_OR_EQUAL) {
        leftOperand = new LessThanOrEqualNode(leftOperand, rightOperand);
      }
    }
    return leftOperand;
  }

  private parseArithmeticExpression(): ExpressionNode {
    let leftOperand = this.parseTerm();

    while (
      this.currentToken?.type === TokenType.PLUS ||
      this.currentToken?.type === TokenType.MINUS
    ) {
      const operator = this.currentToken.type;
      this.advance();

      const rightOperand = this.parseTerm();

      if (operator === TokenType.MINUS) {
        leftOperand = new SubtractionNode(leftOperand, rightOperand);
      } else if (operator === TokenType.PLUS) {
        leftOperand = new AdditionNode(leftOperand, rightOperand);
      }
    }

    return leftOperand;
  }

  private parseTerm(): ExpressionNode {
    let leftOperand = this.parseFactor();

    while (
      this.currentToken?.type === TokenType.MULTIPLY ||
      this.currentToken?.type === TokenType.DIVIDE
    ) {
      const operator = this.currentToken.type;
      this.advance();

      const rightOperand = this.parseFactor();

      if (operator === TokenType.MULTIPLY) {
        leftOperand = new MultiplicationNode(leftOperand, rightOperand);
      } else if (operator === TokenType.DIVIDE) {
        leftOperand = new DivisionNode(leftOperand, rightOperand);
      }
    }

    return leftOperand;
  }

  private parseFactor(): ExpressionNode {
    if (this.currentToken?.type === TokenType.IDENTIFIER) {
      const value = this.currentToken.value;
      this.advance();

      if ((this.currentToken.type as TokenType) === TokenType.OPEN_PAREN) {
        return this.parseFunctionCall(value);
      }

      return new IdentifierNode(value);
    } else if (this.currentToken?.type === TokenType.STRING) {
      const value = this.currentToken.value;
      this.advance();

      return new StringNode(value.slice(1, -1));
    } else if (this.currentToken?.type === TokenType.NUMBER) {
      const value = this.currentToken.value;
      this.advance();

      return new NumberNode(Number(value));
    } else if (this.currentToken?.type === TokenType.BOOLEAN) {
      const value = this.currentToken.value;
      this.advance();

      return new BooleanNode(value === 'true' ? true : false);
    } else if (this.currentToken?.type === TokenType.MINUS) {
      this.advance();

      const operand = this.parseFactor();

      return new NegationNode(operand);
    } else if (this.currentToken?.type === TokenType.OPEN_PAREN) {
      this.advance();

      const expression = this.parseExpression();
      this.expect(TokenType.CLOSE_PAREN);

      return expression;
    } else {
      const line = this.currentToken?.line || 0;

      throw new SyntaxError(
        `SyntaxError: Unexpected token '${this.currentToken?.value}' at line ${line}.`
      );
    }
  }

  private parseVariableDeclaration(
    variableName: string
  ): VariableDeclarationNode {
    const line = this.currentLine;
    this.advance();

    const variableType = this.currentToken?.value as Type;
    this.expect(TokenType.TYPE_ANNOTATION);

    this.expect(TokenType.ASSIGNMENT);

    const variableValue = this.parseExpression();
    this.expect(TokenType.SEMICOLON);

    return new VariableDeclarationNode(
      new IdentifierNode(variableName),
      new TypeAnnotation(variableType),
      variableValue,
      line
    );
  }

  private parseAssignmentVariable(
    variableName: string
  ): AssignmentVariableNode {
    const line = this.currentLine;
    this.advance();

    const variableValue = this.parseExpression();
    this.expect(TokenType.SEMICOLON);

    return new AssignmentVariableNode(
      new IdentifierNode(variableName),
      variableValue,
      line
    );
  }

  private parsePrint(): PrintNode {
    const line = this.currentLine;
    this.advance();

    const args: ExpressionNode[] = [];
    args.push(this.parseExpression());

    while (this.currentToken?.type === TokenType.COMMA) {
      this.advance();
      args.push(this.parseExpression());
    }

    this.expect(TokenType.SEMICOLON);

    return new PrintNode(args, line);
  }

  private parseFunctionParameter(): FunctionParamterNode {
    const paramName = this.currentToken?.value as string;
    this.expect(TokenType.IDENTIFIER);
    this.expect(TokenType.COLON);

    const paramType = this.currentToken?.value as Type;
    this.expect(TokenType.TYPE_ANNOTATION);

    return new FunctionParamterNode(
      new IdentifierNode(paramName),
      new TypeAnnotation(paramType)
    );
  }

  private parseReturn(): ReturnStatmentNode {
    const line = this.currentLine;
    const value = this.parseExpression();

    this.expect(TokenType.SEMICOLON);

    return new ReturnStatmentNode(value, line);
  }

  private parseFunctionDefinition(): FunctionDefinitionNode {
    const line = this.currentLine;
    this.advance();

    const functionName = this.currentToken?.value as string;
    this.expect(TokenType.IDENTIFIER);

    let returnType: Type = 'none';
    const params: FunctionParamterNode[] = [];

    while (
      this.currentToken?.type !== TokenType.OPEN_BRACE &&
      (this.currentToken?.type as TokenType) !== TokenType.DOUBLE_COLON &&
      (this.currentToken?.type as TokenType) !== TokenType.ARROW
    ) {
      const parameter = this.parseFunctionParameter();
      params.push(parameter);
    }

    if ((this.currentToken?.type as TokenType) === TokenType.DOUBLE_COLON) {
      this.advance();

      returnType = this.currentToken?.value as Type;
      this.expect(TokenType.TYPE_ANNOTATION);
    }

    if (this.currentToken?.type === TokenType.ARROW) {
      this.advance();

      const body: StatementNode[] = [];
      body.push(this.parseReturn());

      return new FunctionDefinitionNode(
        new IdentifierNode(functionName),
        params,
        new TypeAnnotation(returnType),
        new ProgramNode(body),
        line
      );
    }

    this.expect(TokenType.OPEN_BRACE);

    const body = this.parseProgram();

    this.expect(TokenType.CLOSE_BRACE);

    return new FunctionDefinitionNode(
      new IdentifierNode(functionName),
      params,
      new TypeAnnotation(returnType),
      body,
      line
    );
  }

  private parseFunctionCall(functionName: string): FunctionCallNode {
    const line = this.currentLine;
    this.advance();

    const args: ExpressionNode[] = [];
    if (this.currentToken?.type !== TokenType.CLOSE_PAREN) {
      args.push(this.parseExpression());
    }

    while (this.currentToken?.type === TokenType.COMMA) {
      this.advance();
      args.push(this.parseExpression());
    }

    this.expect(TokenType.CLOSE_PAREN);

    return new FunctionCallNode(new IdentifierNode(functionName), args, line);
  }

  private parseIfStatement(): IfElseStatementNode {
    const line = this.currentLine;
    this.advance();
    const conditional = this.parseExpression();
    this.expect(TokenType.OPEN_BRACE);
    const ifBlock = this.parseProgram();
    this.expect(TokenType.CLOSE_BRACE);
    const elseIfBlock: IfStatementNode[] = [];
    let elseBlock: ElseStatementNode | undefined = undefined;

    while (this.currentToken?.type === TokenType.ELSE) {
      const line = this.currentLine;
      this.advance();
      if ((this.currentToken?.type as TokenType) === TokenType.IF) {
        const line = this.currentLine;
        this.advance();
        const conditional = this.parseExpression();
        this.expect(TokenType.OPEN_BRACE);
        const body = this.parseProgram();
        this.expect(TokenType.CLOSE_BRACE);
        elseIfBlock.push(new IfStatementNode(conditional, body, line));
      } else {
        this.expect(TokenType.OPEN_BRACE);
        const body = this.parseProgram();
        this.expect(TokenType.CLOSE_BRACE);
        elseBlock = new ElseStatementNode(body, line);
      }
    }

    return new IfElseStatementNode(
      conditional,
      ifBlock,
      line,
      elseIfBlock,
      elseBlock
    );
  }

  private parseWhileStatement(): WhileStatementNode {
    const line = this.currentLine;
    this.advance();
    const conditional = this.parseConditionalExpression();
    this.expect(TokenType.OPEN_BRACE);
    const body = this.parseProgram();
    this.expect(TokenType.CLOSE_BRACE);

    return new WhileStatementNode(conditional, body, line);
  }

  private parseStatement(): StatementNode {
    switch (this.currentToken?.type) {
      case TokenType.WHILE:
        return this.parseWhileStatement();
      case TokenType.IF:
        return this.parseIfStatement();
      case TokenType.FUNCTION:
        return this.parseFunctionDefinition();
      case TokenType.RETURN:
        this.advance();
        return this.parseReturn();
      case TokenType.PRINT:
        return this.parsePrint();
      case TokenType.IDENTIFIER: {
        const identifier = this.currentToken.value;
        this.advance();
        switch (this.currentToken?.type as TokenType) {
          case TokenType.COLON:
            return this.parseVariableDeclaration(identifier);
          case TokenType.ASSIGNMENT:
            return this.parseAssignmentVariable(identifier);
          case TokenType.OPEN_PAREN:
            return this.parseFunctionCall(identifier);
        }
      }
    }
    const line = this.currentToken?.line || 0;
    throw new SyntaxError(
      `SyntaxError: Unexpected token '${this.currentToken?.value}' at line ${line}.`
    );
  }

  private parseProgram(): ProgramNode {
    const statements: StatementNode[] = [];

    while (
      this.currentToken &&
      this.currentToken.type !== TokenType.CLOSE_BRACE
    ) {
      const statement = this.parseStatement();
      statements.push(statement);
    }

    return new ProgramNode(statements);
  }

  public parse(): ProgramNode {
    return this.parseProgram();
  }
}
