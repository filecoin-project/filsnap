import { z } from 'zod'

const unitConfiguration = z.object({
  decimals: z.number(),
  symbol: z.string(),
  image: z.string().optional(),
  customViewUrl: z.string().optional(),
})

export const network = z.enum(['f', 't'])
export type Network = z.infer<typeof network>

export const snapConfig = z.object({
  derivationPath: z.string(),
  rpc: z.object({
    url: z.string(),
    token: z.string(),
  }),
  network,
  unit: unitConfiguration.optional(),
})
export type SnapConfig = z.infer<typeof snapConfig>

export const message = z.object({
  from: z.string(),
  gasfeecap: z.string(),
  gaslimit: z.number(),
  gaspremium: z.string(),
  method: z.number(),
  nonce: z.number(),
  params: z.string().optional(),
  to: z.string(),
  value: z.string(),
})
export type Message = z.infer<typeof message>

export const messageStatus = z.object({
  cid: z.string(),
  message,
})

export type MessageStatus = z.infer<typeof messageStatus>

export const metamaskState = z.object({
  filecoin: z.object({
    config: snapConfig,
    messages: z.array(messageStatus),
  }),
})

export type MetamaskState = z.infer<typeof metamaskState>
