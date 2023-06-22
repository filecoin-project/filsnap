# filsnap-testing

Test suite for [FilSnap](https://github.com/ChainSafe/filsnap) using Playwright.

> Note: Currently metamask >= v10.28.0 is not supported.

## Usage

```bash
pnpm run test
pnpm run test -- --headed # run tests in headful mode
pnpm run test -- --debug # run tests in debug mode
```

## Github Actions

The CI needs to be configured with the following secrets:

- `WEB3_TOKEN` - web3.storage token
- `SLACK_WEBHOOK` - slack webhook url

Theres 3 workflows:

- `testing` - runs on every push and PR to main branch
- `manual` - runs on demand and allows to specify the branch to test and configure with tests with ENV variables
- `cron` - runs daily and tests the latest main branch and will notify to slack if there are any failures

All of the above workflows will upload the Playwright report to web3.storage and add the IPFS url to the workflow summary.
