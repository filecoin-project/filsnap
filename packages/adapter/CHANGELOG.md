# Changelog

## [2.1.1](https://github.com/filecoin-project/filsnap/compare/filsnap-adapter-v2.1.0...filsnap-adapter-v2.1.1) (2025-03-07)


### Bug Fixes

* **adapter:** revert using fil_setconfig in configure ([dfb3025](https://github.com/filecoin-project/filsnap/commit/dfb302517a52e4623d0c761dba76db2c5b427b82))
* moved iso-filecoin to peer dependencies and some other to dev ([e9cfc33](https://github.com/filecoin-project/filsnap/commit/e9cfc337ea9d1901cc2ff7b07ef16b85a9f31ef2))
* revert peer iso-filecoin ([39ac4ab](https://github.com/filecoin-project/filsnap/commit/39ac4abe9e0254fb8c4b48bb916b05b936dbe628))

## [2.1.0](https://github.com/filecoin-project/filsnap/compare/filsnap-adapter-v2.0.4...filsnap-adapter-v2.1.0) (2025-02-28)


### Features

* **adapter:** add `changeNetwork`, `deriveAccount`, `getAccount` methods ([1b6681a](https://github.com/filecoin-project/filsnap/commit/1b6681ab94e28fd121602f02695172d22ee984a4))
* **adapter:** add new method `sign` to sign arbitrary bytes ([10cfecb](https://github.com/filecoin-project/filsnap/commit/10cfecb79b2f1f9a51dffa2ba38309d0ce634184))
* add lotus hex encoded private key export to the UI ([4395102](https://github.com/filecoin-project/filsnap/commit/4395102f49bb9fc5d95ec26d35e547fc102c68f9))


### Bug Fixes

* move `chainIdtoNetwork`out of the connector ([4a1dc2a](https://github.com/filecoin-project/filsnap/commit/4a1dc2a34f10fce8b1882d592bf0130559f895be))

## [2.0.4](https://github.com/filecoin-project/filsnap/compare/filsnap-adapter-v2.0.3...filsnap-adapter-v2.0.4) (2025-01-31)


### Bug Fixes

* revert to platform 6.13.0 ([f9ca421](https://github.com/filecoin-project/filsnap/commit/f9ca421d402ced509eeff5c1e9db350902a99579))
* use chain definitions from iso-filecoin ([307658f](https://github.com/filecoin-project/filsnap/commit/307658fc001cb20cc33d5d40e3aadfe03d9b832a))
* use chain human readable name ([f23114d](https://github.com/filecoin-project/filsnap/commit/f23114d5dba6392443d750c8eb31fe385fccc65d))

## [2.0.3](https://github.com/filecoin-project/filsnap/compare/filsnap-adapter-v2.0.2...filsnap-adapter-v2.0.3) (2025-01-28)


### Bug Fixes

* upgrade iso-filecoin 6.x ([e56434b](https://github.com/filecoin-project/filsnap/commit/e56434b345633fc927278a04084bc23b809565cc))

## [2.0.2](https://github.com/filecoin-project/filsnap/compare/filsnap-adapter-v2.0.1...filsnap-adapter-v2.0.2) (2024-10-29)


### Bug Fixes

* support undefined network when not filecoin chain ([d1ed11d](https://github.com/filecoin-project/filsnap/commit/d1ed11d249f753e8854382fef0f6403a5e1e5eae))

## [2.0.1](https://github.com/filecoin-project/filsnap/compare/filsnap-adapter-v2.0.0...filsnap-adapter-v2.0.1) (2024-10-02)


### Bug Fixes

* fix chain names to avoid metamask warnings ([814317f](https://github.com/filecoin-project/filsnap/commit/814317f1cee92cd40061837ac1e5a6837f4cf108))

## [2.0.0](https://github.com/filecoin-project/filsnap/compare/filsnap-adapter-v1.0.2...filsnap-adapter-v2.0.0) (2024-09-03)


### ⚠ BREAKING CHANGES

* add reconnect, disconnect and changeChain, add better getProvider and new connector to manage provider

### Features

* add reconnect, disconnect and changeChain, add better getProvider and new connector to manage provider ([94f8792](https://github.com/filecoin-project/filsnap/commit/94f8792ef962336609b7e9303c785800e469a76f))
* **snap:** add basic onHomePage and onInstall handlers ([ad5f28c](https://github.com/filecoin-project/filsnap/commit/ad5f28c19c913cfe1a45a1bf769fca5397373417))


### Bug Fixes

* keep trying to find mm provider ([6f0096f](https://github.com/filecoin-project/filsnap/commit/6f0096f44bd59183c301ec602e1291b3f4a0f577))

## [1.0.2](https://github.com/filecoin-project/filsnap/compare/filsnap-adapter-v1.0.1...filsnap-adapter-v1.0.2) (2024-07-03)


### Bug Fixes

* add proper types to the provider ([429bbcf](https://github.com/filecoin-project/filsnap/commit/429bbcf30435dd1fe3f91d568ac844ec91a475cc))
* improve connection logic to not force install ([6cc4f1f](https://github.com/filecoin-project/filsnap/commit/6cc4f1fb8d32b6c86924ede567d72529a8a3584a))
* snaps, iso-filecoin and other dep updates ([158696f](https://github.com/filecoin-project/filsnap/commit/158696fce26f1ac108707715495d1b34e3a44101))

## [1.0.1](https://github.com/filecoin-project/filsnap/compare/filsnap-adapter-v1.0.0...filsnap-adapter-v1.0.1) (2024-03-07)


### Bug Fixes

* collisions with other wallet providers ([#162](https://github.com/filecoin-project/filsnap/issues/162)) ([a166ddb](https://github.com/filecoin-project/filsnap/commit/a166ddb189282b3c327dc411b57b857064765335))
* fix metamask updates ([#163](https://github.com/filecoin-project/filsnap/issues/163)) ([4aa9642](https://github.com/filecoin-project/filsnap/commit/4aa96421f871388e3804a4f99e626bd090a46248))

## [1.0.0](https://github.com/filecoin-project/filsnap/compare/filsnap-adapter-v0.3.0...filsnap-adapter-v1.0.0) (2023-09-12)


### ⚠ BREAKING CHANGES

* remove getMessages and add error to connect

### Features

* remove getMessages and add error to connect ([ca10c48](https://github.com/filecoin-project/filsnap/commit/ca10c48c71d45a21f8f20f3f8a6635c88591aa03))
* update mm and others ([#60](https://github.com/filecoin-project/filsnap/issues/60)) ([06dd585](https://github.com/filecoin-project/filsnap/commit/06dd5858af23b47907ba32b2a16e3de756476845))


### Bug Fixes

* remove flask detection code ([776c41b](https://github.com/filecoin-project/filsnap/commit/776c41b4eb8bac08a6f8d17cf83d157fb047fe34)), closes [#62](https://github.com/filecoin-project/filsnap/issues/62)
* remove programatic private key export and add more info to the UI elements ([c88a9ee](https://github.com/filecoin-project/filsnap/commit/c88a9ee1359e9a35735ce5d7b18b4cfcd2de0326)), closes [#67](https://github.com/filecoin-project/filsnap/issues/67)

## [0.3.0](https://github.com/filecoin-project/filsnap/compare/filsnap-adapter-v0.2.1...filsnap-adapter-v0.3.0) (2023-08-09)


### Features

* add transaction insight for FilForwarder transfers ([#48](https://github.com/filecoin-project/filsnap/issues/48)) ([863376c](https://github.com/filecoin-project/filsnap/commit/863376c56f5f0b6fe52994a55717a6f020e68a3e))

## [0.2.1](https://github.com/filecoin-project/filsnap/compare/filsnap-adapter-v0.2.0...filsnap-adapter-v0.2.1) (2023-07-30)


### Bug Fixes

* improve docs and type descriptions ([b6c95cc](https://github.com/filecoin-project/filsnap/commit/b6c95ccde12b015812721abaf90d970b1a1a82e4))

## [0.2.0](https://github.com/filecoin-project/filsnap/compare/filsnap-adapter-v0.1.1...filsnap-adapter-v0.2.0) (2023-07-29)


### Features

* expose `FilForwarder` metadata in adapter ([#30](https://github.com/filecoin-project/filsnap/issues/30)) ([41a04b9](https://github.com/filecoin-project/filsnap/commit/41a04b92ccad985dd74ceb0fe90c16fa67c9aa46))


### Bug Fixes

* add version to adapter ([ffba158](https://github.com/filecoin-project/filsnap/commit/ffba15808e3de230c3fd728eb9e971dbf3b6305f))

## [0.1.1](https://github.com/filecoin-project/filsnap/compare/filsnap-adapter-v0.1.0...filsnap-adapter-v0.1.1) (2023-07-24)


### Bug Fixes

* connect now updates snap if needed ([810c355](https://github.com/filecoin-project/filsnap/commit/810c35512a5294c0c797e69ff7ead16de5ed6bc9))

## [0.1.0](https://github.com/filecoin-project/filsnap/compare/filsnap-adapter-v0.0.2...filsnap-adapter-v0.1.0) (2023-07-22)


### Features

* support all address protocols ([2bb504e](https://github.com/filecoin-project/filsnap/commit/2bb504e8fe6bed61528acf71e042d66cda26cf9a))

## [0.0.2](https://github.com/filecoin-project/filsnap/compare/filsnap-adapter-v0.0.1...filsnap-adapter-v0.0.2) (2023-07-13)


### Bug Fixes

* initial commit ([cf3479f](https://github.com/filecoin-project/filsnap/commit/cf3479fdd0af6dc1b23bfba9063b028f68fb3006))

## [0.0.2](https://github.com/filecoin-project/filsnap/compare/filsnap-adapter-v0.0.1...filsnap-adapter-v0.0.2) (2023-07-13)


### Bug Fixes

* initial commit ([cf3479f](https://github.com/filecoin-project/filsnap/commit/cf3479fdd0af6dc1b23bfba9063b028f68fb3006))
