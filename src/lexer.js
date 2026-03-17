class Lexer {
  constructor(input) {
    this.input = input;
  }

  tokenize() {
    const tokens = [];
    const lines = this.input.split("\n");

    lines.forEach((line, lineIndex) => {
      const regex =
        /\s*(=>|==|!=|<=|>=|[(){}=,+\-*/<>]|"[^"]*"|\d+|[a-zA-Z_][a-zA-Z0-9_]*)\s*/g;

      let match;

      while ((match = regex.exec(line))) {
        const raw = match[1];

        let token = {
          line: lineIndex + 1,
          column: match.index + 1,
        };

        if (!isNaN(raw)) {
          token.type = "NUMBER";
          token.value = Number(raw);
        } else if (raw.startsWith('"')) {
          token.type = "STRING";
          token.value = raw.slice(1, -1);
        } else {
          token.type = "IDENTIFIER";
          token.value = raw;
        }

        tokens.push(token);
      }
    });

    return tokens;
  }
}

module.exports = Lexer;