import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {readSanityConfig} from './src/sanity/env'
import {schemaTypes} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'

const {projectId, dataset} = readSanityConfig()

export default defineConfig({
  name: 'default',
  title: 'Crew Layover Guide',
  projectId,
  dataset,
  plugins: [
    structureTool({structure}),
    visionTool({defaultApiVersion: '2026-10-28'}),
  ],
  schema: {types: schemaTypes},
})
