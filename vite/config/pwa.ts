import { VitePWAOptions } from "vite-plugin-pwa";

export const pwaConfig: Partial<VitePWAOptions> = {
  registerType: "autoUpdate" as const,
  workbox: {
    globPatterns: ["**/*.{js,css,html,ico,png,svg,woff2}"],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
        handler: "CacheFirst" as const,
        options: {
          cacheName: "google-fonts-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365,
          },
        },
      },
      {
        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
        handler: "CacheFirst" as const,
        options: {
          cacheName: "gstatic-fonts-cache",
          expiration: {
            maxEntries: 10,
            maxAgeSeconds: 60 * 60 * 24 * 365,
          },
        },
      },
    ],
  },
  includeAssets: ["favicon.ico", "logo.png", "banner.png"],
  manifest: {
    name: "ぴくせる すけゐらぁ",
    short_name: "PiXel ScaLer",
    description: "ドット絵をイラスト調にリサイズできるやつです",
    theme_color: "#ffffff",
    background_color: "#ffffff",
    display: "standalone" as const,
    orientation: "portrait" as const,
    scope: "/",
    start_url: "/",
    categories: ["graphics", "utilities"],
    icons: [
      {
        src: "logo.png",
        sizes: "256x256",
        type: "image/png",
        purpose: "any maskable",
      },
    ],
  },
  devOptions: {
    enabled: false,
  },
};
