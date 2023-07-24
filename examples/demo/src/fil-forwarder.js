export const abi = /** @type {const} */ ([
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
])
