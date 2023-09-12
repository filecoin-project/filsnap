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
}
