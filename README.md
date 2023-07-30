# NothScript

NothScript is a programming language that provides a high-level and expressive syntax for various programming tasks. It is built using TypeScript and JavaScript and requires Node.js version 18 or higher.

## Installation

To use NothScript, make sure you have Node.js installed.

```bash
$ npm i -g pebrianz/nothscript#dist
```

Then, you can run your code using the provided interpreter.

```bash
$ ns index.ns
```

## Syntax Overview

### Variable Declaration

```nothscript
x:num = 10;
```

In NothScript, you can declare variables using the `:` symbol, followed by the type of the variable (`num`, `str`, `bool`, or `none`).).

### Variable Assignment

```nothscript
x = 30;
```

You can assign values to variables without specifying the type.

### Function Definition

```nothscript
fn add a:num b:num ::num {
   rn a + b;
}
```

Define functions using the `fn` keyword, followed by the function name, parameters with their types, and the return type specified after `::`.

### Function Call

```nothscript
add(10, 20);
```

Call functions by using their names and passing arguments inside parentheses.

### Arrow Function

```nothscript
fn add a:num b:num ::num => a + b;
```

Arrow functions provide a more concise way to define simple functions.

### Overload Function

```nothscript
fn add a:num b:num ::num => a + b;
fn add a:str b:str ::str {
   rn "{a} {b}";
}
```

### If-Else Statement

```nothscript
if 10 > 5 {
   print "hello";
} else {
   print "world";
}
```

Make decisions using `if` and `else` statements with conditions enclosed in curly braces.

### While Loop

```nothscript
while x < 100 {
   print "hello world";
   x = x + 1;
}
```

Execute a block of code repeatedly with a `while` loop.

### Input and Output

```nothscript
print "hello world";
x:num = number(input("your age: "));
print "your age is {x}";
```

Use `print` to display output and `input` to receive user input. Note that `number` is used to convert the input to a numeric value.

## Example

```nothscript
fn factorial n:num ::num {
   if n <= 1 {
      rn 1;
   } else {
      rn n * factorial(n - 1);
   }
}

x:num = 5;
result:num = factorial(x);
print "Factorial of {x} is {result}.";
```

This example demonstrates how to use recursion to calculate the factorial of a number in YourLanguageName.

## License

NothScript is released under the MIT License. See [LICENSE](LICENSE) for more information.
