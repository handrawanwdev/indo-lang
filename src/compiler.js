const fs = require("fs");
const Lexer = require("./lexer");
const Parser = require("./parser");
const Generator = require("./generator");

function compile(file) {
  const code = fs.readFileSync(file, "utf-8");

  try {
    const tokens = new Lexer(code).tokenize();
    const ast = new Parser(tokens, code).parse();
    const output = new Generator().generate(ast);

    const outFile = file.replace(".indo", ".js");

    fs.writeFileSync(outFile, output);

    return outFile;
  } catch (err) {
    if (err.format) {
      console.log(err.format());
    } else {
      console.log("❌ Error:", err.message);
    }
    process.exit(1);
  }
}

module.exports = { compile };