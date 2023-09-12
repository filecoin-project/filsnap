import type { SnapsGlobalObject } from '@metamask/snaps-types'
import type { SnapConfig } from './types'

export class State {
  snap: SnapsGlobalObject

  constructor(snap: SnapsGlobalObject) {
    this.snap = snap
  }

  async get(origin: string): Promise<SnapConfig | undefined> {
    const state = (await this.snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    })) as unknown as Record<string, SnapConfig> | null

    if (state == null) {
      return undefined
    }

    return state[origin]
  }

  async set(origin: string, config: SnapConfig): Promise<SnapConfig> {
    const state = (await this.snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    })) as unknown as Record<string, SnapConfig> | null

    await this.snap.request({
      method: 'snap_manageState',
      params: {
        newState:
          state == null ? { [origin]: config } : { ...state, [origin]: config },
        operation: 'update',
      },
    })

    return config
  }

  async delete(origin: string): Promise<boolean> {
    const state = (await this.snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    })) as unknown as Record<string, SnapConfig> | null

    if (state == null || state[origin] == null) {
      return false
    }

    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete state[origin]
    await this.snap.request({
      method: 'snap_manageState',
      params: {
        newState: state,
        operation: 'update',
      },
    })

    return true
  }

  async has(origin: string): Promise<boolean> {
    const state = (await this.snap.request({
      method: 'snap_manageState',
      params: { operation: 'get' },
    })) as unknown as Record<string, SnapConfig> | null

    if (state == null || state[origin] == null) {
      return false
    }

    return true
  }
}
