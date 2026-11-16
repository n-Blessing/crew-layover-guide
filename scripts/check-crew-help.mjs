import {answerQuestion, PURSER_FALLBACK} from '../src/lib/crew-help.ts'

const tips = [
  {
    id: 'tip-brussels-transport',
    title: 'EXAMPLE: Check the airport link before you leave the terminal',
    category: 'transport',
    cityName: 'Brussels',
    citySlug: 'brussels',
    text: 'Example only. Confirm today’s airport-to-city option from the operator.',
    isExample: true,
  },
  {
    id: 'tip-dubai-safety',
    title: 'EXAMPLE: Plan for heat if you will be outside',
    category: 'safety',
    cityName: 'Dubai',
    citySlug: 'dubai',
    text: 'Example only. Check the day’s temperature yourself and carry water.',
    isExample: true,
  },
]

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

const brussels = answerQuestion(tips, 'How do I get from Brussels airport into the city?')
assert(brussels.matched && brussels.tip.id === 'tip-brussels-transport', 'Brussels airport should cite the transport tip.')

const dubai = answerQuestion(tips, 'What should I know about heat in Dubai?')
assert(dubai.matched && dubai.tip.id === 'tip-dubai-safety', 'Dubai heat should cite the safety tip.')

const tokyo = answerQuestion(tips, 'Where is a nightclub in Tokyo?')
assert(!tokyo.matched, 'Tokyo should not match a published tip.')

const cityOnly = answerQuestion(tips, 'Tell me about Brussels')
assert(!cityOnly.matched, 'A city name alone should not count as an answer.')

if (PURSER_FALLBACK !== "I don't know, ask your purser.") {
  throw new Error('The fallback sentence changed.')
}

console.log('Crew Help matched published tips and refused an unknown city.')
