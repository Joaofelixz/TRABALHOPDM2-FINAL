import {defineConfig} from "vite";

export default defineConfig({
    root: "./",
    base: "./",
    publicDir: "public",
    appType: "mapa",
    server:{
        watch: {usePolling: true},
    },
});