import {defineField, defineType} from 'sanity'
import {costLevels, tipCategories} from '../../lib/categories'

export {costLevels, tipCategories}

export const tip = defineType({
  name: 'tip',
  title: 'Tip',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Start sample or unverified tips with EXAMPLE so the site can label them.',
      validation: (rule) => rule.required().min(8).max(120),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: tipCategories.map(({title, value}) => ({title, value})),
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading', value: 'h3'},
          ],
          lists: [{title: 'Bullet', value: 'bullet'}],
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'timeNeeded',
      title: 'Time needed',
      type: 'string',
      description: 'A short phrase, such as "Under 3 hours". Do not invent a timetable.',
      validation: (rule) => rule.required().min(3).max(40),
    }),
    defineField({
      name: 'costLevel',
      title: 'Cost level',
      type: 'string',
      options: {
        list: costLevels.map(({title, value}) => ({title, value})),
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'reference',
      to: [{type: 'city'}],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'isExample',
      title: 'Example data',
      type: 'boolean',
      description:
        'On for sample or unverified copy. The site shows an Example badge and tells readers to check it before travel.',
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', category: 'category', city: 'city.name', isExample: 'isExample'},
    prepare({title, category, city, isExample}) {
      const parts = [category, city, isExample ? 'Example' : undefined].filter(Boolean)
      return {title, subtitle: parts.join(' · ')}
    },
  },
})
