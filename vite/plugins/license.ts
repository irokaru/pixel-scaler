import fs, { readFileSync } from "node:fs";
import path from "node:path";

import checker from "license-checker";

import type { Plugin } from "vite";

function escapeHtml(string_: string): string {
  return string_
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export default function generateLicensePlugin(options: {
  outputDir: string;
  fileName: string;
  format?: "html" | "text";
}): Plugin {
  const distributionPath = options.outputDir || "dist";
  const format = options.format ?? "text";
  const defaultFileName =
    format === "html" ? "THIRD_PARTY_LICENSES.html" : "THIRD_PARTY_LICENSES";
  const licenseFileName = options.fileName || defaultFileName;

  return {
    name: "vite-plugin-generate-license",
    apply: "build",
    async closeBundle() {
      try {
        const packages = await new Promise<checker.ModuleInfos>(
          (resolve, reject) => {
            checker.init(
              { start: process.cwd(), production: true },
              (error, packages) => {
                if (error) return reject(error);
                resolve(packages);
              },
            );
          },
        );

        let text = `Third-Party Licenses for This Project\n`;
        text += `Generated on: ${new Date().toISOString()}\n`;
        text += `\n===========================================\n\n`;

        const sorted = Object.entries(packages).toSorted(([a], [b]) =>
          a.localeCompare(b),
        );

        for (const [packageName, info] of sorted) {
          text += `Package: ${packageName}\n`;
          text += `License: ${info.licenses}\n`;
          if (info.repository) text += `Repository: ${info.repository}\n`;
          if (info.publisher) text += `Publisher: ${info.publisher}\n`;
          if (info.email) text += `Email: ${info.email}\n`;
          if (info.licenseFile) {
            const licenseFile = readFileSync(info.licenseFile, "utf8");
            text += `${licenseFile.trim()}\n`;
          }
          text += "\n" + "-".repeat(80) + "\n\n";
        }

        const content =
          format === "html"
            ? `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Third-Party Licenses</title>
</head>
<body>
<pre>${escapeHtml(text)}</pre>
</body>
</html>
`
            : text;

        const outDirectory = path.resolve(process.cwd(), distributionPath);
        const outFile = path.join(outDirectory, licenseFileName);
        fs.mkdirSync(outDirectory, { recursive: true });
        fs.writeFileSync(outFile, content, "utf8");
        console.log(`✓ LICENSE file generated: ${outFile}`);
      } catch (error) {
        console.error("❌ Failed to generate license file:", error);
      }
    },
  };
}
