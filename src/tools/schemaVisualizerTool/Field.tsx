import React from 'react'
import {CardTone, Stack, Flex, Card, Text, Code} from '@sanity/ui'
import {ObjectSchemaType, SchemaType} from 'sanity'

import Arrows from './Arrows'

type FieldProps = SchemaType & {
  key: string
  depth: number
  path: string[]
  // eslint-disable-next-line react/require-default-props
  isSmall?: boolean
  // eslint-disable-next-line react/require-default-props
  isFirst?: boolean
  // eslint-disable-next-line react/require-default-props
  showName?: boolean
}

// eslint-disable-next-line complexity
export default function Field(props: FieldProps) {
  const {type, depth, path, isFirst = false, isSmall = false, showName = true} = props
  const {jsonType} = props?.type ?? {}
  const name = props?.name ?? props?.type?.name
  const title = props?.title ?? props?.type?.title
  let innerFields

  if (type && jsonType === 'array' && 'of' in type) {
    innerFields = type.of
  } else if (type && jsonType === 'object' && 'to' in type) {
    innerFields = type.to
  } else if (type && jsonType === 'object' && 'fields' in type) {
    innerFields = type.fields
  }

  let isPortableText = false
  if (type && type.jsonType === 'array' && 'to' in type && type?.of?.length) {
    isPortableText = type?.of?.some((item) => item.name === 'block')
  }

  let referenceTypes: string[] = []
  if (type && type.name === `reference` && ('to' in type || 'to' in props)) {
    // Sometimes the `to` is stored in the props, sometimes in the type?
    // @ts-expect-error
    const to = props?.to ?? type.to
    referenceTypes = to
      .map((referenceTo: ObjectSchemaType) => referenceTo.name)
      .filter((typeName: string) => typeName && !typeName?.startsWith(`sanity.`))
  }

  const newPath = [...path, name]
  const [cardTone, setCardTone] = React.useState<CardTone>(`default`)

  // Hide undefined type (should never happen?)
  if (!type) {
    return null
  }

  const isReference = type.name === `reference`
  const isSlug = type.name === `slug`

  // Hide system fields and their children
  if (type.name.startsWith(`sanity.`)) {
    return null
  }

  return (
    <>
      {name ? (
        <Card
          id={newPath.join(`.`)}
          borderTop={!isFirst}
          tone={cardTone}
          padding={isSmall ? 2 : 3}
          onMouseEnter={() => setCardTone('positive')}
          onMouseLeave={() => setCardTone('default')}
        >
          <Flex justify="space-between" gap={3} align="flex-end">
            <Text size={isSmall ? 1 : 2}>{title || name}</Text>
            {showName ? (
              <Code size={isSmall ? 0 : 1}>{isPortableText ? `portableText` : type.name}</Code>
            ) : null}
            {referenceTypes.length > 0 ? <Arrows types={referenceTypes} path={newPath} /> : null}
          </Flex>
        </Card>
      ) : null}
      {!isPortableText && !isReference && !isSlug && innerFields && innerFields.length > 0 ? (
        <Stack paddingLeft={2}>
          {innerFields.map((field) => (
            // @ts-expect-error
            <Field
              key={field.name}
              {...field}
              depth={depth + 1}
              path={newPath}
              isSmall={isSmall}
              showName={showName}
            />
          ))}
        </Stack>
      ) : null}
    </>
  )
}
