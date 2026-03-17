#!/usr/bin/env node

const { compile } = require("../src/compiler");
const { execSync } = require("child_process");

const args = process.argv.slice(2);

const command = args[0];
const file = args[1];

if (!command || !file) {
  console.log("indo run file.indo");
  process.exit(0);
}

if (command === "run") {
  const out = compile(file);
  execSync(`node ${out}`, { stdio: "inherit" });
}