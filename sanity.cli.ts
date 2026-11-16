import {defineCliConfig} from 'sanity/cli'
import {studioHost} from './sanity.shared.mjs'
import {readSanityConfig} from './src/sanity/env'

const {projectId, dataset} = readSanityConfig()

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  /**
   * Hostname for `npx sanity deploy`.
   * The hosted Studio is https://crew-layover-guide.sanity.studio.
   */
  studioHost,
  typegen: {
    path: './src/**/*.{ts,tsx,astro}',
    schema: './schema.json',
    generates: './src/sanity/sanity.types.ts',
    overloadClientMethods: true,
  },
})
