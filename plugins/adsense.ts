import { writeFileSync } from "node:fs";
import path from "node:path";

import { loadEnv, type Plugin } from "vite";

type Options = {
  client?: string;
};

export default function appendAdSensePlugin(options: Options = {}): Plugin {
  let outputDir: string;
  const env = loadEnv(process.env.NODE_ENV || "development", process.cwd(), "");
  const client = options.client || env.VITE_ADSENSE_CLIENT;

  const adSenseScript = `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}" crossorigin="anonymous"></script>`;

  return {
    name: "vite-plugin-append-adsense",
    configResolved(config) {
      outputDir = config.build.outDir;
    },
    transformIndexHtml(html) {
      if (!client) return html;
      return html.replace(/<\/head>/, `  ${adSenseScript}\n</head>`);
    },
    closeBundle() {
      if (!client) {
        console.warn(
          "VITE_ADSENSE_CLIENT is not set. Skipping AdSense script.",
        );
        return;
      }
      const outputAdsTxt = path.resolve(outputDir, "ads.txt");
      writeFileSync(
        outputAdsTxt,
        `google.com, ${client.slice(3)}, DIRECT, f08c47fec0942fa0\n`,
      );
      console.log(`✓ AdSense script added with client: ${client}`);
    },
  };
}
