import readline from 'node:readline/promises';
import {Builtin, ParamsType, Type} from '../index.js';

async function fn(value: string | number | boolean) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const answer = await rl.question(value as string);

  rl.close();

  return answer;
}

const paramsType: ParamsType = ['str'];
const returnType: Type = 'str';

const input: Builtin<Array<number | string | boolean>, Promise<string>> = {
  fn,
  paramsType,
  requiredArgs: 1,
  returnType,
};

export {input};
