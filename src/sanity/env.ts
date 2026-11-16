import {defaultDataset, defaultProjectId} from '../../sanity.shared.mjs'

/**
 * Project id and dataset for Studio, the CLI, and the embedded `/admin` route.
 *
 * Defaults are Blessing's project (`p4yybrla` / `production`). Env vars override
 * them. Astro's Vite config replaces `process.env.SANITY_STUDIO_*` and
 * `process.env.PUBLIC_SANITY_*` in the browser bundle. The Sanity CLI reads the
 * same names from `.env` when you run `sanity dev`, `sanity schema extract`,
 * or `sanity deploy`. Keep the two pairs identical. See `.env.example`.
 */
export function readSanityConfig(): {projectId: string; dataset: string} {
  const projectId =
    process.env.SANITY_STUDIO_PROJECT_ID || process.env.PUBLIC_SANITY_PROJECT_ID || defaultProjectId
  const dataset =
    process.env.SANITY_STUDIO_DATASET || process.env.PUBLIC_SANITY_DATASET || defaultDataset

  return {projectId, dataset}
}
