import {Builtin, ParamsType, Type} from '../index.js';

async function fn(value: number | string | boolean): Promise<number> {
  return await Promise.resolve(Number(value));
}

const paramsType: ParamsType = ['str'];
const returnType: Type = 'num';

const number: Builtin<Array<number | string | boolean>, Promise<number>> = {
  fn,
  paramsType,
  requiredArgs: 1,
  returnType,
};

export {number};
