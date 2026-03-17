const fs = require("fs");
const path = require("path");

const Lexer = require("./lexer");
const Parser = require("./parser");
const Generator = require("./generator");

const inputFile = process.argv[2];

if (!inputFile) {
  console.log("Gunakan: node src/index.js file.indo");
  process.exit(1);
}

const code = fs.readFileSync(inputFile, "utf-8");

// compile
const tokens = new Lexer(code).tokenize();
const ast = new Parser(tokens).parse();
const output = new Generator().generate(ast);

// output file
const outputFile = inputFile.replace(".indo", ".js");

fs.writeFileSync(outputFile, output);

console.log("✅ Compile sukses:", outputFile);