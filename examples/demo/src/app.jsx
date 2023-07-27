import Account from './components/rpc.jsx'
import Connect from './components/connect.jsx'
import Network from './components/network.jsx'
import Send from './components/send.tsx'
import SignMessage from './components/sign-message.jsx'
import { useFilsnapContext } from './hooks/filsnap.js'
import ConnectFEVM from './components/connect-fevm.jsx'
import Forward from './components/forward.tsx'
import { useEffect, useState } from 'preact/hooks'
import Resolver from 'dns-over-http-resolver'

export function App() {
  const { isConnected, snap } = useFilsnapContext()
  const [cid, setCid] = /** @type {typeof useState<string>} */ (useState)()
  useEffect(() => {
    async function main() {
      try {
        if (window.location.host.includes('ipfs.dweb.link')) {
          const cid = window.location.host.split('.')[0]
          setCid(cid)
          return
        }
        const dnsRecord = await new Resolver().resolve(
          `_dnslink.${window.location.host}`,
          'TXT'
        )
        setCid(dnsRecord[0][0].replace('dnslink=/ipfs/', ''))
      } catch {}
    }

    main()
  }, [])

  return (
    <main class="App">
      <h1>⨎ Filsnap</h1>
      <div class="Grid">
        <Connect />
        <Network />
        {isConnected && (
          <>
            <Send />
            <ConnectFEVM />
            <Forward />
            <details class="Cell100">
              <summary>Advanced</summary>
              <Account />
              <SignMessage />
            </details>
          </>
        )}
        <div class="Cell100 Box">
          <h3>Links</h3>
          <ul>
            <li>
              {' '}
              Docs:{' '}
              <a
                target="_blank"
                href="https://filecoin-project.github.io/filsnap/"
                rel="noreferrer"
              >
                filecoin-project.github.io/filsnap
              </a>
            </li>
            <li>
              {' '}
              Github:{' '}
              <a
                target="_blank"
                href="https://github.com/filecoin-project/filsnap"
                rel="noreferrer"
              >
                github.com/filecoin-project/filsnap
              </a>
            </li>
            <li>
              {' '}
              CID:{' '}
              <a
                target="_blank"
                href={`https://${cid}.ipfs.dweb.link/`}
                rel="noreferrer"
              >
                {cid || 'unknown'}
              </a>
            </li>
            <li>
              {' '}
              Release Job:{' '}
              <a
                target="_blank"
                href={`https://github.com/filecoin-project/filsnap/actions/runs/${
                  import.meta.env.GITHUB_WORKFLOW_ID
                }`}
                rel="noreferrer"
              >
                {import.meta.env.GITHUB_WORKFLOW_ID || 'unknown'}
              </a>
            </li>
            <li>
              {' '}
              Git:{' '}
              <code>
                {import.meta.env.GIT_BRANCH}{' '}
                <a
                  title="Commit hash"
                  target="_blank"
                  href={`https://github.com/filecoin-project/filsnap/commit/${
                    import.meta.env.GIT_COMMIT_HASH
                  }`}
                  rel="noreferrer"
                >
                  {import.meta.env.GIT_COMMIT_HASH.slice(0, 7)}
                </a>{' '}
                <a
                  title="Release tag"
                  target="_blank"
                  href={`https://github.com/filecoin-project/filsnap/releases/tag/${
                    import.meta.env.GIT_TAG
                  }`}
                  rel="noreferrer"
                >
                  {import.meta.env.GIT_TAG}
                </a>{' '}
                {import.meta.env.GIT_DATE}
              </code>
            </li>
            <li>
              {' '}
              Snap:{' '}
              <a
                target="_blank"
                href={`https://www.npmjs.com/package/filsnap/v/${snap?.snapVersion}#user-content-provenance`}
                rel="noreferrer"
              >
                {snap?.snapVersion || 'unknown'}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  )
}
