import { defineConfig } from "vite";
import * as cp from "child_process";

const commitHash = cp.execSync("git rev-parse --short HEAD").toString();

process.env.VITE_COMMIT_HASH = commitHash;

export default defineConfig({
    server: {
        port: 4000,

        hmr: {
            port: 4000,
            clientPort: 443,
            protocol: "wss",
        },
    },

    base: process.env.GITHUB_ACTIONS ? "/backrooms/" : "/",
});
