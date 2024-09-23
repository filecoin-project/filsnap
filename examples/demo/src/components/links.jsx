import { useFilsnap } from 'filsnap-adapter-react'
import { useEffect, useState } from 'preact/hooks'

/**
 * Links to the documentation, github, and other resources
 */
export default function Links() {
  const { snap } = useFilsnap()

  const [cid, setCid] = /** @type {typeof useState<string>} */ (useState)()
  useEffect(() => {
    /**
     *
     */
    async function main() {
      try {
        if (
          window.location.host.includes('ipfs.dweb.link') ||
          window.location.host.includes('ipfs.w3s.link')
        ) {
          const cid = window.location.host.split('.')[0]
          setCid(cid)
          return
        }
        const dnsRecord = await new Resolver().resolve(
          `_dnslink.${window.location.host}`,
          'TXT'
        )
        setCid(dnsRecord[0][0].replace('dnslink=/ipfs/', ''))
      } catch (error) {
        // noop
        console.error(error)
      }
    }

    main()
  }, [setCid])

  return (
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
            {import.meta.env.GIT_DATE}
          </code>
        </li>
        {snap && (
          <li>
            {' '}
            Snap:{' '}
            <a
              target="_blank"
              href={`https://www.npmjs.com/package/filsnap/v/${snap.snap.version}#user-content-provenance`}
              rel="noreferrer"
            >
              {snap.snap.version || 'unknown'}
            </a>
          </li>
        )}
      </ul>
    </div>
  )
}
