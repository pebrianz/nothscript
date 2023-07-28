import Lexer from '../src/lexer/Lexer';
import {
  AdditionNode,
  AssignmentVariableNode,
  BooleanNode,
  FunctionCallNode,
  FunctionDefinitionNode,
  FunctionParamterNode,
  IdentifierNode,
  NumberNode,
  ProgramNode,
  ReturnStatmentNode,
  StringNode,
  TypeAnnotation,
  VariableDeclarationNode,
} from '../src/parser/AST';
import Parser from '../src/parser/Parser';

describe('Parser', () => {
  test('Should parse variable declaration and assignment', () => {
    const sourceCode = `
    x:str = "hello world";
    y:bool = false;
    y = true;
    `;
    const lexer = new Lexer(sourceCode);
    const tokens = lexer.lex();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(ast).toEqual(
      new ProgramNode([
        new VariableDeclarationNode(
          new IdentifierNode('x'),
          new TypeAnnotation('str'),
          new StringNode('hello world'),
          1
        ),
        new VariableDeclarationNode(
          new IdentifierNode('y'),
          new TypeAnnotation('bool'),
          new BooleanNode(false),
          2
        ),
        new AssignmentVariableNode(
          new IdentifierNode('y'),
          new BooleanNode(true),
          3
        ),
      ])
    );
  });

  test('Should parse function defininition and function call', () => {
    const sourceCode = `
    fn add a:num b:num ::num {
      rn a + b;
    }
    add(10,5)
    `;
    const lexer = new Lexer(sourceCode);
    const tokens = lexer.lex();
    const parser = new Parser(tokens);
    const ast = parser.parse();

    expect(ast).toEqual(
      new ProgramNode([
        new FunctionDefinitionNode(
          new IdentifierNode('add'),
          [
            new FunctionParamterNode(
              new IdentifierNode('a'),
              new TypeAnnotation('num')
            ),
            new FunctionParamterNode(
              new IdentifierNode('b'),
              new TypeAnnotation('num')
            ),
          ],
          new TypeAnnotation('num'),
          new ProgramNode([
            new ReturnStatmentNode(
              new AdditionNode(
                new IdentifierNode('a'),
                new IdentifierNode('b')
              ),
              2
            ),
          ]),
          1
        ),
        new FunctionCallNode(
          new IdentifierNode('add'),
          [new NumberNode(10), new NumberNode(5)],
          4
        ),
      ])
    );
  });
  // Add more test cases to cover other tokenization rules and scenarios.
});
