import type { SnapConfig } from '@metamask/snaps-cli'

const config: SnapConfig = {
  input: 'src/index.tsx',
  output: {
    filename: 'snap.js',
  },
  polyfills: {
    buffer: true,
  },
  server: {
    port: 8080,
  },
}

export default config