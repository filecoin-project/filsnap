import { renderHook } from '@testing-library/react-hooks/dom'
import assert from 'assert'
import { useFilsnap, FilsnapProvider } from '../src/index.js'

// @ts-ignore
const wrapper = ({ children }) => FilsnapProvider({ children })
it('should return the initial context', async () => {
  const { result } = renderHook(() => useFilsnap(), { wrapper })

  assert.strictEqual(result.current.isLoading, true)
})

it('should stop loading', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useFilsnap(), {
    wrapper,
  })

  await waitForNextUpdate()

  assert.strictEqual(result.current.isLoading, false)
  assert.strictEqual(result.current.hasFlask, false)
})

it('should still be stoped after rerender', async () => {
  const { result, waitForNextUpdate, rerender } = renderHook(
    () => useFilsnap(),
    {
      wrapper,
    }
  )

  await waitForNextUpdate()

  rerender()

  assert.strictEqual(result.current.isLoading, false)
  assert.strictEqual(result.current.hasFlask, false)
})
