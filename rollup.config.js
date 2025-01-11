import resolve from "@rollup/plugin-node-resolve"
import commonjs from "@rollup/plugin-commonjs"
import typescript from "@rollup/plugin-typescript"
import terser from "@rollup/plugin-terser"

export default {
    input: "src/index.ts",
    output: [
        {
            file: "dist/index.cjs.js",  // CommonJS 格式
            format: "cjs",
            sourcemap: true,
            exports: 'named'
        },
        {
            file: "dist/index.mjs",     // ES Module 格式，使用 .mjs 后缀
            format: "esm",
            sourcemap: true
        },
        {
            file: "dist/index.esm.js",  // ES Module 格式，使用传统 .js 后缀
            format: "esm",
            sourcemap: true
        }
    ],
    external: [
        'msgpack-lite',
        'uuid',
        'polyfill-crypto-methods'
    ],
    plugins: [
        resolve({
            preferBuiltins: true,
            exportConditions: ['node']
        }),
        commonjs(),
        typescript({
            tsconfig: './tsconfig.json',
            sourceMap: true,
            declaration: true,
            declarationDir: 'dist'
        }),
        terser()
    ]
}