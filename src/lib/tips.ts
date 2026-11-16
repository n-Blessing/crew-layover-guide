import {tipCategories, type TipCategory} from './categories'
import type {TipDetail} from './example-data'

export type TipGroup = {
  value: TipCategory
  title: string
  description: string
  tips: TipDetail[]
}

export function groupTips(tips: TipDetail[]): TipGroup[] {
  return tipCategories
    .map((category) => ({
      value: category.value,
      title: category.title,
      description: category.description,
      tips: tips.filter((tip) => tip.category === category.value),
    }))
    .filter((group) => group.tips.length > 0)
}
