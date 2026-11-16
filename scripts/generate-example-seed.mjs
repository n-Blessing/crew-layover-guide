import {mkdirSync, writeFileSync} from 'node:fs'

function block(key, text, extra = {}) {
  return {
    _type: 'block',
    _key: key,
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', _key: `${key}s`, text, marks: []}],
    ...extra,
  }
}

function bullet(key, text) {
  return block(key, text, {listItem: 'bullet', level: 1})
}

const cities = [
  {
    _id: 'city-brussels',
    name: 'Brussels',
    slug: 'brussels',
    country: 'Belgium',
    airportCode: 'BRU',
    currency: 'Euro (EUR)',
    timezone: 'Europe/Brussels',
    summary:
      'Brussels, served by Brussels Airport (BRU). The airport code, currency, and timezone are standard reference facts. The tips are example notes for this demo, not checked local advice.',
  },
  {
    _id: 'city-dubai',
    name: 'Dubai',
    slug: 'dubai',
    country: 'United Arab Emirates',
    airportCode: 'DXB',
    currency: 'UAE dirham (AED)',
    timezone: 'Asia/Dubai',
    summary:
      'Dubai, served by Dubai International (DXB). The airport code, currency, and timezone are standard reference facts. The tips are example notes and were not checked on the ground.',
  },
  {
    _id: 'city-lagos',
    name: 'Lagos',
    slug: 'lagos',
    country: 'Nigeria',
    airportCode: 'LOS',
    currency: 'Nigerian naira (NGN)',
    timezone: 'Africa/Lagos',
    summary:
      'Lagos, served by Murtala Muhammed International (LOS). The airport code, currency, and timezone are standard reference facts. The tips are example notes for this demo.',
  },
  {
    _id: 'city-nairobi',
    name: 'Nairobi',
    slug: 'nairobi',
    country: 'Kenya',
    airportCode: 'NBO',
    currency: 'Kenyan shilling (KES)',
    timezone: 'Africa/Nairobi',
    summary:
      'Nairobi, served by Jomo Kenyatta International (NBO). The airport code, currency, and timezone are standard reference facts. The tips are example notes, written for this demo and not checked locally.',
  },
]

