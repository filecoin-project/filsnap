# Filsnap adapter

[![NPM Version](https://img.shields.io/npm/v/filsnap-adapter.svg)](https://www.npmjs.com/package/filsnap-adapter)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Adapter](https://github.com/filecoin-project/filsnap/actions/workflows/adapter.yml/badge.svg)](https://github.com/filecoin-project/filsnap/actions/workflows/adapter.yml)

> Adapter for [Filsnap](../snap/)

Exposes a simple API to interact with the snap from a dapp and also Fil Forwarder contract metadata.

## Installation

```bash
pnpm install filsnap-adapter
```

## Usage

This adapter interacts directly with the snap, so Metamask with support for Snaps needs to be installed and unlocked in the browser.

```js
import { FilsnapAdapter } from 'filsnap-adapter'

const hasSnaps = await FilsnapAdapter.hasSnaps()
if (!hasSnaps) {
  console.error('Metamask with Snaps support is not installed')
  return
}

const snap = await FilsnapAdapter.connect({ network: 'testnet' }, 'npm:filsnap')

const { error, result } = await snap.getAddress()
if (error) {
  console.error(error)
} else {
  console.log(result)
  // t1d2xrzcslx7xlbbylc5c3d5lvandqw4iwl6epxba
}

const isAvailable = await FilsnapAdapter.isAvailable()
// true
```

Check out the [demo](../../examples/demo) for a working example and the [API](https://filecoin-project.github.io/filsnap/modules/filsnap_adapter.html) for more details.

## Contributing

Read contributing guidelines [here](../../.github/CONTRIBUTING.md).

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/filecoin-project/filsnap)

## License

Dual-licensed: [MIT](../../LICENSE-MIT), [Apache Software License v2](../../LICENSE-APACHE), by way of the
[Permissive License Stack](https://protocol.ai/blog/announcing-the-permissive-license-stack/).
