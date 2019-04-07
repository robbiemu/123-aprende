import { rules as imageRules } from './rules/image'
import { rules as linkRules } from './rules/link'
import { rules as tableRules } from './rules/tables'
import { rules as headingRules } from './rules/headings'

const image = imageRules.image
const link = linkRules.link

export let rules = {
  image,
  link,
  ...tableRules,
  ...headingRules
}
