import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';

export default {
    input: 'nodes/index.js',
    output: {
        file: 'dist/bundle.js',
        format: 'cjs',
        sourcemap: true
    },
    external: [
        'n8n-workflow',
        'node-fetch',
        'p-retry',
        'retry'
    ],
    plugins: [
        resolve(),
        commonjs(),
        json(),
        terser()
    ],
};
