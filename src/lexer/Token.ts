export enum TokenType {
  // Literal types
  STRING = 'str',
  NUMBER = 'num',
  BOOLEAN = 'bool',

  // Identifier and assignment
  IDENTIFIER = 'identifier',
  ASSIGNMENT = '=',

  // Parentheses and braces
  OPEN_PAREN = '(',
  CLOSE_PAREN = ')',
  OPEN_BRACE = '{',
  CLOSE_BRACE = '}',

  // Control flow and keywords
  IF = 'if',
  ELSE = 'else',
  RETURN = 'return',
  WHILE = 'while',

  // Miscellaneous
  COMMA = ',',
  SEMICOLON = ';',
  COLON = ':',
  TYPE_ANNOTATION = 'type_annotation',
  DOUBLE_COLON = '::',
  ARROW = '=>',
  NEW_LINE = 'new_line',

  // Keywords
  FUNCTION = 'function',
  PRINT = 'print',

  // Arithmetic operators
  PLUS = '+',
  MINUS = '-',
  DIVIDE = '/',
  MULTIPLY = '*',

  // Comparison operators
  EQUAL = '==',
  NOT_EQUAL = '!=',
  GREATER_THAN = '>',
  LESS_THAN = '<',
  GREATER_THAN_OR_EQUAL = '>=',
  LESS_THAN_OR_EQUAL = '<=',

  // Logical operators
  AND = '&&',
  OR = '||',
}

export default class Token {
  constructor(
    public type: TokenType,
    public value: string,
    public line: number
  ) {}
}

export const token = new Map<string, TokenType>([
  ['if', TokenType.IF],
  ['else', TokenType.ELSE],
  ['fn', TokenType.FUNCTION],
  ['rn', TokenType.RETURN],
  ['=', TokenType.ASSIGNMENT],
  [';', TokenType.SEMICOLON],
  [':', TokenType.COLON],
  ['{', TokenType.OPEN_BRACE],
  ['}', TokenType.CLOSE_BRACE],
  ['(', TokenType.OPEN_PAREN],
  [')', TokenType.CLOSE_PAREN],
  [',', TokenType.COMMA],
  ['+', TokenType.PLUS],
  ['-', TokenType.MINUS],
  ['*', TokenType.MULTIPLY],
  ['/', TokenType.DIVIDE],
  ['print', TokenType.PRINT],
  ['=>', TokenType.ARROW],
  ['&&', TokenType.AND],
  ['||', TokenType.OR],
  ['==', TokenType.EQUAL],
  ['!=', TokenType.NOT_EQUAL],
  ['>=', TokenType.GREATER_THAN_OR_EQUAL],
  ['<=', TokenType.LESS_THAN_OR_EQUAL],
  ['>', TokenType.GREATER_THAN],
  ['<', TokenType.LESS_THAN],
  ['::', TokenType.DOUBLE_COLON],
  ['str', TokenType.TYPE_ANNOTATION],
  ['num', TokenType.TYPE_ANNOTATION],
  ['none', TokenType.TYPE_ANNOTATION],
  ['bool', TokenType.TYPE_ANNOTATION],
  ['true', TokenType.BOOLEAN],
  ['false', TokenType.BOOLEAN],
  ['while', TokenType.WHILE],
]);
