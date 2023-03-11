import React from 'react'
import {CardTone, Stack, Flex, Card, Text, Code} from '@sanity/ui'
import {SchemaType, useSchema} from 'sanity'

import Arrows from './Arrows'
import {isTypeAlias} from '../../lib/isTypeAlias'

type FieldProps = SchemaType & {
  depth: number
  path: string[]
  isFirst?: boolean
}

export default function Field(props: FieldProps) {
  const {name, type, depth, path, isFirst = false} = props
  const {jsonType, title} = props?.type ?? {}
  let innerFields

  if (jsonType === 'array') {
    innerFields = props?.type?.of
  } else if (jsonType === 'object') {
    innerFields = props?.type?.fields
  }

  const isPortableText =
    jsonType === 'array' && props?.of?.length && props?.of?.find((item) => item.type === 'block')
  const referenceTypes =
    type?.name === 'reference' && props.to?.length
      ? props.to.map(({type}: {type: string}) => type)
      : []
  const newPath = [...path, name]
  const [cardTone, setCardTone] = React.useState<CardTone>(`default`)
  const schema = useSchema()

  if (type?.name.startsWith(`sanity.`)) {
    return null
  }

  return (
    <>
      {name ? (
        <Card
          id={newPath.join(`.`)}
          borderTop={!isFirst}
          tone={cardTone}
          paddingX={3}
          paddingY={3}
          onMouseEnter={() => setCardTone('positive')}
          onMouseLeave={() => setCardTone('default')}
        >
          <Flex justify="space-between" gap={3} align="flex-end">
            <Text size={2}>{title || name}</Text>
            <Code size={1}>{isPortableText ? `portableText` : type.name}</Code>
            <Arrows types={referenceTypes} path={newPath} />
          </Flex>
        </Card>
      ) : null}
      {!isPortableText && innerFields && innerFields.length > 0 ? (
        <Stack paddingLeft={2}>
          {innerFields.map((field) => {
            if (isTypeAlias(field.name)) {
              const actual = schema.get(field.name)

              if (actual?.type) {
                return (
                  <Field
                    key={actual.name}
                    type={actual.type}
                    fields={actual.jsonType === 'object' ? actual.fields : undefined}
                    of={actual.jsonType === 'array' ? actual.of : undefined}
                    name={actual.type.name}
                    title={actual.type.title}
                    depth={depth + 1}
                    path={newPath}
                  />
                )
              }
            }

            return <Field key={field.name} {...field} depth={depth + 1} path={newPath} />
          })}
        </Stack>
      ) : null}
    </>
  )
}
