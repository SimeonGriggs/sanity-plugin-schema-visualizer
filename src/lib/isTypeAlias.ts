const BUILT_IN_TYPES = [
  `string`,
  `number`,
  `boolean`,
  `array`,
  `block`,
  `crossDatasetReference`,
  `reference`,
  `span`,
  `text`,
  `url`,
  `object`,
  `slug`,
  `date`,
  `datetime`,
  `document`,
  `file`,
  `geopoint`,
  `image`,
]

export function isTypeAlias(name: string): boolean {
  return !BUILT_IN_TYPES.includes(name)
}
