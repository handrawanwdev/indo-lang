class Generator {
  generate(node) {
    switch (node.type) {
      case "Program":
        return node.body.map(n => this.generate(n)).join("\n");

      case "Var":
        return `let ${node.name} = ${this.generate(node.value)};`;

      case "Print":
        return `console.log(${this.generate(node.value)});`;

      case "NUMBER":
        return node.value;

      case "STRING":
        return `"${node.value}"`;

      case "IDENTIFIER":
        return node.value;

      case "Binary":
        return `${this.generate(node.left)} ${node.operator} ${this.generate(node.right)}`;

      case "If":
        return `if (${this.generate(node.test)}) {
${node.consequent.map(n => this.generate(n)).join("\n")}
}
${node.alternate ? `else {
${node.alternate.map(n => this.generate(n)).join("\n")}
}` : ""}`;

      case "Function":
        return `function ${node.name}(${node.params.join(",")}) {
${node.body.map(n => this.generate(n)).join("\n")}
}`;

      case "Call":
        return `${node.name}(${node.args.map(a => this.generate(a)).join(",")})`;

      case "Return":
        return `return ${this.generate(node.value)};`;
    }
  }
}

module.exports = Generator;