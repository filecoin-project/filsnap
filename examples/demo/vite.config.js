import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import * as child from 'child_process'
import * as git from 'tiny-git-rev-sync'

const commitHash = child.execSync('git rev-parse HEAD').toString()

export default defineConfig({
  define: {
    'import.meta.env.GIT_COMMIT_HASH': JSON.stringify(commitHash),
    'import.meta.env.GIT_BRANCH': JSON.stringify(git.gitBranch()),
    'import.meta.env.GIT_DATE': JSON.stringify(git.gitDate()),
    'import.meta.env.GIT_TAG': JSON.stringify(git.gitTag()),
  },
  plugins: [preact()],
})
