import { filForwarderMetadata, getRequestProvider } from 'filsnap-adapter'
import * as Address from 'iso-filecoin/address'
import { PROTOCOL_INDICATOR } from 'iso-filecoin/address'
import { Token } from 'iso-filecoin/token'
import {
  http,
  createPublicClient,
  createWalletClient,
  custom,
  getContract,
} from 'viem'
import { filecoinCalibration } from 'viem/chains'

/**
 * Transfer FIL from a 0x address to an f1/t1 address.
 *
 * @param recipient - The recipient's address.
 * @param amount - The amount of FIL to transfer.
 * @returns The FEVM transaction hash of the transfer.
 */
async function transfer(
  recipient: Address.IAddress,
  amount: Token
): Promise<`0x${string}`> {
  if (recipient.protocol !== PROTOCOL_INDICATOR.SECP256K1) {
    throw new Error('Recipient must be an f1/t1 address')
  }
  if (recipient.network !== 'testnet') {
    throw new Error('Recipient must be a testnet address')
  }

  const provider = await getRequestProvider()

  // RPC client for requests that needs to be signed
  const metaMaskClient = createWalletClient({
    chain: filecoinCalibration,
    transport: custom(provider),
  })
  // RPC client for requests that that doesn't need signing
  const publicClient = createPublicClient({
    chain: filecoinCalibration,
    transport: http(),
  })

  // Prompts user to connect MetaMask
  const [address] = await metaMaskClient.requestAddresses()

  // Initialize the FilForwarder contract
  const contract = getContract({
    address: filForwarderMetadata.contractAddress,
    abi: filForwarderMetadata.abi,
    client: publicClient,
    // walletClient: metaMaskClient,
  })

  // Call the FilForwarder contract's forward method to make the transfer
  return await contract.write.forward([recipient.toContractDestination()], {
    value: amount.toBigInt(),
    account: address,
  })
}

/**
 * Get the explorer URL for a transaction hash.
 * Assumes FEVM Calibration test net.
 *
 * @param txHash - The recipient's address.
 * @returns The explorer URL for the transaction.
 */
function txHashToExplorerUrl(txHash: `0x${string}`): string {
  return `https://calibration.filfox.info/en/message/${txHash}`
}

interface FormElements extends HTMLFormControlsCollection {
  amount: HTMLInputElement
  recipient: HTMLInputElement
}

const form = document.querySelector('#transfer-form') as HTMLFormElement
const txLink = document.querySelector('#tx-link') as HTMLAnchorElement
const submitButton = document.querySelector(
  '#submit-button'
) as HTMLButtonElement

form?.addEventListener('submit', (event) => {
  // Prevent navigation on submit
  event.preventDefault()

  const elements = form?.elements as FormElements

  // Get the amount to transfer from the form and parse it

  let recipient: Address.IAddress
  try {
    recipient = Address.from(elements.recipient.value)
  } catch (error) {
    console.error(error)
    alert('Invalid recipient')
    return
  }

  // Get the amount to transfer from the form and parse it
  let amount: Token
  try {
    amount = Token.fromFIL(elements.amount.value)
  } catch (error) {
    console.error(error)
    alert('Invalid amount')
    return
  }

  // Make the transfer
  submitButton.disabled = true
  transfer(recipient, amount)
    .then((txHash) => {
      // Insert an anchor tag with the transaction hash
      const txHashAnchor = document.createElement('a')
      txHashAnchor.href = txHashToExplorerUrl(txHash)
      txHashAnchor.textContent = 'View transaction in explorer'
      txHashAnchor.target = '_blank'
      // Remove the previous transaction hash anchor
      txLink.innerHTML = ''
      // Insert the new transaction hash anchor
      txLink.append(txHashAnchor)
    })
    .catch((error) => {
      console.error(error)
      alert('Transfer failed')
    })
    .finally(() => {
      submitButton.disabled = false
    })
})
