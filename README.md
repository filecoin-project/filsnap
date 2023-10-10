# ⨎ FilSnap Monorepo

Filecoin metamask snap and related packages to enable developers to add Filecoin integration to their dapps.

## Packages

- [filsnap](https://github.com/filecoin-project/filsnap/tree/master/packages/snap) - Filecoin snap for metamask
- [filsnap-adapter](https://github.com/filecoin-project/filsnap/tree/master/packages/adapter) - Adapter to interact with Filsnap from a dapp
- [filsnap-adapter-react](https://github.com/filecoin-project/filsnap/tree/master/packages/adapter-react) - React hooks to interact with Filsnap from a dapp

## Examples

- [`demo`](https://github.com/filecoin-project/filsnap/tree/master/examples/demo) - Preact demo dapp using [filsnap-adapter](<[./packages/adapter](https://github.com/filecoin-project/filsnap/tree/master/packages/adapter)>) to interact with [filsnap](<[./packages/snap](https://github.com/filecoin-project/filsnap/tree/master/packages/snap)>)
- [`fil-forwarder-viem`](https://github.com/filecoin-project/filsnap/tree/master/examples/fil-forwarder-viem) - [Viem](https://viem.sh/) example to send FIL using FilForwarder contract.

### Checkout examples

You can use [Codesandbox](https://githubbox.com/filecoin-project/filsnap/tree/master/examples/demo) and start hacking right away.

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


## Security Audits

**Filsnap v1.0.0** - The FilSnap v0.5.0 was audited by [ConsenSys Diligence](https://consensys.io/diligence/) in August 2023 with a follow-up assessment of fixes conducted in October 2023, leading to the release of [filsnap-v1.0.0](https://github.com/filecoin-project/filsnap/releases/tag/filsnap-v1.0.0). The complete audit report is [available here](./audits/filsnap-audit-2023-08.pdf) in the `audits/` directory as well as on the [ConsenSys Diligence website](https://consensys.io/diligence/audits/2023/08/metamask/partner-snaps-filsnap/).
