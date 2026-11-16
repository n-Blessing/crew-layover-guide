import {createImageUrlBuilder} from '@sanity/image-url'
import {defaultDataset, defaultProjectId} from '../../sanity.shared.mjs'
import type {CitiesQueryResult} from '../sanity/sanity.types'

type Hero = CitiesQueryResult[number]['hero']

export function heroImageUrl(hero: Hero): string | null {
  const assetUrl = hero?.asset?.url
  if (!assetUrl) return null

  const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID || defaultProjectId
  const dataset = import.meta.env.PUBLIC_SANITY_DATASET || defaultDataset
  if (!projectId) return assetUrl

  return createImageUrlBuilder({projectId, dataset})
    .image({asset: {url: assetUrl}})
    .width(1600)
    .height(900)
    .fit('crop')
    .auto('format')
    .url()
}
