import type { MessageRequest, SignedMessage, SnapConfig } from '../types'

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export interface ConfigureRequest {
  configuration: WithRequired<SnapConfig, 'network'>
}

export function isValidConfigureRequest(
  params: unknown
): asserts params is ConfigureRequest {
  if (
    !(
      params != null &&
      typeof params === 'object' &&
      'configuration' in params &&
      // @ts-expect-error - validation
      'network' in params.configuration
    )
  ) {
    throw new Error('Invalid configure request')
  }
}

export function isValidSignRequest(
  params: unknown
): asserts params is { message: MessageRequest } {
  if (
    !(
      params != null &&
      typeof params === 'object' &&
      'message' in params &&
      // @ts-expect-error - validation
      'to' in params.message &&
      'value' in params.message
    )
  ) {
    throw new Error('Invalid sign request')
  }
}

export function isValidSendRequest(
  params: unknown
): asserts params is { signedMessage: SignedMessage } {
  if (
    !(
      params != null &&
      typeof params === 'object' &&
      'signedMessage' in params &&
      // @ts-expect-error - validation
      'message' in params.signedMessage &&
      'signature' in params.signedMessage
    )
  ) {
    throw new Error('Invalid send request')
  }
}

export function isValidEstimateGasRequest(
  params: unknown
): asserts params is { message: MessageRequest; maxFee?: string } {
  if (
    !(
      params != null &&
      typeof params === 'object' &&
      'message' in params &&
      // @ts-expect-error - validation
      'to' in params.message &&
      'value' in params.message
    )
  ) {
    throw new Error('Invalid send request')
  }
}
