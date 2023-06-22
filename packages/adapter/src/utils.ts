/**
 * Check if MetaMask is installed
 *
 * @returns boolean
 */
export function hasMetaMask(): boolean {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!window.ethereum) {
    return false
  }
  return window.ethereum.isMetaMask
}

export type GetSnapsResponse = Record<
  string,
  {
    permissionName?: string
    id?: string
    version?: string
    initialPermissions?: Record<string, unknown>
  }
>

/**
 * Get wallet snaps
 *
 * @returns walletSnaps
 */
async function getWalletSnaps(): Promise<GetSnapsResponse> {
  return window.ethereum.request({
    method: 'wallet_getSnaps',
  })
}

/**
 * Check is MetaMask snaps are supported
 *
 * @returns boolean
 */
export async function isMetamaskSnapsSupported(): Promise<boolean> {
  try {
    await getWalletSnaps()
    return true
  } catch {
    return false
  }
}

/**
 * Check if this snap is installed
 *
 * @param snapOrigin
 * @param version
 * @returns
 */
export async function isSnapInstalled(
  snapOrigin: string,
  version?: string
): Promise<boolean> {
  try {
    const walletSnaps = await getWalletSnaps()
    // eslint-disable-next-line no-console
    console.log('walletSnaps', walletSnaps)
    const snap = Object.values(walletSnaps).find(
      (permission) =>
        permission.id === snapOrigin &&
        (version === undefined || permission.version === version)
    )
    return Boolean(snap)
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to obtain installed snaps', error)
    return false
  }
}
