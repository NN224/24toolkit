import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, PluginOption } from "vite";
import { sentryVitePlugin } from "@sentry/vite-plugin";

import sparkPlugin from "@github/spark/spark-vite-plugin";
import createIconImportProxy from "@github/spark/vitePhosphorIconProxyPlugin";
import { resolve } from "path";

const projectRoot = process.env.PROJECT_ROOT || import.meta.dirname;

const vendorChunkMatchers = [
  { name: "react-vendor", pattern: /node_modules\/(react|react-dom|scheduler|react-router-dom)\// },
  { name: "ui-vendor", pattern: /node_modules\/(@radix-ui|@phosphor-icons|class-variance-authority|clsx|tailwind-merge)\// },
  { name: "image-tools", pattern: /node_modules\/(browser-image-compression|tesseract\.js)\// },
  { name: "charts", pattern: /node_modules\/(recharts|d3)\// },
  { name: "utilities", pattern: /node_modules\/(date-fns|papaparse|marked|uuid)\// },
  { name: "three", pattern: /node_modules\/three\// },
  { name: "ai-clients", pattern: /node_modules\/(@anthropic-ai|groq-sdk)\// },
];

const chunkMatcher = (id: string) => {
  if (!id.includes("node_modules")) {
    return undefined;
  }

  for (const { name, pattern } of vendorChunkMatchers) {
    if (pattern.test(id)) {
      return name;
    }
  }

  return "vendor";
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // DO NOT REMOVE
    createIconImportProxy() as PluginOption,
    sparkPlugin() as PluginOption,
    // Sentry sourcemap upload (only in production build)
    process.env.SENTRY_AUTH_TOKEN && sentryVitePlugin({
      org: process.env.SENTRY_ORG,
      project: process.env.SENTRY_PROJECT,
      authToken: process.env.SENTRY_AUTH_TOKEN,
      sourcemaps: {
        filesToDeleteAfterUpload: ["./dist/**/*.map"],
      },
      release: {
        name: process.env.VITE_APP_VERSION || "1.0.0",
      },
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": resolve(projectRoot, "src"),
    },
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, "/api"),
        ws: true,
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1200,
    sourcemap: true, // Enable sourcemaps for Sentry
    rollupOptions: {
      output: {
        manualChunks(id) {
          return chunkMatcher(id);
        },
      },
    },
  },
});
