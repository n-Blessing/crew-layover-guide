import {defineQuery} from 'groq'

/**
 * Query names must stay unique across the repo. Sanity TypeGen uses them
 * as the generated result type names (`CitiesQueryResult`, `CityBySlugQueryResult`).
 */
const published = `!(_id in path("drafts.**")) && !(_id in path("versions.**"))`

export const citiesQuery = defineQuery(`
  *[_type == "city" && defined(slug.current) && ${published}] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    country,
    airportCode,
    currency,
    timezone,
    summary,
    hero {
      alt,
      asset->{
        _id,
        url
      }
    },
    "tipCount": count(*[_type == "tip" && city._ref == ^._id && ${published}])
  }
`)

export const cityBySlugQuery = defineQuery(`
  *[_type == "city" && slug.current == $slug && ${published}][0] {
    _id,
    name,
    "slug": slug.current,
    country,
    airportCode,
    currency,
    timezone,
    summary,
    hero {
      alt,
      asset->{
        _id,
        url
      }
    },
    "tips": *[_type == "tip" && city._ref == ^._id && ${published}] | order(title asc) {
      _id,
      title,
      category,
      body,
      timeNeeded,
      costLevel,
      isExample
    }
  }
`)

/** Published tips only. Drafts and Content Release versions are excluded. */
export const publishedTipsQuery = defineQuery(`
  *[_type == "tip" && ${published}] | order(title asc) {
    _id,
    title,
    category,
    timeNeeded,
    costLevel,
    isExample,
    "text": pt::text(body),
    "cityName": city->name,
    "citySlug": city->slug.current
  }
`)
