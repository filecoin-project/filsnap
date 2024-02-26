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
    const timeoutHandle = window.setTimeout(() => {
      window.removeEventListener(
        'eip6963:announceProvider',
        onProviderFound as EventListener
      )
      reject(new Error('Provider request timed out.'))
    }, timeout)
  })
}
