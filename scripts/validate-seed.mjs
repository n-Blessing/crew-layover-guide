import {readFileSync} from 'node:fs'

const categories = new Set(['food', 'transport', 'rest', 'sightseeing', 'safety'])
const costs = new Set(['free', 'low', 'moderate', 'high'])
const text = readFileSync(new URL('../seed/seed.ndjson', import.meta.url), 'utf8')
const documents = text
  .split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line, index) => {
    try {
      return JSON.parse(line)
    } catch {
      throw new Error(`Seed line ${index + 1} is not valid JSON.`)
    }
  })

const cities = new Map()
const tips = []

for (const document of documents) {
  if (!document || typeof document._id !== 'string' || typeof document._type !== 'string') {
    throw new Error('Every seed document needs a string _id and _type.')
  }
  if (document._type === 'city') cities.set(document._id, document)
  else if (document._type === 'tip') tips.push(document)
  else throw new Error(`${document._id} has an unexpected _type.`)
}

if (cities.size < 3 || cities.size > 4) {
  throw new Error(`Expected 3 or 4 example cities, found ${cities.size}.`)
}

const requiredCityFields = ['name', 'country', 'airportCode', 'currency', 'timezone', 'summary']
for (const city of cities.values()) {
  for (const field of requiredCityFields) {
    if (typeof city[field] !== 'string' || city[field].length === 0) {
      throw new Error(`${city._id} is missing ${field}.`)
    }
  }
  if (!/^[A-Z]{3}$/.test(city.airportCode)) {
    throw new Error(`${city._id} airport code must be three capitals.`)
  }
  if (!city.slug || city.slug._type !== 'slug' || typeof city.slug.current !== 'string') {
    throw new Error(`${city._id} is missing a slug.`)
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(city.slug.current)) {
    throw new Error(`${city._id} slug has unexpected characters.`)
  }
}

if (tips.length < cities.size) {
  throw new Error('Every example city should have at least one tip.')
}

for (const tip of tips) {
  if (!tip.title?.startsWith('EXAMPLE:')) {
    throw new Error(`${tip._id} title must start with "EXAMPLE:".`)
  }
  if (tip.isExample !== true) {
    throw new Error(`${tip._id} must set isExample to true.`)
  }
  if (!categories.has(tip.category)) throw new Error(`${tip._id} has an unknown category.`)
  if (!costs.has(tip.costLevel)) throw new Error(`${tip._id} has an unknown cost level.`)
  if (typeof tip.timeNeeded !== 'string' || tip.timeNeeded.length === 0) {
    throw new Error(`${tip._id} is missing timeNeeded.`)
  }
  if (!tip.city || tip.city._type !== 'reference' || !cities.has(tip.city._ref)) {
    throw new Error(`${tip._id} must reference one of the example cities.`)
  }
  const bodyText = JSON.stringify(tip.body ?? '')
  if (!bodyText.includes('Example only')) {
    throw new Error(`${tip._id} body must say it is example copy.`)
  }
}

const usedCategories = new Set(tips.map((tip) => tip.category))
for (const category of categories) {
  if (!usedCategories.has(category)) {
    throw new Error(`Seed is missing a ${category} tip, so the filter cannot be shown.`)
  }
}

console.log(`Validated ${cities.size} cities and ${tips.length} example tips.`)
