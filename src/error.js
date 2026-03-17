class IndoError extends Error {
  constructor(message, line, column, source) {
    super(message);
    this.line = line || 1;
    this.column = column || 1;
    this.source = source || "";
  }

  format() {
    const lines = this.source.split("\n");
    const errorLine = lines[this.line - 1] || "";

    return `
❌ Syntax Error
Baris ${this.line}, Kolom ${this.column}:
${errorLine}
${" ".repeat(this.column - 1)}^
Pesan: ${this.message}
`;
  }
}

module.exports = IndoError;