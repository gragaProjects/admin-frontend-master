import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// For ESM paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path where user opened terminal (important!)
const BASE_PATH = process.env.INIT_CWD;

const input = process.argv[2];

if (!input) {
  console.log("❌ Usage: npm run make Header/Nav.jsx");
  process.exit(1);
}

// resolve relative path from where terminal was opened
const filePath = path.isAbsolute(input)
  ? path.join(BASE_PATH, input.replace(/^\//, ""))
  : path.join(BASE_PATH, input);

const folder = path.dirname(filePath);
const fileName = path.basename(filePath);
const ext = path.extname(filePath);

// Create folder
fs.mkdirSync(folder, { recursive: true });

let content = "";

// Auto JSX file
if (ext === ".jsx") {
  const componentName = fileName.replace(".jsx", "");
  content = `
import React from 'react';

export default function ${componentName}() {
  return (
    <div>${componentName} Component</div>
  );
}
`;
}

// Write file
fs.writeFileSync(filePath, content.trim());
console.log(`✅ Created: ${filePath}`);
