import {
  Address,
  Bold,
  Box,
  Card,
  Copyable,
  Divider,
  Field,
  Form,
  Input,
  Link,
  Row,
  Section,
  Selector,
  SelectorOption,
  type SnapComponent,
  Text,
  Tooltip,
} from '@metamask/snaps-sdk/jsx'
import * as FilAddress from 'iso-filecoin/address'
import * as Chains from 'iso-filecoin/chains'
import { Message } from 'iso-filecoin/message'
import { RPC } from 'iso-filecoin/rpc'
import { Token } from 'iso-filecoin/token'
import { signMessage as filSignMessage } from 'iso-filecoin/wallet'
import type { Jsonify } from 'type-fest'
import { z } from 'zod'
import { getAccountWithPrivateKey } from '../account'
import iconFilecoin from '../svg/filecoin-logo.svg'
import type { HomepageContext, MessageObj, SnapConfig } from '../types'
import {
  addressToCaip10,
  explorerAddressLink,
  formatFIL,
  formatFILShort,
} from '../utils'

import * as Icons from '../svg'
import iconSettings from '../svg/settings.svg'
import iconArrowUpRight from '../svg/square-arrow-up-right.svg'
import { ButtonIcon } from './button-icon'
import { ButtonSvgIcon } from './button-svg-icon'
import { updateWithError } from './error'
import { Footer } from './footer'
import { Header, ListHeader } from './header'
import { HomepageEvents } from './homepage'
import { updateWithProgress } from './progress'
import { Spacer } from './spacer'
import { SvgIcon } from './svg-icon'

type SendReviewProps = {
  account: string
  message: Jsonify<Message>
  config: SnapConfig
  showTitle?: boolean
}

export const SendReview: SnapComponent<SendReviewProps> = ({
  account,
  message,
  config,
  showTitle = true,
}) => {
  const gas = Token.fromAttoFIL(message.gasPremium).mul(message.gasLimit)
  const total = Token.fromAttoFIL(message.value).add(gas)
  const toAddress = FilAddress.from(message.to, config.network)
  return (
    <Section>
      {showTitle && (
        <Box direction="horizontal" alignment="center">
          <Text color="alternative">
            This site is requesting a signature for:
          </Text>
        </Box>
      )}
      <Box direction="horizontal">
        <SvgIcon icon={iconArrowUpRight} color="alternative" />
        <Tooltip content="Transaction to sign">
          <Text color="default">
            <Bold>Transaction</Bold>
          </Text>
        </Tooltip>
      </Box>
      <Row label="From" tooltip={`Send FIL from Account ${account}`}>
        <Link href={explorerAddressLink(message.from, config.network)}>
          <Address address={addressToCaip10(message.from)} />
        </Link>
      </Row>
      <Row label="To" tooltip="Recipient address in robust format">
        <Link href={explorerAddressLink(message.to, config.network)}>
          <Address address={addressToCaip10(message.to)} />
        </Link>
      </Row>
      {FilAddress.isAddressDelegated(toAddress) && (
        <Row label="To ETH" tooltip="Recipient address in ethereum format">
          <Link
            href={explorerAddressLink(toAddress.toEthAddress(), config.network)}
          >
            <Address address={addressToCaip10(toAddress.toEthAddress())} />
          </Link>
        </Row>
      )}
      <Row label="Amount" tooltip="Amount of FIL to send">
        <Text>{formatFIL(message.value, config)}</Text>
      </Row>
      <Spacer unit={1} />
      <Divider />
      <Spacer unit={1} />
      <Box direction="horizontal">
        <SvgIcon icon={iconSettings} color="alternative" />
        <Tooltip content="Transaction details">
          <Text color="default">
            <Bold>Details</Bold>
          </Text>
        </Tooltip>
      </Box>
      <Row label="Gas" tooltip="Estimated gas">
        <Text color="alternative">{formatFIL(gas, config)}</Text>
      </Row>
      <Row label="Total" tooltip="Estimated total (amount + gas)">
        <Text color="alternative">{formatFIL(total, config)}</Text>
      </Row>
      <Row label="API">
        <Text color="alternative"> {config.rpc.url}</Text>
      </Row>
      <Row label="Network">
        <Text color="alternative"> {Chains[config.network].name}</Text>
      </Row>
    </Section>
  )
}

interface SendFormErrors {
  to?: string[]
  amount?: string[]
  from?: string[]
}

/**
 * On send event handler for the homepage
 */
export async function onSend(
  id: string,
  context: HomepageContext,
  errors: SendFormErrors = {}
) {
  const { config, account, address, balance } = context

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      context,
      ui: (
        <Box>
          <Header icon={Icons.send} iconSize={24} alignment="center">
            Send ⨎
          </Header>
          <Form name="sendForm">
            <Section>
              <Field label="From" error={errors.from?.join(', ')}>
                <Selector name="from" title="Select an account">
                  <SelectorOption value={`${address}:${account}`}>
                    <Card
                      image={iconFilecoin}
                      title={
                        <Address
                          address={addressToCaip10(address)}
                          avatar={false}
                        />
                      }
                      description={`Account ${account}`}
                      value={formatFILShort(balance, config)}
                    />
                  </SelectorOption>
                </Selector>
              </Field>
              <Field label="To" error={errors.to?.join(', ')}>
                <Input
                  name="to"
                  placeholder="f0, f1, f2, f3, f4 or 0x address"
                  type="text"
                />
              </Field>
              <Field label="Amount" error={errors.amount?.join(', ')}>
                <Input name="amount" placeholder="FIL" type="number" />
              </Field>
            </Section>
            <Spacer unit={1} />
            <Footer>
              <ButtonSvgIcon
                icon={Icons.chevronLeft}
                name={HomepageEvents.back}
              >
                Back
              </ButtonSvgIcon>
              <ButtonSvgIcon
                icon={Icons.chevronRight}
                type="submit"
                name={HomepageEvents.sendConfirm}
              >
                Continue
              </ButtonSvgIcon>
            </Footer>
          </Form>
        </Box>
      ),
    },
  })
}

