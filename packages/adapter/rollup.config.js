import { defineConfig } from 'rollup'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
// import snaps from '@metamask/snaps-rollup-plugin'
import sucrase from '@rollup/plugin-sucrase'

export default defineConfig({
  input: 'src/index.ts',

  output: {
    file: './dist/adapter.js',
    format: 'umd',
    name: '<adapter>',
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
    // snaps.default({
    //   eval: true,
    //   stripComments: true,
    //   manifestPath: './snap.manifest.json',
    //   writeManifest: true,
    // }),
  ],
})
