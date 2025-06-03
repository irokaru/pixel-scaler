import fs, { readFileSync } from "node:fs";
import path from "node:path";

import checker from "license-checker";

import type { Plugin } from "vite";

export default function generateLicensePlugin(options: {
  outputDir: string;
  fileName: string;
}): Plugin {
  const distPath = options.outputDir || "dist";
  const licenseFileName = options.fileName || "LICENSE";

  return {
    name: "vite-plugin-generate-license",
    apply: "build",
    async closeBundle() {
      try {
        const packages = await new Promise<checker.ModuleInfos>(
          (resolve, reject) => {
            checker.init({ start: process.cwd() }, (err, packages) => {
              if (err) return reject(err);
              resolve(packages);
            });
          },
        );

        let content = `Third-Party Licenses for This Project\n`;
        content += `Generated on: ${new Date().toISOString()}\n`;
        content += `\n===========================================\n\n`;

        const sorted = Object.entries(packages).sort(([a], [b]) =>
          a.localeCompare(b),
        );

        for (const [pkgName, info] of sorted) {
          content += `Package: ${pkgName}\n`;
          content += `License: ${info.licenses}\n`;
          if (info.repository) content += `Repository: ${info.repository}\n`;
          if (info.publisher) content += `Publisher: ${info.publisher}\n`;
          if (info.email) content += `Email: ${info.email}\n`;
          if (info.licenseFile) {
            const licenseFile = readFileSync(info.licenseFile, "utf8");
            content += `${licenseFile.trim()}\n`;
          }
          content += "\n" + "-".repeat(80) + "\n\n";
        }

        const outDir = path.resolve(process.cwd(), distPath);
        const outFile = path.join(outDir, licenseFileName);
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(outFile, content, "utf8");
        console.log(`✓ LICENSE file generated: ${outFile}`);
      } catch (error) {
        console.error("❌ Failed to generate license file:", error);
      }
    },
  };
}
