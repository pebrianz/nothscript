import {Builtin, ParamsType, Type} from '../index.js';

async function fn(value: number | string | boolean): Promise<string> {
  return Promise.resolve(String(value));
}

const paramsType: ParamsType = ['num'];
const returnType: Type = 'str';

const string: Builtin<Array<number | string | boolean>, Promise<string>> = {
  fn,
  paramsType,
  requiredArgs: 1,
  returnType,
};

export {string};
