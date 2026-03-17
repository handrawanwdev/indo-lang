const IndoError = require("./error");

class Parser {
  constructor(tokens, source) {
    this.tokens = tokens;
    this.source = source;
    this.pos = 0;
  }

  current() {
    return this.tokens[this.pos];
  }

  isEnd() {
    return this.pos >= this.tokens.length;
  }

  getPrevToken() {
    return this.tokens[this.pos - 1] || { line: 1, column: 1 };
  }

  eat() {
    if (this.isEnd()) {
      this.error("unexpected end of input", this.getPrevToken());
    }
    return this.tokens[this.pos++];
  }

  expect(value, msg) {
    const token = this.current();
    if (!token || token.value !== value) {
      this.error(msg || `diharapkan '${value}'`, this.getPrevToken());
    }
    return this.eat();
  }

  error(msg, token) {
    throw new IndoError(msg, token?.line, token?.column, this.source);
  }

  parse() {
    const body = [];

    while (!this.isEnd()) {
      body.push(this.parseStatement());
    }

    return { type: "Program", body };
  }

  parseStatement() {
    const token = this.current();

    if (!token) this.error("token tidak valid", this.getPrevToken());

    if (token.value === "buat") return this.parseVariable();
    if (token.value === "tampilkan") return this.parsePrint();
    if (token.value === "fungsi") return this.parseFunction();
    if (token.value === "jika") return this.parseIf();
    if (token.value === "kembali") return this.parseReturn();

    return this.parseExpression();
  }

  parseVariable() {
    this.expect("buat");

    const name = this.eat();
    if (name.type !== "IDENTIFIER") {
      this.error("nama variabel tidak valid", name);
    }

    this.expect("=", "diharapkan '=' setelah variabel");

    const value = this.parseExpression();

    return {
      type: "Var",
      name: name.value,
      value,
    };
  }

  parsePrint() {
    this.expect("tampilkan");
    const value = this.parseExpression();

    return { type: "Print", value };
  }

  parseFunction() {
    this.expect("fungsi");

    const name = this.eat();
    if (name.type !== "IDENTIFIER") {
      this.error("nama fungsi tidak valid", name);
    }

    this.expect("(", "diharapkan '('");

    const params = [];

    while (this.current() && this.current().value !== ")") {
      const param = this.eat();

      if (param.type !== "IDENTIFIER") {
        this.error("parameter harus identifier", param);
      }

      params.push(param.value);

      if (this.current()?.value === ",") this.eat();
    }

    this.expect(")", "diharapkan ')'");
    this.expect("{", "diharapkan '{'");

    const body = [];

    while (this.current() && this.current().value !== "}") {
      body.push(this.parseStatement());
    }

    this.expect("}", "diharapkan '}'");

    return {
      type: "Function",
      name: name.value,
      params,
      body,
    };
  }

  parseIf() {
    this.expect("jika");

    this.expect("(", "diharapkan '('");

    const test = this.parseExpression();

    this.expect(")", "diharapkan ')'");
    this.expect("{", "diharapkan '{'");

    const consequent = [];

    while (this.current() && this.current().value !== "}") {
      consequent.push(this.parseStatement());
    }

    this.expect("}", "diharapkan '}'");

    let alternate = null;

    if (this.current()?.value === "lainnya") {
      this.eat();

      this.expect("{", "diharapkan '{'");

      alternate = [];

      while (this.current() && this.current().value !== "}") {
        alternate.push(this.parseStatement());
      }

      this.expect("}", "diharapkan '}'");
    }

    return { type: "If", test, consequent, alternate };
  }

  parseReturn() {
    this.expect("kembali");

    const value = this.parseExpression();

    return { type: "Return", value };
  }

  parseExpression() {
    const token = this.current();

    if (!token) {
      this.error(
        "ekspresi tidak valid\nHint: isi setelah '=' harus angka/string/variabel",
        this.getPrevToken()
      );
    }

    const forbidden = ["buat", "tampilkan", "jika", "fungsi", "kembali"];
    if (forbidden.includes(token.value)) {
      this.error(
        "ekspresi tidak valid\nHint: isi setelah '=' harus angka/string/variabel",
        this.getPrevToken()
      );
    }

    let left = this.parsePrimary();

    if (!left) {
      this.error("ekspresi tidak valid", this.getPrevToken());
    }

    while (
      this.current() &&
      ["+", "-", ">", "<"].includes(this.current().value)
    ) {
      const op = this.eat();

      const right = this.parsePrimary();

      if (!right) {
        this.error("ekspresi setelah operator tidak valid", op);
      }

      left = {
        type: "Binary",
        operator: op.value,
        left,
        right,
      };
    }

    return left;
  }

  parsePrimary() {
    const token = this.current();

    if (!token) return null;

    if (token.type === "NUMBER" || token.type === "STRING") {
      return this.eat();
    }

    if (token.type === "IDENTIFIER") {
      this.eat();

      if (this.current()?.value === "(") {
        this.eat();

        const args = [];

        while (this.current() && this.current().value !== ")") {
          args.push(this.parseExpression());

          if (this.current()?.value === ",") this.eat();
        }

        this.expect(")", "diharapkan ')'");

        return {
          type: "Call",
          name: token.value,
          args,
        };
      }

      return token;
    }

    this.error(`token tidak dikenal: ${token.value}`, token);
  }
}

module.exports = Parser;