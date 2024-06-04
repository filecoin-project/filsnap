import snaps from '@metamask/snaps-rollup-plugin'
import commonjs from '@rollup/plugin-commonjs'
import resolve from '@rollup/plugin-node-resolve'
import sucrase from '@rollup/plugin-sucrase'
import terser from '@rollup/plugin-terser'
import { defineConfig } from 'rollup'

export default defineConfig({
  input: 'src/index.ts',

  output: {
    file: './dist/snap.js',
    format: 'umd',
    name: '<snap>',
  },
  plugins: [
    commonjs(),
    resolve({
      preferBuiltins: false,
      browser: true,
    }),
    sucrase({
      exclude: ['test/**/*'],
      transforms: ['typescript'],
    }),
    snaps.default({
      eval: true,
      stripComments: true,
      manifestPath: './snap.manifest.json',
      writeManifest: true,
    }),
    terser(),
  ],
})
