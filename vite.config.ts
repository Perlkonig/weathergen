import { defineConfig } from "vite";
import * as path from "path";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";

let file = fileURLToPath(new URL("package.json", import.meta.url));
const json = readFileSync(file, "utf8");
const pkg = JSON.parse(json);

file = fileURLToPath(new URL("README.md", import.meta.url));
const readme = readFileSync(file, "utf8");

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],
    define: {
        __APP_VERSION__: JSON.stringify(pkg.version),
        __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
        __README__: JSON.stringify(readme),
    },
    resolve: {
        alias: [
            {
                find: "@",
                replacement: path.resolve("./src"),
            },
        ],
    },
});
