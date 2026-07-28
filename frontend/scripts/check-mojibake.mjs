import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const blockedDirs = new Set([".next", "node_modules", ".git"]);
const extensions = new Set([".ts", ".tsx", ".js", ".jsx", ".json", ".md", ".css", ".mjs", ".cjs"]);
const patterns = [
  "\u00c3\u00a2\u00e2\u201a\u00ac\u00e2\u20ac\u0153",
  "\u00c3\u00a2\u00e2\u201a\u00ac\u00e2\u20ac\u009d",
  "\u00c3\u00a2\u00e2\u201a\u00ac\u00e2\u201e\u00a2",
  "\u00c3\u00a2\u00e2\u201a\u00ac\u00c5\u201c",
  "\u00c3\u00a2\u00e2\u201a\u00ac",
  "\u00c3\u00a2\u00e2\u20ac\u0161\u00c2\u00b9",
  "\u00c3\u201a",
  "\u00c2\u00b7",
  "\ufffd",
];

function extensionOf(file) {
  const index = file.lastIndexOf(".");
  return index >= 0 ? file.slice(index) : "";
}

function walk(dir, matches) {
  for (const entry of readdirSync(dir)) {
    if (blockedDirs.has(entry)) continue;
    const path = join(dir, entry);
    const stat = statSync(path);
    if (stat.isDirectory()) {
      walk(path, matches);
      continue;
    }
    if (!extensions.has(extensionOf(entry))) continue;

    const content = readFileSync(path, "utf8");
    for (const pattern of patterns) {
      if (content.includes(pattern)) {
        matches.push(`${relative(root, path)} contains ${pattern}`);
      }
    }
  }
}

const matches = [];
walk(root, matches);

if (matches.length) {
  console.error("Mojibake patterns found:");
  for (const match of matches) console.error(`- ${match}`);
  process.exit(1);
}

console.log("No mojibake patterns found.");
