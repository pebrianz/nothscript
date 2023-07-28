import {readFileSync} from 'fs';
import Interpreter from './interpreter/Interpreter.js';
import Lexer from './lexer/Lexer.js';
import Parser from './parser/Parser.js';

try {
  const args = process.argv.slice(2);
  const sourceCode = readFileSync(args[0]).toString();
  const lexer = new Lexer(sourceCode);
  const tokens = lexer.lex();
  //  console.log(tokens);
  const parser = new Parser(tokens);
  const ast = parser.parse();
  //  console.log(ast);
  const interpreter = new Interpreter();
  await interpreter.interpret(ast);
} catch (error: unknown) {
  if (error instanceof Error) {
    console.error(error.message);
  }
}
