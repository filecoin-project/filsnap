import * as child from 'child_process'
import preact from '@preact/preset-vite'
import * as git from 'tiny-git-rev-sync'
import { defineConfig } from 'vite'

const commitHash = child.execSync('git rev-parse HEAD').toString()

export default defineConfig({
  define: {
    'import.meta.env.GIT_COMMIT_HASH': JSON.stringify(commitHash),
    'import.meta.env.GIT_BRANCH': JSON.stringify(git.gitBranch()),
    'import.meta.env.GIT_DATE': JSON.stringify(git.gitDate()),
    'import.meta.env.GIT_TAG': JSON.stringify(git.gitTag()),
    'import.meta.env.GITHUB_WORKFLOW_ID': JSON.stringify(
      process.env.GITHUB_WORKFLOW_ID
    ),
  },
  plugins: [preact()],
})