const tips = [
  {
    _id: 'tip-brussels-transport',
    city: 'city-brussels',
    category: 'transport',
    costLevel: 'low',
    timeNeeded: 'Under 2 hours',
    title: 'EXAMPLE: Check the airport link before you leave the terminal',
    body: [
      block(
        'bru-t1',
        'Example only. This is not a verified timetable, fare, or named operator.',
      ),
      block('bru-t2', 'Before you leave the terminal:'),
      bullet('bru-t3', 'Confirm today’s airport-to-city option from the operator, not from an old screenshot.'),
      bullet('bru-t4', 'Check the last return that still gets you back for crew report.'),
      bullet('bru-t5', 'Look up the platform and the fare yourself. This sample deliberately leaves them out.'),
    ],
  },
  {
    _id: 'tip-brussels-food',
    city: 'city-brussels',
    category: 'food',
    costLevel: 'moderate',
    timeNeeded: 'About 1 hour',
    title: 'EXAMPLE: Eat close to the hotel',
    body: [
      block(
        'bru-f1',
        'Example only. No restaurant, café, or dish is recommended here. If the layover is only a few hours, eat within walking distance of where the crew is staying and keep whatever receipt habit your airline already uses. Verify opening hours yourself.',
      ),
    ],
  },
  {
    _id: 'tip-brussels-rest',
    city: 'city-brussels',
    category: 'rest',
    costLevel: 'free',
    timeNeeded: 'A full rest block',
    title: 'EXAMPLE: Guard a sleep block before report',
    body: [
      block(
        'bru-r1',
        'Example only. This is a general rest habit, not medical advice. Put the report time in your phone, tell a colleague when you expect to be back, and drop the city plan if you are short on sleep.',
      ),
    ],
  },
  {
    _id: 'tip-dubai-transport',
    city: 'city-dubai',
    category: 'transport',
    costLevel: 'moderate',
    timeNeeded: 'Under 2 hours',
    title: 'EXAMPLE: Choose the airport ride before you exit',
    body: [
      block(
        'dxb-t1',
        'Example only. This sample does not name a taxi company, metro line, or fare. Decide how you will get to the hotel before you leave the arrivals hall, and leave more time for the return than the outbound ride took.',
      ),
    ],
  },
  {
    _id: 'tip-dubai-safety',
    city: 'city-dubai',
    category: 'safety',
    costLevel: 'free',
    timeNeeded: 'The whole layover',
    title: 'EXAMPLE: Plan for heat if you will be outside',
    body: [
      block(
        'dxb-s1',
        'Example only. This is not weather or health advice. If you leave the hotel, check the day’s temperature yourself, carry water, and skip a long unsheltered walk in the hottest part of the day. Nothing here was verified for a particular season.',
      ),
    ],
  },
  {
    _id: 'tip-lagos-transport',
    city: 'city-lagos',
    category: 'transport',
    costLevel: 'high',
    timeNeeded: 'Under 3 hours',
    title: 'EXAMPLE: Arrange the airport ride with your crew',
    body: [
      block(
        'los-t1',
        'Example only. This is not a recommendation of a road, a rank, or a car service. Agree the ride with your crew or the hotel before landing, share the plan with a colleague, and do not treat this sample as local transport guidance.',
      ),
    ],
  },
  {
    _id: 'tip-lagos-food',
    city: 'city-lagos',
    category: 'food',
    costLevel: 'moderate',
    timeNeeded: 'About 1 hour',
    title: 'EXAMPLE: Eat where the crew already has a booking',
    body: [
      block(
        'los-f1',
        'Example only. No restaurant, market, or dish is named on purpose. Use a booking the crew or hotel already holds, and treat any other food idea as something you still have to verify.',
      ),
    ],
  },
  {
    _id: 'tip-nairobi-transport',
    city: 'city-nairobi',
    category: 'transport',
    costLevel: 'moderate',
    timeNeeded: 'Under 2 hours',
    title: 'EXAMPLE: Use the transport arranged for the crew',
    body: [
      block(
        'nbo-t1',
        'Example only. This sample does not name a road, a rank, or a fare. Use the pickup your airline or hotel arranged, and confirm the return time while you are still at the airport.',
      ),
    ],
  },
  {
    _id: 'tip-nairobi-sightseeing',
    city: 'city-nairobi',
    category: 'sightseeing',
    costLevel: 'low',
    timeNeeded: 'Under 4 hours',
    title: 'EXAMPLE: Keep the outing inside a short radius',
    body: [
      block(
        'nbo-g1',
        'Example only. No park, neighbourhood, or attraction is recommended here. If you have a few hours, stay close enough to the hotel that a delay still gets you back before report. Check what is actually open that day.',
      ),
    ],
  },
  {
    _id: 'tip-nairobi-rest',
    city: 'city-nairobi',
    category: 'rest',
    costLevel: 'free',
    timeNeeded: 'A full rest block',
    title: 'EXAMPLE: Write down the time you need to be back',
    body: [
      block(
        'nbo-r1',
        'Example only. A general rest habit, not local security advice. Note the report time, tell a colleague your plan, and skip the outing if the rest window is already short.',
      ),
    ],
  },
]

const documents = [
  ...cities.map((city) => ({
    _id: city._id,
    _type: 'city',
    name: city.name,
    slug: {_type: 'slug', current: city.slug},
    country: city.country,
    airportCode: city.airportCode,
    currency: city.currency,
    timezone: city.timezone,
    summary: city.summary,
  })),
  ...tips.map((tip) => ({
    _id: tip._id,
    _type: 'tip',
    title: tip.title,
    category: tip.category,
    body: tip.body,
    timeNeeded: tip.timeNeeded,
    costLevel: tip.costLevel,
    isExample: true,
    city: {_type: 'reference', _ref: tip.city},
  })),
]

const ndjson = documents.map((doc) => JSON.stringify(doc)).join('\n') + '\n'
const target = new URL('../seed/seed.ndjson', import.meta.url)
mkdirSync(new URL('../seed/', import.meta.url), {recursive: true})
writeFileSync(target, ndjson)
console.log(`Wrote ${documents.length} documents`)
