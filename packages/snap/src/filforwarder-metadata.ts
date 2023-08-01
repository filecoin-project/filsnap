const abi = [
  {
    inputs: [
      {
        internalType: 'int256',
        name: 'errorCode',
        type: 'int256',
      },
    ],
    name: 'ActorError',
    type: 'error',
  },
  {
    inputs: [],
    name: 'FailToCallActor',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'addr',
        type: 'bytes',
      },
    ],
    name: 'InvalidAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidAddress',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint64',
        name: '',
        type: 'uint64',
      },
    ],
    name: 'InvalidCodec',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidResponseLength',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'NotEnoughBalance',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'destination',
        type: 'bytes',
      },
    ],
    name: 'forward',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
]

const contractAddress: `0x${string}` =
  '0x2B3ef6906429b580b7b2080de5CA893BC282c225'

const chainIds = {
  filecoinMainnet: 'eip155:13a',
  filecoinCalibrationTestnet: 'eip155:4cb2f',
}

// FEVM FilForwarder contract metadata
// Contract source: https://github.com/FILCAT/FilForwarder
export const filForwarderMetadata = {
  abi,
  // The contract address is the same on all chains where the contract is deployed
  contractAddress,
  // The CAIP-2 chain ids where the contract is deployed
  chainIds,
}
