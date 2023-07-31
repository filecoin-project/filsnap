# ⨎ FilSnap Monorepo

Filecoin metamask snap and related packages to enable developers to add Filecoin integration to their dapps.

## Packages

- [filsnap](./packages/snap) - Filecoin snap for metamask
- [filsnap-adapter](./packages/adapter) - Adapter to interact with Filsnap from a dapp
- [filsnap-adapter-react](./packages/adapter-react) - React hooks to interact with Filsnap from a dapp

## Examples

- [`demo`](./examples/demo) - Preact demo dapp using [filsnap-adapter](./packages/filsnap-adapter) to interact with [filsnap](./packages/filsnap)
- [`fil-forwarder-viem`](./examples/fil-forwarder-viem) - [Viem](https://viem.sh/) example to send FIL using FilForwarder contract.

### Checkout examples

You can use Codesandbox: <https://githubbox.com/filecoin-project/filsnap/tree/main/examples/demo> and start hacking right away.

To clone it locally:

```bash
npx tiged filecoin-project/filsnap/examples/demo filsnap-demo
cd filsnap-demo
pnpm install
pnpm dev
```

You can try any of the examples by replacing `demo` with the name of the example you want to try.

## Contributing

Read contributing guidelines [here](.github/CONTRIBUTING.md).

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/filecoin-project/filsnap)

## License

Dual-licensed: [MIT](./LICENSE-MIT), [Apache Software License v2](./LICENSE-APACHE), by way of the
[Permissive License Stack](https://protocol.ai/blog/announcing-the-permissive-license-stack/).
