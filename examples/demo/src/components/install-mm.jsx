import { clsx } from 'clsx'
/**
 * Links to the documentation, github, and other resources
 */
export default function InstallMetamask() {
  return (
    <div class={clsx('Cell100', 'Box', 'u-AlignCenter')}>
      <div data-testid="install-mm-flask">
        Install{' '}
        <a
          href="https://chromewebstore.google.com/detail/nkbihfbeogaeaoehlefnkodbefgpgknn"
          target="_blank"
          rel="noreferrer"
        >
          Metamask
        </a>
      </div>
    </div>
  )
}
