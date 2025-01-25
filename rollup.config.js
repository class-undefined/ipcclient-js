const resolve = require("@rollup/plugin-node-resolve")
const commonjs = require("@rollup/plugin-commonjs")
const typescript = require("@rollup/plugin-typescript")
const terser = require("@rollup/plugin-terser")

module.exports = {
    input: "src/index.ts",
    output: [
        {
            file: "dist/index.cjs",  // 改为 .cjs 后缀
            format: "cjs",
            sourcemap: true,
            exports: 'named'
        },
        {
            file: "dist/index.mjs",  // ESM 使用 .mjs
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