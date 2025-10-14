import type { Snap } from '@metamask/snaps-sdk'
import type { Network } from 'filsnap/types'
import satisfies from 'semver/functions/satisfies.js'

import { metamask } from './chains.ts'
import type { EIP1193Provider, EIP6963AnnounceProviderEvent } from './types.ts'

/**
 * Get the Metamask provider.
 *
 * @param timeout - The timeout in milliseconds.
 * @returns The request provider.
 */
export async function getProvider(timeout = 1000): Promise<EIP1193Provider> {
  let timeoutHandle = 0
  return await new Promise((resolve, reject) => {
    const onProviderFound = (event: EIP6963AnnounceProviderEvent): void => {
      clearTimeout(timeoutHandle) // Clear the timeout on successful provider detection
      const { rdns } = event.detail.info
      switch (rdns) {
        case 'io.metamask':
        case 'io.metamask.flask':
        case 'io.metamask.mmi': {
          const provider = event.detail.provider
          if (!provider || !provider.isMetaMask) {
            reject(new Error('Provider not supported or not found.'))
          } else {
            window.removeEventListener(
              'eip6963:announceProvider',
              onProviderFound
            )
            resolve(provider)
          }
          break
        }
        default: {
          // console.error('Provider not supported or not found.', rdns)
          // reject(new Error('Provider not supported or not found.'))
          break
        }
      }
    }

    window.addEventListener(
      'eip6963:announceProvider',
      onProviderFound as EventListener
    )

    window.dispatchEvent(new CustomEvent('eip6963:requestProvider'))
    // Set a timeout to reject the promise if no provider is found within the specified time
    timeoutHandle = window.setTimeout(() => {
      window.removeEventListener('eip6963:announceProvider', onProviderFound)
      reject(new Error('Provider request timed out.'))
    }, timeout)
  })
}

/**
 * Converts a Chain ID to Filecoin Network
 *
 * @param chainId
 * @returns  Returns mainnet, testnet or undefined if not a filecoin chain
 */
export function chainIdtoNetwork(chainId: string): Network | undefined {
  return chainId === metamask.testnet.chainId
    ? 'testnet'
    : chainId === metamask.mainnet.chainId
      ? 'mainnet'
      : undefined
}

/**
 * Get or install a snap
 *
 * @param provider - The provider to get the snap from
 * @param snapId - The snap ID to get
 * @param snapVersion - The snap version to get
 */
export async function getOrInstallSnap(
  provider: EIP1193Provider,
  snapId = 'npm:filsnap',
  snapVersion = '*',
  forceInstall = false
): Promise<Snap> {
  const snap = await getSnap(provider, snapId, snapVersion)

  // try to install the snap
  if (snap == null || forceInstall) {
    try {
      const snaps = await provider.request({
        method: 'wallet_requestSnaps',
        params: {
          [snapId]: {
            version: snapVersion,
          },
        },
      })
      const snap = snaps[snapId]
      if (snap == null) {
        throw new Error(`Failed to install to snap ${snapId} ${snapVersion}`)
      }

      if ('error' in snap) {
        throw new Error(
          `Failed to install to snap ${snapId} ${snapVersion} with error "${snap.error.message}"`
        )
      }
      return snap
    } catch (error) {
      const err = error as Error
      throw new Error(
        `Failed to install to snap ${snapId} ${snapVersion} with error "${err.message}"`
      )
    }
  }

  return snap
}

/**
 * Get a snap
 *
 * @param provider - The provider to get the snap from
 * @param snapId - Snap ID to check for. Defaults to `npm:filsnap`.
 * @param snapVersion - Snap version to check for. Defaults to `*` which matches any version.
 */
export async function getSnap(
  provider: EIP1193Provider,
  snapId = 'npm:filsnap',
  snapVersion = '*'
): Promise<Snap | undefined> {
  const snaps = await provider.request({ method: 'wallet_getSnaps' })

  const snap = snaps[snapId]

  if (snap == null) {
    return undefined
  }

  if ('error' in snap) {
    throw new Error(
      `Failed to connect to snap ${snapId} ${snapVersion} with error ${snap.error.message}`
    )
  }

  if (snap.blocked === true) {
    throw new Error(`Snap ${snapId} ${snapVersion} is blocked`)
  }

  if (snap.enabled === false) {
    throw new Error(`Snap ${snapId} ${snapVersion} is not enabled`)
  }

  if (!satisfies(snap.version, snapVersion)) {
    return undefined
  }

  return snap
}

/**
 * Check if Metamask has Snaps API
 *
 * @param provider - The provider to check for snaps
 */
export async function hasSnaps(provider: EIP1193Provider): Promise<boolean> {
  try {
    await provider.request({ method: 'wallet_getSnaps' })
    return true
  } catch {
    return false
  }
}

/**
 * Check if a snap is connected, enabled and not blocked
 *
 * @param provider - The provider to check for snaps
 * @param snapId - Snap ID to check for. Defaults to `npm:filsnap`.
 * @param snapVersion - Snap version to check for. Defaults to `*` which matches any version.
 */
export async function isConnected(
  provider: EIP1193Provider,
  snapId = 'npm:filsnap',
  snapVersion = '*'
): Promise<boolean> {
  try {
    const snap = await getSnap(provider, snapId, snapVersion)

    if (snap == null) {
      return false
    }

    return true
  } catch {
    return false
  }
}

export async function checkPermissions(
  provider: EIP1193Provider
): Promise<{ snap: boolean; wallet: boolean }> {
  try {
    const perms = await provider.request({
      method: 'wallet_getPermissions',
    })
    if (perms.length === 0) {
      return {
        snap: false,
        wallet: false,
      }
    }

    let wallet = false
    let snap = false

    if (perms.length > 0) {
      for (const element of perms) {
        if (element.parentCapability === 'wallet_snap') {
          const hasFilsnap = element.caveats.some(
            (caveat) => caveat.value['npm:filsnap']
          )
          if (hasFilsnap) {
            snap = true
          }
        }

        if (element.parentCapability === 'eth_accounts') {
          wallet = true
        }
      }
    }

    return { snap, wallet }
  } catch {
    return {
      snap: false,
      wallet: false,
    }
  }
}
