import {defineField, defineType} from 'sanity'

export const city = defineType({
  name: 'city',
  title: 'City',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'City name as crew would say it, such as Nairobi.',
      validation: (rule) => rule.required().min(2).max(80),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Used in the city page URL.',
      options: {source: 'name', maxLength: 96},
      validation: (rule) =>
        rule.required().custom((slug) => {
          const current = slug?.current
          if (!current) return 'Add a slug.'
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(current)) {
            return 'Use lowercase letters, numbers, and hyphens.'
          }
          return true
        }),
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(80),
    }),
    defineField({
      name: 'airportCode',
      title: 'Airport code',
      type: 'string',
      description: 'Three-letter IATA code, such as NBO.',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (typeof value !== 'string' || !/^[A-Z]{3}$/.test(value)) {
            return 'Use a three-letter IATA code in capitals, such as NBO.'
          }
          return true
        }),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      description: 'Name and code, such as Kenyan shilling (KES).',
      validation: (rule) => rule.required().min(2).max(80),
    }),
    defineField({
      name: 'timezone',
      title: 'Timezone',
      type: 'string',
      description: 'IANA timezone, such as Africa/Nairobi.',
      validation: (rule) =>
        rule.required().custom((value) => {
          if (typeof value !== 'string' || !/^[A-Za-z]+(?:\/[A-Za-z_+-]+)+$/.test(value)) {
            return 'Use an IANA timezone such as Africa/Nairobi.'
          }
          return true
        }),
    }),
    defineField({
      name: 'hero',
      title: 'Hero image',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Required when an image is set. Describe the photo, not the city name alone.',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const parent = context.parent as {asset?: unknown} | undefined
              if (parent?.asset && !alt) return 'Describe the image for screen readers.'
              if (typeof alt === 'string' && alt.length > 180) return 'Keep alternative text under 180 characters.'
              return true
            }),
        }),
      ],
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 4,
      description: 'Two or three sentences. Say when a note is an example and still needs checking.',
      validation: (rule) => rule.required().min(40).max(400),
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'airportCode', media: 'hero'},
    prepare({title, subtitle, media}) {
      return {title, subtitle, media}
    },
  },
})
