import type { InputChangeEvent } from '@metamask/snaps-sdk'
import {
  Box,
  Copyable,
  Divider,
  Dropdown,
  Link,
  Option,
  Section,
  type SnapComponent,
  Text,
} from '@metamask/snaps-sdk/jsx'
import { RPC } from 'iso-filecoin/rpc'
import { getAccountSafe } from '../account'
import { INTERNAL_CONFIG, mainnetConfig, testnetConfig } from '../constants'
import { State } from '../state'
import * as Icons from '../svg'
import type { HomepageContext, Network, SnapConfig } from '../types'
import { Balance } from './balance'
import { ButtonSvgIcon } from './button-svg-icon'
import { ErrorBox } from './error'
import { Footer } from './footer'
import { Header } from './header'
import { updateWithProgress } from './progress'

type HomePageProps = {
  address: string
  accountNumber: number
  balance: string
  config: SnapConfig
}

export const HomepageEvents = {
  changeNetwork: 'homepage_changeNetwork',
  receive: 'homepage_receive',
  send: 'homepage_send',
  sendConfirm: 'homepage_sendConfirm',
  sendResult: 'homepage_sendResult',
  backToSend: 'homepage_backToSend',
  back: 'homepage_back',
  settings: 'homepage_settings',
  saveSettings: 'homepage_saveSettings',
}

/**
 * Homepage component
 */
export const HomePage: SnapComponent<HomePageProps> = ({
  address,
  accountNumber,
  balance,
  config,
}) => {
  return (
    <Box>
      <Header icon={Icons.wallet} iconSize={24} alignment="center">
        Account {accountNumber.toString()}
      </Header>

      <Section>
        <Text color="alternative">Network:</Text>
        <Dropdown name={HomepageEvents.changeNetwork} value={config.network}>
          <Option value="testnet">Testnet</Option>
          <Option value="mainnet">Mainnet</Option>
        </Dropdown>
        <Text color="alternative">Address:</Text>
        <Copyable value={address} />
        <Text color="alternative">Balance:</Text>
        <Balance balance={balance} config={config} />
      </Section>
      <Footer>
        <ButtonSvgIcon name={HomepageEvents.send} icon={Icons.send}>
          Send
        </ButtonSvgIcon>
        <ButtonSvgIcon name={HomepageEvents.receive} icon={Icons.qrCode}>
          Receive
        </ButtonSvgIcon>
        <ButtonSvgIcon name={HomepageEvents.settings} icon={Icons.settings}>
          Settings
        </ButtonSvgIcon>
      </Footer>
      <Divider />
      <Text alignment="center">
        <Link href="https://github.com/filecoin-project/filsnap/issues">
          {' '}
          Report an issue
        </Link>{' '}
        | <Link href="https://filsnap.dev">Companion dApp</Link>
      </Text>
    </Box>
  )
}

export async function createHomepage() {
  const state = new State(snap)
  const config = await state.get(INTERNAL_CONFIG)

  if (config === undefined) {
    return {
      ui: (
        <ErrorBox
          name={'Internal Error'}
          message="Internal config not found!"
        />
      ),
    }
  }

  const account = await getAccountSafe(snap, config)

  const rpc = new RPC({
    api: config.rpc.url,
    network: config.network,
  })
  const balance = await rpc.balance(account.address.toString())

  let addressEth = null

  try {
    addressEth = (await account.address.to0x({ rpc })).toString()
  } catch {
    // ignore
  }

  if (balance.error != null) {
    return {
      ui: (
        <ErrorBox
          name={'Error calling RPC for balance'}
          message={balance.error.message}
        />
      ),
    }
  }

  return {
    ui: (
      <HomePage
        address={account.address.toString()}
        accountNumber={account.accountNumber}
        balance={balance.result}
        config={config}
      />
    ),
    context: {
      account: account.accountNumber,
      balance: balance.result,
      config: config,
      address: account.address.toString(),
      addressEth: addressEth,
      sendMessage: null,
    } satisfies HomepageContext,
  }
}

/**
 * Update interface with the Homepage component
 */
export async function updateHomepage(id: string, ctx: HomepageContext) {
  await updateWithProgress(id, ctx)
  const { ui, context } = await createHomepage()

  await snap.request({
    method: 'snap_updateInterface',
    params: {
      id,
      ui,
      context,
    },
  })
}

/**
 * Network change event handler
 */
export async function onNetworkChange(
  id: string,
  event: InputChangeEvent,
  context: HomepageContext
) {
  await updateWithProgress(id, context)
  const state = new State(snap)
  const network = event.value as Network

  await state.set(
    INTERNAL_CONFIG,
    network === 'mainnet' ? mainnetConfig : testnetConfig
  )

  await updateHomepage(id, context)
}