/**
 * Send form validation
 */
function validateSendForm(form: unknown, context: HomepageContext) {
  const schema = z.object({
    to: z
      .string({
        error: (issue) =>
          issue.input === undefined
            ? 'Recipient address is required'
            : 'Invalid recipient address',
      })
      .trim()
      .check((ctx) => {
        const v = ctx.value
        if (v.startsWith('f') && context.config.network === 'testnet') {
          ctx.issues.push({
            code: 'custom',
            message: 'Recipient address is invalid for testnet',
            input: ctx.value,
          })
        }

        if (v.startsWith('t') && context.config.network === 'mainnet') {
          ctx.issues.push({
            code: 'custom',
            message: 'Recipient address is invalid for mainnet',
            input: ctx.value,
          })
        }

        try {
          FilAddress.from(v, context.config.network)
        } catch {
          ctx.issues.push({
            code: 'custom',
            message:
              'Recipient address could not be parsed into a valid address',
            input: ctx.value,
          })
        }
      }),
    amount: z
      .string({
        error: (issue) =>
          issue.input === undefined ? 'Amount is required' : 'Invalid amount',
      })
      .trim()
      .check((ctx) => {
        const v = ctx.value
        const amount = Token.fromFIL(v)

        if (!amount.val.gt(Token.fromFIL('0').val)) {
          ctx.issues.push({
            code: 'custom',
            message: 'Amount must be greater than 0',
            input: ctx.value,
          })
        }

        if (!amount.val.lte(Token.fromAttoFIL(context.balance).val)) {
          ctx.issues.push({
            code: 'custom',
            message: 'Insufficient balance',
            input: ctx.value,
          })
        }
      }),
    from: z.string().min(1),
  })

  return schema.safeParse(form)
}

/**
 * Send confirmation handler
 */
export async function onSendConfirm(id: string, context: HomepageContext) {
  // Get form state
  const state1 = await snap.request({
    method: 'snap_getInterfaceState',
    params: {
      id,
    },
  })

  // Validate form
  const formData = validateSendForm(state1.sendForm, context)
  if (!formData.success) {
    return onSend(id, context, formData.error.flatten().fieldErrors)
  }

  const { config } = context
  const [fromAddress, fromAccount] = formData.data.from.split(':')
  const { amount, to } = formData.data

  await updateWithProgress(id, context)
  const rpc = new RPC({
    api: config.rpc.url,
    network: config.network,
  })

  // Prepare message
  const msg = await new Message({
    to: FilAddress.from(to, config.network).toString(),
    from: fromAddress,
    value: Token.fromFIL(amount).toAttoFIL().toString(),
  }).prepare(rpc)

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      context: {
        ...context,
        sendMessage: msg as MessageObj,
      },
      ui: (
        <Box>
          <Header icon={Icons.eye} iconSize={24} alignment="center">
            Transaction Review
          </Header>
          <SendReview
            account={fromAccount}
            config={config}
            message={msg}
            showTitle={false}
          />

          <Footer>
            <ButtonSvgIcon icon={Icons.x} name={HomepageEvents.backToSend}>
              Reject
            </ButtonSvgIcon>
            <ButtonSvgIcon icon={Icons.check} name={HomepageEvents.sendResult}>
              Approve
            </ButtonSvgIcon>
          </Footer>
        </Box>
      ),
    },
  })
}

/**
 * Send result handler
 */
export async function onSendResult(id: string, context: HomepageContext) {
  const { config } = context
  const rpc = new RPC({
    api: config.rpc.url,
    network: config.network,
  })

  if (!context.sendMessage) {
    return updateWithError(id, context, {
      name: 'Internal Error',
      message: 'No message to send',
      back: HomepageEvents.backToSend,
    })
  }

  await updateWithProgress(id, context)

  const message = new Message(context.sendMessage)
  const account = await getAccountWithPrivateKey(snap, config)
  const sig = filSignMessage(account.privateKey, 'SECP256K1', message)
  const msgPush = await rpc.pushMessage({
    msg: message,
    signature: sig,
  })

  if (msgPush.error) {
    return updateWithError(id, context, {
      name: 'RPC Error',
      message: msgPush.error.message,
      back: HomepageEvents.backToSend,
    })
  }

  const cid = msgPush.result['/']

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      context,
      ui: (
        <Box>
          <Header
            icon={Icons.partyPopper}
            iconSize={24}
            iconColor="success"
            alignment="center"
          >
            Transaction Sent
          </Header>
          <Section>
            <ListHeader
              icon={Icons.squareArrowUpRight}
              tooltip="Transaction CID"
            >
              Transaction
            </ListHeader>
            <Copyable value={cid} />
            <Text>
              Check this{' '}
              <Link
                href={`https://explorer.glif.io/tx/${cid}/?network=${
                  config.network === 'mainnet' ? 'mainnet' : 'calibrationnet'
                }`}
              >
                transaction
              </Link>{' '}
              in the Filecoin blockchain explorer.
            </Text>
          </Section>
          <Footer>
            <ButtonIcon icon="close" name={HomepageEvents.back}>
              Close
            </ButtonIcon>
          </Footer>
        </Box>
      ),
    },
  })
}
