# filsnap-adapter-react

[![NPM Version](https://img.shields.io/npm/v/filsnap-adapter-react.svg)](https://www.npmjs.com/package/filsnap-adapter-react)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Adapter](https://github.com/filecoin-project/filsnap/actions/workflows/adapter-react.yml/badge.svg)](https://github.com/filecoin-project/filsnap/actions/workflows/adapter-react.yml)

React hook for [Filsnap](../snap/README.md).

## Installation

```bash
pnpm install filsnap-adapter-react
```

## Usage

```js
import { FilsnapProvider } from 'filsnap-adapter-react'

const config = {
  network: 'testnet',
}

function Main() {
  return (
    <FilsnapProvider snap="npm:filsnap" config={config}>
      <App />
    </FilsnapProvider>
  )
}
```

```js
import { useFilsnap } from 'filsnap-adapter-react'

function App() {
  const { isLoading, hasFlask, isConnected, connect, account, error } =
    useFilsnap()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isConnected) {
    return <button onClick={() => connect()}>Connect to Filecoin Snap</button>
  }

  return <div>Connected to {account.address}</div>
}
```

Check out the [demo](../../examples/demo) for a working example and the [API](https://filecoin-project.github.io/filsnap/modules/filsnap_adapter_react.html) for more details.

## Contributing

Read contributing guidelines [here](../../.github/CONTRIBUTING.md).

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/filecoin-project/filsnap)

## License

Dual-licensed: [MIT](../../LICENSE-MIT), [Apache Software License v2](../../LICENSE-APACHE), by way of the
[Permissive License Stack](https://protocol.ai/blog/announcing-the-permissive-license-stack/).
