import { renderHook, waitFor, cleanup } from '@testing-library/react'
import assert from 'assert'
import { useFilsnap, FilsnapProvider } from '../src/index.js'

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

  await waitFor(() => {
    assert.strictEqual(result.current.isLoading, false)
    assert.strictEqual(result.current.hasFlask, false)
  })
})

it('should still be stopped after rerender', async () => {
  const { result, rerender } = renderHook(() => useFilsnap(), {
    wrapper,
  })

  await waitFor(() => {
    assert.strictEqual(result.current.isLoading, false)
    assert.strictEqual(result.current.hasFlask, false)
  })

  rerender()

  assert.strictEqual(result.current.isLoading, false)
  assert.strictEqual(result.current.hasFlask, false)
})
