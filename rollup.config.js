import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"
import { nodeResolve } from "@rollup/plugin-node-resolve"

export default {
    input: ["src/index.ts"],
    output: [
        {
            file: "dist/index.cjs.js",
            format: "cjs",
            sourcemap: true,
        },
        {
            file: "dist/index.esm.js",
            format: "esm",
            sourcemap: true,
        },
        {
            file: "dist/index.amd.js",
            format: "amd",
            sourcemap: true,
        },
    ],
    external: ["src/tests/"],
    plugins: [
        resolve(),
        commonjs(),
        typescript(),
        terser(),
        nodeResolve({ exportConditions: ["node"] }),
    ],
}
