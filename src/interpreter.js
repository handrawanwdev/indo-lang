// src/interpreter.js
class Interpreter {
  constructor(global) {
    this.env = global;
  }

  run(node) {
    if (node.type === "Program") {
      for (const stmt of node.body) this.run(stmt);
    }

    if (node.type === "Var") {
      this.env.set(node.name, this.eval(node.value));
    }

    if (node.type === "Print") {
      console.log(this.eval(node.value));
    }

    if (node.type === "Binary") {
      const left = this.eval(node.left);
      const right = this.eval(node.right);

      switch (node.operator) {
        case "+": return left + right;
        case "-": return left - right;
        case ">": return left > right;
        case "<": return left < right;
      }
    }

    if (node.type === "If") {
      if (this.eval(node.test)) {
        node.consequent.forEach(s => this.run(s));
      } else if (node.alternate) {
        node.alternate.forEach(s => this.run(s));
      }
    }

    if (node.type === "Function") {
      this.env.set(node.name, node);
    }

    if (node.type === "Call") {
      const fn = this.env.get(node.name);

      const newEnv = new (require("./environment"))(this.env);

      fn.params.forEach((p, i) => {
        newEnv.set(p, this.eval(node.args[i]));
      });

      const interpreter = new Interpreter(newEnv);

      for (const stmt of fn.body) {
        if (stmt.type === "Return") {
          return interpreter.eval(stmt.value);
        }
        interpreter.run(stmt);
      }
    }

    if (node.type === "NUMBER") return node.value;
    if (node.type === "STRING") return node.value;
    if (node.type === "IDENTIFIER") return this.env.get(node.value);
  }

  eval(node) {
    return this.run(node);
  }
}

module.exports = Interpreter;