import Token, {TokenType, token} from './Token.js';

const string = /(["'`])((?:\\.|\\\1|(?!\1)[\s\S])*?)\1/;
const number = /(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][-+]?\d+)?/;
const identifier = /[a-zA-Z_]\w*/;

const tokenPatterns: [RegExp][] = [
  [string],
  [number],
  [identifier],
  [/=|\(|\)|\{|\}|,|;|::|:|\+|\*|-|\/|\n/],
  [/&&|\|\||>=|<=|==|!=|>|<|=>/],
];

const regex = tokenPatterns.map(([pattern]) => pattern.source).join('|');

export default class Lexer {
  private readonly src: string[];
  private currentToken: string | null;
  private currentLine: number;

  constructor(private sourceCode: string) {
    this.src = this.sourceCode.trim().match(new RegExp(regex, 'g'))!;
    this.currentToken = this.src.shift() || null;
    this.currentLine = 1;
  }

  private getTokenTypeAndValue(tokenValue: string): [TokenType, string] {
    const tokenType = token.get(tokenValue);

    if (tokenType) {
      return [tokenType, tokenValue];
    } else {
      if (string.test(tokenValue)) return [TokenType.STRING, tokenValue];
      if (number.test(tokenValue)) return [TokenType.NUMBER, tokenValue];
      if (identifier.test(tokenValue)) {
        return [TokenType.IDENTIFIER, tokenValue];
      }
    }

    const line = this.currentLine;
    throw new SyntaxError(
      `SyntaxError: Unexpected token '${tokenValue}' at line ${line}.`
    );
  }

  private getTokens(): Token[] {
    const tokens: Token[] = [];

    while (this.currentToken) {
      const tokenValue = this.currentToken;

      if (tokenValue === '\n') {
        this.currentLine++;
        this.currentToken = this.src.shift() || null;
        continue;
      }

      const [tokenType, matchedValue] = this.getTokenTypeAndValue(tokenValue);
      this.currentToken = this.src.shift() || null;
      tokens.push(new Token(tokenType, matchedValue, this.currentLine));
    }

    return tokens;
  }

  public lex(): Token[] {
    return this.getTokens();
  }
}
