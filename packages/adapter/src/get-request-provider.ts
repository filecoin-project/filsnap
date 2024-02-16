import type { RequestWithFilSnap } from 'filsnap'

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
  // timeout in milliseconds
  return await new Promise((resolve, reject) => {
    // eslint-disable-next-line prefer-const
    let timeoutHandle: number

    const onProviderFound = (event: ProviderDetailEvent): void => {
      clearTimeout(timeoutHandle) // Clear the timeout on successful provider detection
      const { rdns } = event.detail.info
      switch (rdns) {
        case 'io.metamask':
        case 'io.metamask.flask':
        case 'io.metamask.mmi': {
          resolve(event.detail.provider)
          break
        }
        default: {
          console.error('Provider not supported or not found.', rdns)
          break
        }
      }
    }

    window.addEventListener('eip6963:announceProvider', onProviderFound)

    window.dispatchEvent(new Event('eip6963:requestProvider'))
    // Set a timeout to reject the promise if no provider is found within the specified time
    timeoutHandle = window.setTimeout(() => {
      window.removeEventListener('eip6963:announceProvider', onProviderFound) // Clean up event listener
      reject(new Error('Provider request timed out.'))
    }, timeout)
  })
}
