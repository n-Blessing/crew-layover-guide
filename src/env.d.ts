/// <reference types="astro/client" />
/// <reference types="@sanity/astro/module" />

declare module '*.ndjson?raw' {
  const content: string
  export default content
}

interface ImportMetaEnv {
  readonly PUBLIC_SANITY_PROJECT_ID?: string
  readonly PUBLIC_SANITY_DATASET?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
