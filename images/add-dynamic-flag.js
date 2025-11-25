import fs from "fs";
import path from "path";

const rootDir = "./app/api";

function addDynamicFlag(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);

    if (entry.isDirectory()) {
      addDynamicFlag(fullPath);
    } else if (entry.isFile() && entry.name === "route.ts") {
      let content = fs.readFileSync(fullPath, "utf8");
      if (!content.includes("export const dynamic")) {
        const updated = `export const dynamic = "force-dynamic"\n\n${content}`;
        fs.writeFileSync(fullPath, updated);
        console.log(`✅ Added to: ${fullPath}`);
      }
    }
  }
}

addDynamicFlag(rootDir);
console.log("✨ Done!");