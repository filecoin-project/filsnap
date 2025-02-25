import { Schemas } from 'iso-filecoin/message'
import { parseDerivationPath } from 'iso-filecoin/utils'
import { z } from 'zod'
import type { Json, Network } from './types'

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
  rpcUrl: z.string().url().trim(),
  /**
   * Bearer token used to make authenticated requests to the RPC URL
   */
  rpcToken: z.string().trim(),
  /**
   * Network to be used
   *
   * @default mainnet
   */
  network: network,
  /**
   * Derivation path address index
   */
  index: z.number().nonnegative().int().safe(),
  /**
   * Symbol of the token to be used in the UI
   */
  symbol: z.enum(['FIL', 'tFIL']),
  /**
   * Number of decimals of the token to be used in the UI
   */
  decimals: z.number().positive().int().lte(18),
})

export const snapConfig = z.object({
  /**
   * The derivation path for the account
   */
  derivationPath: z.string().superRefine((val, ctx) => {
    try {
      const parsed = parseDerivationPath(val)
      return parsed
    } catch (error) {
      const err = error as Error
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: err.message,
      })
      return z.NEVER
    }
  }),
  rpc: z.object({
    url: z.string().url().trim(),
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
})

export const messageStatus = z.object({
  cid: z.string(),
  message: Schemas.message,
})

export const literal = z.union([z.string(), z.number(), z.boolean(), z.null()])

export const json: z.ZodType<Json> = z.lazy(() =>
  z.union([literal, z.array(json), z.record(json)])
)
