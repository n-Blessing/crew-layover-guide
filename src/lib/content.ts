import {sanityClient} from 'sanity:client'
import {defaultProjectId} from '../../sanity.shared.mjs'
import {portableTextToPlain, type HelpTip} from './crew-help'
import {loadExampleCities, loadExampleCity, loadExampleDetails, type CityDetail} from './example-data'
import {cityBySlugQuery, citiesQuery, publishedTipsQuery} from './queries'
import type {CitiesQueryResult} from '../sanity/sanity.types'

/** Drafts and Content Release versions stay out of the public site. */
const publishedPerspective = {perspective: 'published' as const}

export type ContentSource = 'sanity' | 'example'

export type LoadSuccess<T> = {ok: true; source: ContentSource; data: T}
export type LoadFailure = {ok: false; message: string}
export type LoadResult<T> = LoadSuccess<T> | LoadFailure

export function isSanityConfigured(): boolean {
  return Boolean(import.meta.env.PUBLIC_SANITY_PROJECT_ID || defaultProjectId)
}

export async function getCities(): Promise<LoadResult<CitiesQueryResult>> {
  if (!isSanityConfigured()) {
    return {ok: true, source: 'example', data: loadExampleCities()}
  }

  try {
    const data = await sanityClient.fetch(citiesQuery, {}, publishedPerspective)
    if (data.length === 0) {
      return {ok: true, source: 'example', data: loadExampleCities()}
    }
    return {ok: true, source: 'sanity', data}
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The Sanity request failed.'
    return {ok: false, message}
  }
}

export async function getCity(slug: string): Promise<LoadResult<CityDetail | null>> {
  if (!isSanityConfigured()) {
    return {ok: true, source: 'example', data: loadExampleCity(slug)}
  }

  try {
    const data = await sanityClient.fetch(cityBySlugQuery, {slug}, publishedPerspective)
    if (!data) {
      return {ok: true, source: 'example', data: loadExampleCity(slug)}
    }
    return {ok: true, source: 'sanity', data}
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The Sanity request failed.'
    return {ok: false, message}
  }
}

export async function getHelpTips(): Promise<LoadResult<HelpTip[]>> {
  if (!isSanityConfigured()) {
    return {ok: true, source: 'example', data: helpTipsFromDetails(loadExampleDetails())}
  }

  try {
    const tips = await sanityClient.fetch(publishedTipsQuery, {}, publishedPerspective)
    const data = tips.flatMap((tip) => {
      if (!tip.cityName || !tip.citySlug || !tip.text) return []
      return [
        {
          id: tip._id,
          title: tip.title,
          category: tip.category,
          cityName: tip.cityName,
          citySlug: tip.citySlug,
          text: tip.text,
          isExample: tip.isExample,
        },
      ]
    })
    if (data.length === 0) {
      return {ok: true, source: 'example', data: helpTipsFromDetails(loadExampleDetails())}
    }
    return {ok: true, source: 'sanity', data}
  } catch (error) {
    const message = error instanceof Error ? error.message : 'The Sanity request failed.'
    return {ok: false, message}
  }
}

function helpTipsFromDetails(cities: CityDetail[]): HelpTip[] {
  return cities.flatMap((city) =>
    city.tips.flatMap((tip) => {
      const text = portableTextToPlain(tip.body)
      if (!text) return []
      return [
        {
          id: tip._id,
          title: tip.title,
          category: tip.category,
          cityName: city.name,
          citySlug: city.slug,
          text,
          isExample: tip.isExample,
        },
      ]
    }),
  )
}
