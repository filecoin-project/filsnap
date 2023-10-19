# ⨎ FilSnap Monorepo

Filecoin Metamask Snap and related packages to enable developers to add Filecoin integration to their dapps.

This Snap enables storage of native Filecoin private keys in Metamask's local vault, to support native Filecoin addresses (e.g. f1 addresses or t1 testnet addresses).

For FEVM (Filecoin EVM) address support using Ethereum-style 0x addresses, you can also use regular Metamask directly **without** installing this Snap. 

- If you're using FEVM, the Snap can also show your 0x address info and its equivalent Filecoin f410 address. (More info about 0x / f410 addresses can be found in the [Filecoin Docs - Ethereum Address Manager](https://docs.filecoin.io/smart-contracts/filecoin-evm-runtime/address-types#ethereum-address-manager).)

## Resources

- [Filecoin MetaMask Snap Wallet Demo](https://filsnap.fission.app/)
- [Filecoin Metamask Snap Docs](https://filecoin-project.github.io/filsnap/)

## Packages

- [filsnap](https://github.com/filecoin-project/filsnap/tree/master/packages/snap) - Filecoin snap for Metamask
- [filsnap-adapter](https://github.com/filecoin-project/filsnap/tree/master/packages/adapter) - Adapter to interact with Filsnap from a dapp
- [filsnap-adapter-react](https://github.com/filecoin-project/filsnap/tree/master/packages/adapter-react) - React hooks to interact with Filsnap from a dapp

## Examples

- [`demo`](https://github.com/filecoin-project/filsnap/tree/master/examples/demo) - Preact demo dapp using [filsnap-adapter](<[./packages/adapter](https://github.com/filecoin-project/filsnap/tree/master/packages/adapter)>) to interact with [filsnap](<[./packages/snap](https://github.com/filecoin-project/filsnap/tree/master/packages/snap)>)
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
