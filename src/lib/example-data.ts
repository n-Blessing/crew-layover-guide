import seedNdjson from '../../seed/seed.ndjson?raw'
import {costLevels, tipCategories, type CostLevel, type TipCategory} from './categories'
import type {CitiesQueryResult, CityBySlugQueryResult} from '../sanity/sanity.types'

export type CityDetail = NonNullable<CityBySlugQueryResult>
export type TipDetail = CityDetail['tips'][number]

const categoryValues = new Set<string>(tipCategories.map((item) => item.value))
const costValues = new Set<string>(costLevels.map((item) => item.value))

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function requireString(record: Record<string, unknown>, key: string, id: string): string {
  const value = record[key]
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Example document ${id} is missing a ${key} string.`)
  }
  return value
}

function readSeed(): unknown[] {
  return seedNdjson
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as unknown)
}

function cityFromSeed(record: Record<string, unknown>): CityDetail {
  const id = requireString(record, '_id', 'city')
  const slug = isRecord(record.slug) ? record.slug.current : undefined
  if (typeof slug !== 'string' || slug.length === 0) {
    throw new Error(`Example city ${id} is missing a slug.`)
  }

  return {
    _id: id,
    name: requireString(record, 'name', id),
    slug,
    country: requireString(record, 'country', id),
    airportCode: requireString(record, 'airportCode', id),
    currency: requireString(record, 'currency', id),
    timezone: requireString(record, 'timezone', id),
    summary: requireString(record, 'summary', id),
    hero: null,
    tips: [],
  }
}

function tipFromSeed(record: Record<string, unknown>): TipDetail & {cityId: string} {
  const id = requireString(record, '_id', 'tip')
  const category = record.category
  const costLevel = record.costLevel
  const city = record.city
  if (typeof category !== 'string' || !categoryValues.has(category)) {
    throw new Error(`Example tip ${id} has an unknown category.`)
  }
  if (typeof costLevel !== 'string' || !costValues.has(costLevel)) {
    throw new Error(`Example tip ${id} has an unknown cost level.`)
  }
  if (!isRecord(city) || typeof city._ref !== 'string') {
    throw new Error(`Example tip ${id} is missing a city reference.`)
  }
  if (record.isExample !== true) {
    throw new Error(`Example tip ${id} must set isExample to true.`)
  }
  if (!Array.isArray(record.body) || record.body.length === 0) {
    throw new Error(`Example tip ${id} is missing body text.`)
  }

  return {
    _id: id,
    title: requireString(record, 'title', id),
    category: category as TipCategory,
    body: record.body as TipDetail['body'],
    timeNeeded: requireString(record, 'timeNeeded', id),
    costLevel: costLevel as CostLevel,
    isExample: true,
    cityId: city._ref,
  }
}

let cached: CityDetail[] | undefined

function loadCitiesWithTips(): CityDetail[] {
  if (cached) return cached

  const cities = new Map<string, CityDetail>()
  const tips: Array<TipDetail & {cityId: string}> = []

  for (const document of readSeed()) {
    if (!isRecord(document) || typeof document._type !== 'string') {
      throw new Error('Example seed contains a line that is not a document.')
    }
    if (document._type === 'city') cities.set(requireString(document, '_id', 'city'), cityFromSeed(document))
    else if (document._type === 'tip') tips.push(tipFromSeed(document))
    else throw new Error(`Example seed has an unexpected type: ${document._type}`)
  }

  for (const tip of tips) {
    const city = cities.get(tip.cityId)
    if (!city) throw new Error(`Example tip ${tip._id} points at missing city ${tip.cityId}.`)
    const {cityId: _cityId, ...view} = tip
    city.tips.push(view)
  }

  cached = [...cities.values()]
    .map((city) => ({
      ...city,
      tips: [...city.tips].sort((a, b) => a.title.localeCompare(b.title, 'en')),
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en'))

  return cached
}

export function loadExampleCities(): CitiesQueryResult {
  return loadCitiesWithTips().map(({tips, ...city}) => ({
    ...city,
    tipCount: tips.length,
  }))
}

export function loadExampleCity(slug: string): CityDetail | null {
  return loadCitiesWithTips().find((city) => city.slug === slug) ?? null
}

export function loadExampleDetails(): CityDetail[] {
  return loadCitiesWithTips()
}
