export const PURSER_FALLBACK = "I don't know, ask your purser."

export type HelpTip = {
  id: string
  title: string
  category: string
  cityName: string
  citySlug: string
  text: string
  isExample: boolean
}

export type HelpAnswer = {matched: false} | {matched: true; tip: HelpTip}

const STOP_WORDS = new Set([
  'the',
  'and',
  'for',
  'how',
  'what',
  'where',
  'when',
  'who',
  'can',
  'you',
  'your',
  'with',
  'from',
  'that',
  'this',
  'have',
  'about',
  'does',
  'did',
  'are',
  'was',
  'were',
  'into',
  'out',
  'our',
  'not',
  'but',
  'any',
  'all',
  'should',
  'know',
  'layover',
  'crew',
])

function tokens(value: string): string[] {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length >= 3 && !STOP_WORDS.has(word))
}

function hits(haystack: string, words: string[]): number {
  const text = haystack.toLowerCase()
  return words.filter((word) => text.includes(word)).length
}

function scoreTip(tip: HelpTip, words: string[]): number {
  return (
    hits(tip.cityName, words) * 2 +
    hits(tip.category, words) * 2 +
    hits(tip.title, words) * 2 +
    hits(tip.text, words)
  )
}

/**
 * Pick one published tip whose words overlap the question.
 * A city name alone is not enough. Nothing matched means the caller
 * should show {@link PURSER_FALLBACK}.
 */
export function answerQuestion(tips: HelpTip[], question: string): HelpAnswer {
  const words = tokens(question)
  if (words.length === 0) return {matched: false}

  let best: {tip: HelpTip; score: number} | undefined
  for (const tip of tips) {
    const score = scoreTip(tip, words)
    if (!best || score > best.score) best = {tip, score}
  }

  if (!best || best.score < 3) return {matched: false}
  return {matched: true, tip: best.tip}
}

export function portableTextToPlain(
  body: Array<{children?: Array<{text?: string}> | null}> | null | undefined,
): string {
  if (!body) return ''
  return body
    .map((block) => (block.children ?? []).map((span) => span.text ?? '').join(''))
    .filter((paragraph) => paragraph.length > 0)
    .join('\n')
}
