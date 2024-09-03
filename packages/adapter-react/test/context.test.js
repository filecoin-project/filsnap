import assert from 'assert'
import { cleanup, renderHook, waitFor } from '@testing-library/react'
import { FilsnapProvider, useFilsnap } from '../src/index.js'

beforeEach(() => {
  cleanup()
})
// @ts-ignore
const wrapper = ({ children }) => FilsnapProvider({ children })

it('should return the initial context', async () => {
  const { result } = renderHook(() => useFilsnap(), { wrapper })

  assert.strictEqual(result.current.isLoading, true)
})

it('should stop loading', async () => {
  const { result } = renderHook(() => useFilsnap(), {
    wrapper,
  })

  await waitFor(
    () => {
      assert.strictEqual(result.current.isLoading, false)
    },
    { timeout: 2000 }
  )
})

it('should still be stopped after rerender', async () => {
  const { result, rerender } = renderHook(() => useFilsnap(), {
    wrapper,
  })

  await waitFor(
    () => {
      assert.strictEqual(result.current.isLoading, false)
    },
    { timeout: 2000 }
  )

  rerender()

  assert.strictEqual(result.current.isLoading, false)
})
