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
}

export default function Field(props: FieldProps) {
  const {name, type, depth, path, isFirst = false, isSmall = false} = props
  const {jsonType, title} = props?.type ?? {}
  let innerFields

  if (type && jsonType === 'array' && 'of' in type) {
    innerFields = type?.of
  } else if (type && jsonType === 'object' && 'fields' in type) {
    innerFields = type?.fields
  }

  let isPortableText = false
  if (type && type.jsonType === 'array' && 'to' in type && type?.of?.length) {
    isPortableText = type?.of?.some((item) => item.name === 'block')
  }

  const isReference = type && type.name === `reference`
  let referenceTypes: string[] = []
  if (type && type.name === `reference` && 'to' in type) {
    // I don't know why this .to is unknown
    // @ts-expect-error
    referenceTypes = type.to
      .map((referenceTo: ObjectSchemaType) => referenceTo.name)
      .filter((typeName: string) => typeName && !typeName?.startsWith(`sanity.`))
  }

  const newPath = [...path, name]
  const [cardTone, setCardTone] = React.useState<CardTone>(`default`)

  // Hide undefined type (should never happen?)
  if (!type) {
    return null
  }

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
            <Code size={isSmall ? 0 : 1}>{isPortableText ? `portableText` : type.name}</Code>
            {referenceTypes.length > 0 ? <Arrows types={referenceTypes} path={newPath} /> : null}
          </Flex>
        </Card>
      ) : null}
      {!isPortableText && !isReference && innerFields && innerFields.length > 0 ? (
        <Stack paddingLeft={2}>
          {innerFields.map((field) => (
            // @ts-expect-error
            <Field key={field.name} {...field} depth={depth + 1} path={newPath} isSmall={isSmall} />
          ))}
        </Stack>
      ) : null}
    </>
  )
}
