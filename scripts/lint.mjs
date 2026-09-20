#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const roots = ["src", "scripts", "tests", "test"];
const extensions = new Set([".js", ".cjs", ".mjs", ".ts", ".tsx"]);
const failures = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (extensions.has(path.extname(entry.name))) check(full);
  }
}

function check(file) {
  const source = fs.readFileSync(file, "utf8");
  const lines = source.split(/\r?\n/);
  lines.forEach((line, index) => {
    if (/[ \t]+$/.test(line)) failures.push(`${file}:${index + 1}: trailing whitespace`);
  });
  if (source.includes("<<<<<<<") || source.includes("=======") || source.includes(">>>>>>>")) {
    failures.push(`${file}: unresolved merge-conflict marker`);
  }
}

for (const root of roots) walk(root);

if (failures.length) {
  console.error("Lint failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Lint passed: no trailing whitespace or merge-conflict markers found.");
