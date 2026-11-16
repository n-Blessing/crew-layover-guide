// @ts-check
import react from '@astrojs/react'
import sanity from '@sanity/astro'
import {defineConfig} from 'astro/config'
import {getStudioEnvironmentVariables} from 'sanity/cli'
import {loadEnv} from 'vite'
import {defaultDataset, defaultProjectId} from './sanity.shared.mjs'

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development'
const fileEnv = loadEnv(mode, process.cwd(), '')

/**
 * @param {string} name
 */
function read(name) {
  return process.env[name] || fileEnv[name] || ''
}

const projectId =
  read('PUBLIC_SANITY_PROJECT_ID') || read('SANITY_STUDIO_PROJECT_ID') || defaultProjectId
const dataset = read('PUBLIC_SANITY_DATASET') || read('SANITY_STUDIO_DATASET') || defaultDataset
const token = read('SANITY_API_READ_TOKEN') || undefined

const studioDefine = getStudioEnvironmentVariables({
  jsonEncode: true,
  prefix: 'process.env.',
  envFile: {mode, envDir: process.cwd()},
})

studioDefine['process.env.SANITY_STUDIO_PROJECT_ID'] = JSON.stringify(
  read('SANITY_STUDIO_PROJECT_ID') || projectId,
)
studioDefine['process.env.SANITY_STUDIO_DATASET'] = JSON.stringify(
  read('SANITY_STUDIO_DATASET') || dataset,
)
studioDefine['process.env.PUBLIC_SANITY_PROJECT_ID'] = JSON.stringify(projectId)
studioDefine['process.env.PUBLIC_SANITY_DATASET'] = JSON.stringify(dataset)

// https://astro.build/config
export default defineConfig({
  site: 'https://n-blessing.github.io',
  base: '/crew-layover-guide/',
  server: {
    port: 4477,
    host: true,
  },
  integrations: [
    sanity({
      projectId,
      dataset,
      apiVersion: '2026-10-28',
      useCdn: false,
      // API versions from 2025-02-19 default to this. Set it anyway so drafts
      // and Content Release versions cannot leak into the public site.
      perspective: 'published',
      token,
      studioBasePath: '/admin',
      studioRouterHistory: 'hash',
      injectTypes: true,
    }),
    react(),
  ],
  vite: {
    define: studioDefine,
  },
})
