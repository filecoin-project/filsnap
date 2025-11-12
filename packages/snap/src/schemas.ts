import { Schemas } from 'iso-filecoin/message'
import { parseDerivationPath } from 'iso-filecoin/utils'
import { z } from 'zod'
import type { Network } from './types.ts'

const alphabet =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=+/'
// Build the character lookup table:
const codes = new Map<string, number>()
for (let i = 0; i < alphabet.length; ++i) {
  codes.set(alphabet[i], i)
}

const unitConfiguration = z.object({
  decimals: z.number().positive().int().lte(18),
  symbol: z.enum(['FIL', 'tFIL']),
})

export const network: z.ZodType<Network> = z.enum(['mainnet', 'testnet'])

export const config = z.object({
  /**
   * RPC URL to be used must be a valid URL and match the network
   */
  rpcUrl: z.url().trim().optional(),
  /**
   * Bearer token used to make authenticated requests to the RPC URL
   */
  rpcToken: z.string().trim().optional(),
  /**
   * Network to be used
   *
   * @default mainnet
   */
  network: network,
  /**
   * Derivation path address index
   */
  index: z.number().nonnegative().int().default(0).optional(),
  /**
   * Symbol of the token to be used in the UI
   */
  symbol: z.enum(['FIL', 'tFIL']).optional(),
  /**
   * Number of decimals of the token to be used in the UI
   */
  decimals: z.number().positive().int().lte(18).optional(),
})

export const snapConfig = z.object({
  /**
   * The derivation path for the account
   */
  derivationPath: z.string().check((ctx) => {
    try {
      const val = ctx.value
      parseDerivationPath(val)
    } catch (error) {
      const err = error as Error
      ctx.issues.push({
        code: 'custom',
        message: err.message,
        input: ctx.value,
      })
    }
  }),
  rpc: z.object({
    url: z.url().trim(),
    token: z
      .string()
      .trim()
      .refine(
        (val) => {
          for (const element of val) {
            if (codes.get(element) === undefined) {
              return false
            }
          }

          return true
        },
        { message: 'Invalid characters' }
      ),
  }),
  network,
  unit: unitConfiguration.optional(),
  derivationMode: z.enum(['native', 'ledger']),
})

export const messageStatus = z.object({
  cid: z.string(),
  message: Schemas.message,
})

export const literal = z.union([z.string(), z.number(), z.boolean(), z.null()])

export const json = z.json()
