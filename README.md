# ⨎ Filsnap

> A MetaMask [Snap](https://snaps.metamask.io/snap/npm/filsnap/) to add Filecoin support to the MetaMask extension.

## Features

- Enables dapps access to Filecoin accounts using Metamask.
- Manage Filecoin accounts, check balance, address, export private key and more.
- Send and receive FIL from native and FEVM addresses.
- Sign Filecoin messages and arbitrary data.
- Send Filecoin messages and estimate gas fees.
- Filecoin insights for FEVM transaction/signature requests.

## Resources

- [Companion App](https://filsnap.dev/)
- [Documentation](https://filecoin-project.github.io/filsnap/)

## Packages

- [filsnap](https://github.com/filecoin-project/filsnap/tree/master/packages/snap) - Filecoin snap for Metamask
- [filsnap-adapter](https://github.com/filecoin-project/filsnap/tree/master/packages/adapter) - Adapter to interact with Filsnap from a dapp
- [filsnap-adapter-react](https://github.com/filecoin-project/filsnap/tree/master/packages/adapter-react) - React hooks to interact with Filsnap from a dapp

## Examples

- [`demo`](https://github.com/filecoin-project/filsnap/tree/master/examples/demo) - Preact demo dapp using [filsnap-adapter](https://github.com/filecoin-project/filsnap/tree/master/packages/adapter) to interact with [filsnap](https://github.com/filecoin-project/filsnap/tree/master/packages/snap)
- [`insights-wagmi`](https://github.com/filecoin-project/filsnap/tree/master/examples/insights-wagmi) - Wagmi example using filsnap-adapter to enable transaction insights for smart contract calls. 
- [`fil-forwarder-viem`](https://github.com/filecoin-project/filsnap/tree/master/examples/fil-forwarder-viem) - [Viem](https://viem.sh/) example to send FIL using FilForwarder contract.
- [Fund Ring](https://github.com/FundRing/fundring/tree/main/src/routes/filfund) - Svelte dapp [dapp](https://fundring.fission.app/) that using filsnap to fund projects with Filecoin.

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

**Filsnap v1.0.1** - The FilSnap v0.5.0 was audited by [ConsenSys Diligence](https://consensys.io/diligence/) in August 2023 with a follow-up assessment of fixes conducted in October 2023, leading to the release of [filsnap-v1.0.1](https://github.com/filecoin-project/filsnap/releases/tag/filsnap-v1.0.1). The complete audit report is [available here](./audits/filsnap-audit-2023-08.pdf) in the `audits/` directory as well as on the [ConsenSys Diligence website](https://consensys.io/diligence/audits/2023/08/metamask/partner-snaps-filsnap/).
