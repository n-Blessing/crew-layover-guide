export const tipCategories = [
  {title: 'Food', value: 'food', description: 'Eating on a short stop'},
  {title: 'Transport', value: 'transport', description: 'Between the airport and the city'},
  {title: 'Rest', value: 'rest', description: 'Sleep and resetting before report'},
  {title: 'Sightseeing', value: 'sightseeing', description: 'What can fit in under a day'},
  {title: 'Safety', value: 'safety', description: 'Habits for an unfamiliar city'},
] as const

export const costLevels = [
  {title: 'Free', value: 'free'},
  {title: 'Low', value: 'low'},
  {title: 'Moderate', value: 'moderate'},
  {title: 'High', value: 'high'},
] as const

export type TipCategory = (typeof tipCategories)[number]['value']
export type CostLevel = (typeof costLevels)[number]['value']

export function categoryLabel(value: string): string {
  return tipCategories.find((item) => item.value === value)?.title ?? value
}

export function costLabel(value: string): string {
  return costLevels.find((item) => item.value === value)?.title ?? value
}
