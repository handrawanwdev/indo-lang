// src/environment.js
class Environment {
  constructor(parent = null) {
    this.vars = {};
    this.parent = parent;
  }

  set(name, value) {
    this.vars[name] = value;
  }

  get(name) {
    if (name in this.vars) return this.vars[name];
    if (this.parent) return this.parent.get(name);
    throw new Error(`Variabel tidak ditemukan: ${name}`);
  }
}

module.exports = Environment;