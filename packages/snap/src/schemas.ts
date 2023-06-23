import { z } from 'zod'
import { Schemas } from 'iso-filecoin/message'
import type { Json } from './types'

const unitConfiguration = z.object({
  decimals: z.number(),
  symbol: z.string(),
  image: z.string().optional(),
  customViewUrl: z.string().optional(),
})

export const network = z.enum(['mainnet', 'testnet'])

export const snapConfig = z.object({
  derivationPath: z.string(),
  rpc: z.object({
    url: z.string(),
    token: z.string(),
  }),
  network,
  unit: unitConfiguration.optional(),
})

export const messageStatus = z.object({
  cid: z.string(),
  message: Schemas.message,
})

export const metamaskState = z.object({
  filecoin: z.object({
    config: snapConfig,
    messages: z.array(messageStatus),
  }),
})

export const literal = z.union([z.string(), z.number(), z.boolean(), z.null()])

export const json: z.ZodType<Json> = z.lazy(() =>
  z.union([literal, z.array(json), z.record(json)])
)
