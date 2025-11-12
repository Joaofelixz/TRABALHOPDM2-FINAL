import {defineConfig} from "vite";

export default defineConfig({
    root: "./",
    base: "./",
    publicDir: "public",
    appType: "mpa",
    server:{
        watch: {usePolling: true},
    },
});