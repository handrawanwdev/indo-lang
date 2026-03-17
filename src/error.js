class IndoError extends Error {
  constructor({
    code = "E001",
    message,
    line,
    column,
    source,
    token,
    hint
  }) {
    super(message);

    this.code = code;
    this.line = line || 1;
    this.column = column || 1;
    this.source = source || "";
    this.token = token || "";
    this.hint = hint || "";
  }

  format() {
    const lines = this.source.split("\n");
    const errorLine = lines[this.line - 1] || "";

    return `
❌ Syntax Error [${this.code}]
Lokasi : Baris ${this.line}, Kolom ${this.column}
Token  : '${this.token}'

Kode   :
  ${this.line} | ${errorLine}
      ${" ".repeat(this.column - 1)}^

Masalah:
  ${this.message}

${this.hint ? `Hint:\n  ${this.hint}` : ""}
`;
  }
}

module.exports = IndoError;