# Changelog

## [1.7.0](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.6.1...filsnap-v1.7.0) (2025-07-31)


### Features

* added support for FRC-102 and sign msg UI should utf8 string ([836a910](https://github.com/filecoin-project/filsnap/commit/836a91051170d71f9300b7154688f3908f202ad7))
* **snap:** add handleUcanSignature for UCAN insights ([a1efde5](https://github.com/filecoin-project/filsnap/commit/a1efde51edb32b0bb62fa4a2c57d5a57165a8bac))
* **snap:** add optional subtitle to ListHeader component ([e2ef20b](https://github.com/filecoin-project/filsnap/commit/e2ef20bc45cb5965e531c3caa0bc783659bd9385))
* **snap:** update to zod v4 ([372e427](https://github.com/filecoin-project/filsnap/commit/372e427129728329f1facbe63fb916a593fee44a))


### Bug Fixes

* default sig handler to only return with config ([17d2884](https://github.com/filecoin-project/filsnap/commit/17d28849632909224cf6053c49d367bc08d3b616))

## [1.6.1](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.6.0...filsnap-v1.6.1) (2025-03-27)


### Bug Fixes

* improve filforwarder copy ([9f28ca8](https://github.com/filecoin-project/filsnap/commit/9f28ca8e1e6e1cd10ce51d3288b9e5015415f025))

## [1.6.0](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.5.4...filsnap-v1.6.0) (2025-03-27)


### Features

* improve setConfig, add changeNetwork and deriveAccount ([ff56678](https://github.com/filecoin-project/filsnap/commit/ff56678f797b2002f415508d75993c83f3eb2d58))


### Bug Fixes

* move pathFromNetwork to new iso-filecoin entrypoint ([a9d0e43](https://github.com/filecoin-project/filsnap/commit/a9d0e43ad16d361da43f82b99e43e105187aaa24))

## [1.5.4](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.5.3...filsnap-v1.5.4) (2025-03-11)


### Bug Fixes

* revert to mm sdk 6.17.1 ([18a68f3](https://github.com/filecoin-project/filsnap/commit/18a68f3f83b2a8513bad3dbe5f29598d08e91ad5))

## [1.5.3](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.5.2...filsnap-v1.5.3) (2025-03-10)


### Bug Fixes

* republish ([57540d8](https://github.com/filecoin-project/filsnap/commit/57540d889be56bb72afabdbac5549939f0b1cbed))

## [1.5.2](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.5.1...filsnap-v1.5.2) (2025-03-10)


### Bug Fixes

* moved iso-filecoin to peer dependencies ([5ce5bfb](https://github.com/filecoin-project/filsnap/commit/5ce5bfb8e7075c49ae34e5ea2da478eb030e3fc6))
* **snap:** fix insights handlers to be first result wins ([5e2c58c](https://github.com/filecoin-project/filsnap/commit/5e2c58c6bc72fedd2798e37166a7ba1a907a1f62))

## [1.5.1](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.5.0...filsnap-v1.5.1) (2025-02-28)


### Bug Fixes

* add new methods to the readme ([7a32d36](https://github.com/filecoin-project/filsnap/commit/7a32d36594adf58cb75a0618b9fab68faa7a376a))

## [1.5.0](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.4.4...filsnap-v1.5.0) (2025-02-27)


### Features

* add `fil_sign` to sign arbitrary bytes ([95bef4b](https://github.com/filecoin-project/filsnap/commit/95bef4bcf63c5509c80bb832931bc5d856047297))
* add base64 validation to signature schema ([a14cd9f](https://github.com/filecoin-project/filsnap/commit/a14cd9f194c881cafd9083af280153b67d0b7e7d))
* add lotus hex encoded private key export to the UI ([4395102](https://github.com/filecoin-project/filsnap/commit/4395102f49bb9fc5d95ec26d35e547fc102c68f9))
* add support for multiple insights (transactions and signature) ([3d6cc28](https://github.com/filecoin-project/filsnap/commit/3d6cc2859d068fa6ee835064864230fca13a75fd))
* new `fil_getAccount` method and normalize acount internally ([93354f0](https://github.com/filecoin-project/filsnap/commit/93354f052a663cb79aca41e2f019ad2afc66c135))
* new `fil_getConfig` and  `fil_setConfig` to better handle the origin config ([7ac6774](https://github.com/filecoin-project/filsnap/commit/7ac6774e0497dfda690742a8654fc8663538ef67))


### Bug Fixes

* better error for zod validations ([2e46311](https://github.com/filecoin-project/filsnap/commit/2e46311642677968fa7390e655cd49a169b76b04))
* fix rpc network name handling in `fil_setConfig` ([cb6cce5](https://github.com/filecoin-project/filsnap/commit/cb6cce571673b3de77dd9acb1200e2d1313a3a86))
* remove schema coment that broke types ([739283f](https://github.com/filecoin-project/filsnap/commit/739283f7a893052d0fa725976c8efa5ab1b35d8c))
* rename internal account methods ([57ac341](https://github.com/filecoin-project/filsnap/commit/57ac341f1c52a75049d1aa72e9b15d4fe4ef73bc))

## [1.4.4](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.4.3...filsnap-v1.4.4) (2025-01-30)


### Bug Fixes

* revert to platform 6.13.0 ([cc8eb64](https://github.com/filecoin-project/filsnap/commit/cc8eb64e69a11e26b8bbbfa2874750c0e80b81b6))

## [1.4.3](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.4.2...filsnap-v1.4.3) (2025-01-29)


### Bug Fixes

* change configure dialog to human chain name ([ab5c323](https://github.com/filecoin-project/filsnap/commit/ab5c323d848516e183fc4ad1329c1b985473cb0a))

## [1.4.2](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.4.1...filsnap-v1.4.2) (2025-01-29)


### Bug Fixes

* use chain human readable name ([f23114d](https://github.com/filecoin-project/filsnap/commit/f23114d5dba6392443d750c8eb31fe385fccc65d))

## [1.4.1](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.4.0...filsnap-v1.4.1) (2025-01-28)


### Bug Fixes

* update snap platform version to 6.16.0 ([25fc79c](https://github.com/filecoin-project/filsnap/commit/25fc79c73880aab99a6a85ed5a3d18c8bde5922a))

## [1.4.0](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.3.0...filsnap-v1.4.0) (2025-01-28)


### Features

* add new design jsx components ([744ffee](https://github.com/filecoin-project/filsnap/commit/744ffee051bc1491790a69c97222aa4f8309946b))
* add new homepage with receive and send features and update all UI components ([9b20a8c](https://github.com/filecoin-project/filsnap/commit/9b20a8ce6cd466be79065f5b0138fa5c5c6ce156))
* add new method `fil_getConfig` ([43a28f1](https://github.com/filecoin-project/filsnap/commit/43a28f10e96995ea41f47ee62802c741d0ee11e4))
* update insights ui to new design and avoid insights when no origin config ([653ac4e](https://github.com/filecoin-project/filsnap/commit/653ac4e7e26a970a99c79b8af9d11f6f6ff5047f))


### Bug Fixes

* upgrade iso-filecoin 6.x ([e56434b](https://github.com/filecoin-project/filsnap/commit/e56434b345633fc927278a04084bc23b809565cc))

## [1.3.0](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.2.0...filsnap-v1.3.0) (2024-12-30)


### Features

* add filforwarder transaction insights ([abf7d5a](https://github.com/filecoin-project/filsnap/commit/abf7d5abd08da94e4855ff0cdafba2a4c713ebf1))


### Bug Fixes

* update to iso-filecoin 5.x ([ff08149](https://github.com/filecoin-project/filsnap/commit/ff08149b125d521cfb6488292fa9eabc1a3233db))

## [1.2.0](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.1.0...filsnap-v1.2.0) (2024-10-29)


### Features

* add filsnap.dev and glif.io to initialConnections ([53fb49a](https://github.com/filecoin-project/filsnap/commit/53fb49a064407206e80c7ded49c1ee451e848bbb))


### Bug Fixes

* fix account safe return ([b6c4f6a](https://github.com/filecoin-project/filsnap/commit/b6c4f6a25a6d060dffd9f5c8f4437aa8eb27e933))
* fix chain names to avoid metamask warnings ([814317f](https://github.com/filecoin-project/filsnap/commit/814317f1cee92cd40061837ac1e5a6837f4cf108))
* setup internal config on update and default to mainnet ([fd4d8ca](https://github.com/filecoin-project/filsnap/commit/fd4d8ca5de5a4e2bfb42c77f31aff87a13e6686b))
* update dialogs to JSX and some minor improvements to the UI ([18dd299](https://github.com/filecoin-project/filsnap/commit/18dd299f582d554be5d3caf4255f7e4493beaf24))
* update jsx components and mm-snap cli ([ff39df1](https://github.com/filecoin-project/filsnap/commit/ff39df1bb2e311c8c386c6b139832d3379b32bdd))

## [1.1.0](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.0.3...filsnap-v1.1.0) (2024-09-03)


### Features

* **snap:** add basic onHomePage and onInstall handlers ([ad5f28c](https://github.com/filecoin-project/filsnap/commit/ad5f28c19c913cfe1a45a1bf769fca5397373417))


### Bug Fixes

* moved provider type to adapter, updated to mm v12 ([56da6b5](https://github.com/filecoin-project/filsnap/commit/56da6b5cafe7ea85ef1b9944dd828c8ae30f483b))

## [1.0.3](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.0.2...filsnap-v1.0.3) (2024-07-03)


### Bug Fixes

* add proper types to the provider ([429bbcf](https://github.com/filecoin-project/filsnap/commit/429bbcf30435dd1fe3f91d568ac844ec91a475cc))
* cache config and use row() in UI ([25de01f](https://github.com/filecoin-project/filsnap/commit/25de01fcb1fe1d02726f1a5b5cd24dc15d9fc9b2)), closes [#173](https://github.com/filecoin-project/filsnap/issues/173)
* disable transation insights for now ([f0c1da8](https://github.com/filecoin-project/filsnap/commit/f0c1da8d9108fb00a6fa63331a59c1cb72572426))
* snaps, iso-filecoin and other dep updates ([158696f](https://github.com/filecoin-project/filsnap/commit/158696fce26f1ac108707715495d1b34e3a44101))

## [1.0.2](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.0.1...filsnap-v1.0.2) (2024-03-07)


### Bug Fixes

* collisions with other wallet providers ([#162](https://github.com/filecoin-project/filsnap/issues/162)) ([a166ddb](https://github.com/filecoin-project/filsnap/commit/a166ddb189282b3c327dc411b57b857064765335))
* fix metamask updates ([#163](https://github.com/filecoin-project/filsnap/issues/163)) ([4aa9642](https://github.com/filecoin-project/filsnap/commit/4aa96421f871388e3804a4f99e626bd090a46248))

## [1.0.1](https://github.com/filecoin-project/filsnap/compare/filsnap-v1.0.0...filsnap-v1.0.1) (2023-10-10)


### Bug Fixes

* add origin data to the signature dialogs ([6ddb227](https://github.com/filecoin-project/filsnap/commit/6ddb227738ed3aa041c18131eee65a98e17acdf4))
* change naming to Filecoin Wallet ([54c2783](https://github.com/filecoin-project/filsnap/commit/54c2783c6d0f1852c6f83a07dd38cf5f6ba5e314))

## [1.0.0](https://github.com/filecoin-project/filsnap/compare/filsnap-v0.5.0...filsnap-v1.0.0) (2023-09-12)


### ⚠ BREAKING CHANGES

* more UI info, remove Messages, origin scoped config, private key export only in the UI and more

### Features

* more UI info, remove Messages, origin scoped config, private key export only in the UI and more ([1a8715f](https://github.com/filecoin-project/filsnap/commit/1a8715f42cfc9f721e8faab8a7a2610f53592f94)), closes [#72](https://github.com/filecoin-project/filsnap/issues/72) [#70](https://github.com/filecoin-project/filsnap/issues/70) [#69](https://github.com/filecoin-project/filsnap/issues/69) [#68](https://github.com/filecoin-project/filsnap/issues/68) [#66](https://github.com/filecoin-project/filsnap/issues/66)
* update mm and others ([#60](https://github.com/filecoin-project/filsnap/issues/60)) ([06dd585](https://github.com/filecoin-project/filsnap/commit/06dd5858af23b47907ba32b2a16e3de756476845))


### Bug Fixes

* remove flask detection code ([776c41b](https://github.com/filecoin-project/filsnap/commit/776c41b4eb8bac08a6f8d17cf83d157fb047fe34)), closes [#62](https://github.com/filecoin-project/filsnap/issues/62)
* remove programatic private key export and add more info to the UI elements ([c88a9ee](https://github.com/filecoin-project/filsnap/commit/c88a9ee1359e9a35735ce5d7b18b4cfcd2de0326)), closes [#67](https://github.com/filecoin-project/filsnap/issues/67)

## [0.5.0](https://github.com/filecoin-project/filsnap/compare/filsnap-v0.4.1...filsnap-v0.5.0) (2023-08-01)


### Features

* add transaction insight for FilForwarder transfers ([#48](https://github.com/filecoin-project/filsnap/issues/48)) ([863376c](https://github.com/filecoin-project/filsnap/commit/863376c56f5f0b6fe52994a55717a6f020e68a3e))

## [0.4.1](https://github.com/filecoin-project/filsnap/compare/filsnap-v0.4.0...filsnap-v0.4.1) (2023-07-29)


### Bug Fixes

* improve docs and type descriptions ([b6c95cc](https://github.com/filecoin-project/filsnap/commit/b6c95ccde12b015812721abaf90d970b1a1a82e4))

## [0.4.0](https://github.com/filecoin-project/filsnap/compare/filsnap-v0.3.2...filsnap-v0.4.0) (2023-07-29)


### Features

* expose `FilForwarder` metadata in adapter ([#30](https://github.com/filecoin-project/filsnap/issues/30)) ([41a04b9](https://github.com/filecoin-project/filsnap/commit/41a04b92ccad985dd74ceb0fe90c16fa67c9aa46))

## [0.3.2](https://github.com/filecoin-project/filsnap/compare/filsnap-v0.3.1...filsnap-v0.3.2) (2023-07-24)


### Bug Fixes

* npm providence ([8f4b474](https://github.com/filecoin-project/filsnap/commit/8f4b4746f6839a7222674d2df6cb69f48267f54b))

## [0.3.1](https://github.com/filecoin-project/filsnap/compare/filsnap-v0.3.0...filsnap-v0.3.1) (2023-07-24)


### Bug Fixes

* use snap config to format fil amounts ([eba19be](https://github.com/filecoin-project/filsnap/commit/eba19bef0eaaf9a16a0fd8cf0b503f9395226146))

## [0.3.0](https://github.com/filecoin-project/filsnap/compare/filsnap-v0.2.0...filsnap-v0.3.0) (2023-07-22)


### Features

* support all address protocols ([2bb504e](https://github.com/filecoin-project/filsnap/commit/2bb504e8fe6bed61528acf71e042d66cda26cf9a))

## [0.2.0](https://github.com/filecoin-project/filsnap/compare/filsnap-v0.1.3...filsnap-v0.2.0) (2023-07-21)


### Features

* add support for f4 and 0x addresses ([c9be659](https://github.com/filecoin-project/filsnap/commit/c9be6595301959d0a82b4cff6cd572d5c4389efd))

## [0.1.3](https://github.com/filecoin-project/filsnap/compare/filsnap-v0.1.2...filsnap-v0.1.3) (2023-07-13)


### Bug Fixes

* update manifest ([53be07b](https://github.com/filecoin-project/filsnap/commit/53be07b06cb0ae5b20db2c190babe58d27b537ff))

## [0.1.2](https://github.com/filecoin-project/filsnap/compare/filsnap-v0.1.1...filsnap-v0.1.2) (2023-07-13)


### Bug Fixes

* add filecoin logo to npm ([e48fdf0](https://github.com/filecoin-project/filsnap/commit/e48fdf0169648e905b7da9c706e07f88129e7b41))

## [0.1.1](https://github.com/filecoin-project/filsnap/compare/filsnap-v0.1.0...filsnap-v0.1.1) (2023-07-13)


### Bug Fixes

* initial commit ([cf3479f](https://github.com/filecoin-project/filsnap/commit/cf3479fdd0af6dc1b23bfba9063b028f68fb3006))

## [0.1.0](https://github.com/filecoin-project/filsnap/compare/filsnap-v0.0.1...filsnap-v0.1.0) (2023-07-13)


### Features

* adapter and demo ([0f28428](https://github.com/filecoin-project/filsnap/commit/0f284288c27c9ead6504bc1c0f3bf2097e5c661e))
* automatic releases ([#137](https://github.com/filecoin-project/filsnap/issues/137)) ([20375f5](https://github.com/filecoin-project/filsnap/commit/20375f52d2712a59961a8c5708fa990b3a178dd2))
* demo and adapter ([1adf4eb](https://github.com/filecoin-project/filsnap/commit/1adf4eba5168f7f339a91447a06dbd0a857dd883))
* export required types from snap package ([4ab83cc](https://github.com/filecoin-project/filsnap/commit/4ab83cc360a0457095c6d070c976760ccd84efbe))
* improve export and sign raw popup ui ([1d4e54c](https://github.com/filecoin-project/filsnap/commit/1d4e54c4b151b3d4448baa038d82b68f06967e89))
* new build system and deps using iso-filecoin ([5ccf6a9](https://github.com/filecoin-project/filsnap/commit/5ccf6a9f2a4b00842b3a251cd141adc2f210a01d))
* revamp ([24c8c8c](https://github.com/filecoin-project/filsnap/commit/24c8c8ccbf3d616d9dc7725df479197f100c05ee))
* reworked demo with a few tweak to snap and adapter ([4a1a7ed](https://github.com/filecoin-project/filsnap/commit/4a1a7edfb81239f87ca2f01a0673cd8cb7ff354a))
* rpc, errors, validations and types ([2cb7e81](https://github.com/filecoin-project/filsnap/commit/2cb7e814dc2a48c3852f7472c93abbdab1179d3a))


### Bug Fixes

* adapter tests and snap icon and descriptions ([8944bd2](https://github.com/filecoin-project/filsnap/commit/8944bd2c60d6e4da4b66cb90525cac8c21584a02))
* adapter types ([494bd6a](https://github.com/filecoin-project/filsnap/commit/494bd6a492a178aa59f1632c35a814875075b8f8))
* add adapter ci ([#13](https://github.com/filecoin-project/filsnap/issues/13)) ([b8e1f28](https://github.com/filecoin-project/filsnap/commit/b8e1f28062ee6e573d62091f39f6eafe0d8f801d))
* add ci and simplify linter ([5062e6f](https://github.com/filecoin-project/filsnap/commit/5062e6f6ec5aae3aff4e3f27d6c00b4e1b598842))
* add snap compression and reduce number of files ([2b918a5](https://github.com/filecoin-project/filsnap/commit/2b918a50744bce27ed080f440ad164ab8c1d16b3))
* application/json header to work with Glif nodes ([#152](https://github.com/filecoin-project/filsnap/issues/152)) ([a92e389](https://github.com/filecoin-project/filsnap/commit/a92e389c01d753e2237ec7164916f22d130371c1))
* calibration net node api url ([#216](https://github.com/filecoin-project/filsnap/issues/216)) ([8f0d19d](https://github.com/filecoin-project/filsnap/commit/8f0d19dc75ff2df7a9bf3475fdb4280fdbd38996))
* change content type for filecoin rpc to json ([#150](https://github.com/filecoin-project/filsnap/issues/150)) ([68377eb](https://github.com/filecoin-project/filsnap/commit/68377ebe8541fe4da585fcd7311d574746362374))
* **deps:** update dependency @zondax/filecoin-signing-tools to ^0.20.0 ([#170](https://github.com/filecoin-project/filsnap/issues/170)) ([3a4b94e](https://github.com/filecoin-project/filsnap/commit/3a4b94e6f7982ffef97962da289b101514bb7ce4))
* fix mm-cli bundling and e2e tests ([5a5ee17](https://github.com/filecoin-project/filsnap/commit/5a5ee173cf0179120b2b5547ff85756a11ecaafa))
* flask 10.17 snap breaking change fix ([#206](https://github.com/filecoin-project/filsnap/issues/206)) ([5efed8a](https://github.com/filecoin-project/filsnap/commit/5efed8aafedd8babd94562dc8f24b9e7f62ec09e))
* flask1.25 ([#246](https://github.com/filecoin-project/filsnap/issues/246)) ([155e857](https://github.com/filecoin-project/filsnap/commit/155e857411545d204d95901ae25ee90534ca7fc9))
* gaslimit ([#254](https://github.com/filecoin-project/filsnap/issues/254)) ([067fce8](https://github.com/filecoin-project/filsnap/commit/067fce8c736b76a5d73e73a500fe1b1d1b00c7cd))
* message approval UI ([#146](https://github.com/filecoin-project/filsnap/issues/146)) ([8e6ce28](https://github.com/filecoin-project/filsnap/commit/8e6ce282f2895d96144cb0d7439011c37bc611b4))
* metamask version handling for key-tree ([#195](https://github.com/filecoin-project/filsnap/issues/195)) ([e618c7f](https://github.com/filecoin-project/filsnap/commit/e618c7f8b37101a12e090d2582ac4202a9e68c4e))
* MUI components fix ([#232](https://github.com/filecoin-project/filsnap/issues/232)) ([2d53064](https://github.com/filecoin-project/filsnap/commit/2d530641866bdc067087f5964a61b61f5d327e61))
* refactor deprecated `snap_getBip44Entropy_*` with `snap_getBip44Entropy` ([#223](https://github.com/filecoin-project/filsnap/issues/223)) ([efdb48e](https://github.com/filecoin-project/filsnap/commit/efdb48e7efc36d6a3ff1eae5b84c3725b1440d13))
* replace custom types with metamask types ([#214](https://github.com/filecoin-project/filsnap/issues/214)) ([5fd1801](https://github.com/filecoin-project/filsnap/commit/5fd18019d4045c3522786c7306a33d7bf07b0cc4))
* show falsy fields in `signMessage` prompt ([#154](https://github.com/filecoin-project/filsnap/issues/154)) ([1d29ef8](https://github.com/filecoin-project/filsnap/commit/1d29ef85abb05b7070b9d587bbba2f22cb701a7c))
* singMessage missing method parameter ([#139](https://github.com/filecoin-project/filsnap/issues/139)) ([1ad693c](https://github.com/filecoin-project/filsnap/commit/1ad693cc5add32761bff94be71ea477671c2f9b5))
* snap manifest ([#192](https://github.com/filecoin-project/filsnap/issues/192)) ([c80fd79](https://github.com/filecoin-project/filsnap/commit/c80fd79fb6d1145060c046377b9b45ea5b4f38b3))
* snap type imports ([3f9cdfd](https://github.com/filecoin-project/filsnap/commit/3f9cdfdf119f69aa7527f831fc454e07f21e8963))
* update key tree ([#186](https://github.com/filecoin-project/filsnap/issues/186)) ([c51c621](https://github.com/filecoin-project/filsnap/commit/c51c621dea0adfa755b424f22bbfa9d314f02f6d))
