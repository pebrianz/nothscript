export type Type = 'str' | 'num';
export type ParamsType = Array<Type>;

// Define the function type concisely.
export type BuiltinFunction<T extends Array<string | number | boolean>, R> = (
  ...args: T
) => R;

// Use a generic Builtin type that takes the parameter types and return type.
export type Builtin<
  T extends Array<string | number | boolean>,
  R extends Promise<string | number | boolean>
> = {
  fn: BuiltinFunction<T, R>;
  paramsType: ParamsType;
  requiredArgs: number;
  returnType: Type;
};

// Use Record type for Builtins.
export type Builtins = Record<
  string,
  Builtin<Array<string | number | boolean>, Promise<string | number | boolean>>
>;

import {string, number, input} from './utils/index.js';

const builtins: Builtins = {input, string, number};

export default builtins;
