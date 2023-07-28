import Lexer from '../src/lexer/Lexer';
import Token, {TokenType} from '../src/lexer/Token';

describe('Parser', () => {
  test('Should ', () => {
    const sourceCode = `
    y:bool = false;
    y = true;
    `;
    const lexer = new Lexer(sourceCode);
    const tokens = lexer.lex();

    expect(tokens).toEqual([
      new Token(TokenType.IDENTIFIER, 'y', 1),
      new Token(TokenType.COLON, ':', 1),
      new Token(TokenType.TYPE_ANNOTATION, 'bool', 1),
      new Token(TokenType.ASSIGNMENT, '=', 1),
      new Token(TokenType.BOOLEAN, 'false', 1),
      new Token(TokenType.SEMICOLON, ';', 1),
      new Token(TokenType.IDENTIFIER, 'y', 2),
      new Token(TokenType.ASSIGNMENT, '=', 2),
      new Token(TokenType.BOOLEAN, 'true', 2),
      new Token(TokenType.SEMICOLON, ';', 2),
    ]);
  });
});
