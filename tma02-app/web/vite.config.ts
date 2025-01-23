/*
 * VCE Vite config for React Native for TM352 Block 2
 *
 * Please modify the line that begins "base" below to configure for your account.
 *
 * This solution is based on the following sources:
 *    https://stereobooster.com/posts/react-native-web-with-vite/#final-config
 *    https://github.com/necolas/react-native-web/discussions/2201
 * 
 * Change log:
 *    13/09/2023 A Thomson, Intial version.
 *    09/09/2024 A Thomson, change to base varible to auto configure for JupyterHub.
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

let base = process.env.JUPYTERHUB_SERVICE_PREFIX || "/";let app_path = "http://localhost:5173";if (process.env.VSCODE_PROXY_URI) {  const url = new URL(process.env.VSCODE_PROXY_URI);  app_path = url.protocol + "//" + url.host;  base = base + "proxy/absolute/5173";}app_path = app_path + base;console.log("\nServer available at " + app_path + "\n");

const extensions = [
  ".web.tsx",
  ".tsx",
  ".web.ts",
  ".ts",
  ".web.jsx",
  ".jsx",
  ".web.js",
  ".js",
  ".css",
  ".json",
  ".mjs",
];

const development = process.env.NODE_ENV === "development";

export default defineConfig({
  clearScreen: true,
    
  base: base,
    
  plugins: [react()],
  define: {
    global: "window",
    __DEV__: JSON.stringify(development),
    DEV: JSON.stringify(development),
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
  },
  resolve: {
    extensions: extensions,
    alias: {
      "react-native": "react-native-web",
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: extensions,
      jsx: "automatic",
      loader: { ".js": "jsx" },
    },
  },
});