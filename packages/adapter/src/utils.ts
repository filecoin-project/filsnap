import type { RequestWithFilSnap, Snap } from 'filsnap'

export interface Provider {
  isMetaMask: boolean
  request: RequestWithFilSnap
}

interface ProviderDetailEvent extends Event {
  detail: {
    provider: Provider
    info: {
      rdns: string
    }
  }
}

/**
 * Get the request provider.
 *
 * @param timeout - The timeout in milliseconds.
 * @returns The request provider.
 */
export async function getRequestProvider(timeout = 1000): Promise<Provider> {
  let timeoutHandle = 0
  return await new Promise((resolve, reject) => {
    const onProviderFound = (event: Event): void => {
      // Assert the event type to ProviderDetailEvent
      const customEvent = event as ProviderDetailEvent
      clearTimeout(timeoutHandle) // Clear the timeout on successful provider detection
      const { rdns } = customEvent.detail.info
      switch (rdns) {
        case 'io.metamask':
        case 'io.metamask.flask':
        case 'io.metamask.mmi': {
          resolve(customEvent.detail.provider)
          break
        }
        default: {
          console.error('Provider not supported or not found.', rdns)
          break
        }
      }
    }

    window.addEventListener(
      'eip6963:announceProvider',
      onProviderFound as EventListener
    )

    window.dispatchEvent(new Event('eip6963:requestProvider'))
    // Set a timeout to reject the promise if no provider is found within the specified time
    timeoutHandle = window.setTimeout(() => {
      window.removeEventListener(
        'eip6963:announceProvider',
        onProviderFound as EventListener
      )
      reject(new Error('Provider request timed out.'))
    }, timeout)
  })
}

export async function getSnap(
  provider: Provider,
  snapId = 'npm:filsnap',
  snapVersion = '*'
): Promise<Snap> {
  const snaps = await provider.request({ method: 'wallet_getSnaps' })

  const snap = snaps[snapId]

  // try to install the snap
  if (snap == null) {
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
          `Failed to install to snap ${snapId} ${snapVersion} with error ${snap.error.message}`
        )
      }
      return snap
    } catch (error) {
      const err = error as Error
      throw new Error(
        `Failed to install to snap ${snapId} ${snapVersion} with error ${err.message}`
      )
    }
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

  // if (snapVersion !== '*' && snap.version !== snapVersion) {
  //   throw new Error(`Snap ${snapId} ${snapVersion} is not the correct version`)
  // }

  return snap
}
