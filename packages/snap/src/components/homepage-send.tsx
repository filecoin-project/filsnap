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
import { getAccountWithPrivateKey } from '../account.ts'
import iconFilecoin from '../svg/filecoin-logo.svg'
import * as Icons from '../svg/index.tsx'
import iconSettings from '../svg/settings.svg'
import iconArrowUpRight from '../svg/square-arrow-up-right.svg'
import type { HomepageContext, MessageObj, SnapConfig } from '../types.ts'
import {
  addressToCaip10,
  explorerAddressLink,
  formatFIL,
  formatFILShort,
} from '../utils.ts'
import { ButtonIcon } from './button-icon.tsx'
import { ButtonSvgIcon } from './button-svg-icon.tsx'
import { updateWithError } from './error.tsx'
import { Footer } from './footer.tsx'
import { Header, ListHeader } from './header.tsx'
import { HomepageEvents } from './homepage.tsx'
import { updateWithProgress } from './progress.tsx'
import { Spacer } from './spacer.tsx'
import { SvgIcon } from './svg-icon.tsx'

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
        <Box alignment="center" direction="horizontal">
          <Text color="alternative">
            This site is requesting a signature for:
          </Text>
        </Box>
      )}
      <Box direction="horizontal">
        <SvgIcon color="alternative" icon={iconArrowUpRight} />
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
        <SvgIcon color="alternative" icon={iconSettings} />
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
          <Header alignment="center" icon={Icons.send} iconSize={24}>
            Send ⨎
          </Header>
          <Form name="sendForm">
            <Section>
              <Field error={errors.from?.join(', ')} label="From">
                <Selector name="from" title="Select an account">
                  <SelectorOption value={`${address}:${account}`}>
                    <Card
                      description={`Account ${account}`}
                      image={iconFilecoin}
                      title={
                        <Address
                          address={addressToCaip10(address)}
                          avatar={false}
                        />
                      }
                      value={formatFILShort(balance, config)}
                    />
                  </SelectorOption>
                </Selector>
              </Field>
              <Field error={errors.to?.join(', ')} label="To">
                <Input
                  name="to"
                  placeholder="f0, f1, f2, f3, f4 or 0x address"
                  type="text"
                />
              </Field>
              <Field error={errors.amount?.join(', ')} label="Amount">
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
                name={HomepageEvents.sendConfirm}
                type="submit"
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
          <Header alignment="center" icon={Icons.eye} iconSize={24}>
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
            alignment="center"
            icon={Icons.partyPopper}
            iconColor="success"
            iconSize={24}
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
