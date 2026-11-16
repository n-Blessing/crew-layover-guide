import type {StructureResolver} from 'sanity/structure'
import {tipCategories} from './schemaTypes/tip'

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Layover guide')
    .items([
      S.documentTypeListItem('city').title('Cities'),
      S.divider(),
      S.documentTypeListItem('tip').title('All tips'),
      ...tipCategories.map((category) =>
        S.listItem()
          .title(category.title)
          .id(`tip-${category.value}`)
          .child(
            S.documentList()
              .title(category.title)
              .filter('_type == "tip" && category == $category')
              .params({category: category.value}),
          ),
      ),
    ])
