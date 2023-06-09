import React from 'react'
import {Button, Box, Stack, Flex, Card, Text} from '@sanity/ui'
import {SearchIcon, EyeClosedIcon, EyeOpenIcon} from '@sanity/icons'
import {SchemaTypeDefinition, Tool, useSchema} from 'sanity'
import {useXarrow} from 'react-xarrows'
import {motion} from 'framer-motion'

import Field from './Field'
import {SchemaVisualizerConfig} from '../../types'

type SchemaVisualizerProps = {
  tool: Tool<SchemaVisualizerConfig>
}

export default function SchemaVisualizer(props: SchemaVisualizerProps) {
  const {defaultSchemaTypes = [], hiddenSchemaTypes = []} = props?.tool?.options ?? {}
  const schema = useSchema()
  const schemaTypes = schema?._original?.types
  const documentTypes = React.useMemo<SchemaTypeDefinition<'document'>[]>(
    () =>
      schemaTypes
        ? schemaTypes
            .filter(({type, name}) => type === 'document' && !name.startsWith(`sanity.`))
            .filter(({name}) => !hiddenSchemaTypes.includes(name))
        : [],
    [schemaTypes, hiddenSchemaTypes]
  )
  const updateXarrow = useXarrow()
  const documentTypeNames = documentTypes.map((type) => type.name)
  const [small, setSmall] = React.useState(false)
  const [showName, setShowName] = React.useState(true)

  const [filters, setFilters] = React.useState<string[]>(
    defaultSchemaTypes.length ? defaultSchemaTypes : documentTypeNames
  )
  const handleFilter = React.useCallback(
    (type: string) => {
      setFilters((current) =>
        current.includes(type) ? current.filter((t) => t !== type) : [...current, type]
      )
      updateXarrow()
    },
    [updateXarrow]
  )

  return (
    <Card tone="transparent" height="fill">
      <Flex flex={1} height="fill" justify="center" align="center" style={{overflow: 'scroll'}}>
        <div
          style={{position: `fixed`, pointerEvents: `none`, bottom: 0, zIndex: 10, width: `100%`}}
        >
          <Flex gap={2} align="flex-start" padding={4} style={{pointerEvents: `auto`}}>
            {documentTypes.map((type) => (
              <Button
                fontSize={1}
                icon={type?.icon}
                key={type.name}
                tone={filters.includes(type.name) ? `primary` : `default`}
                mode={filters.includes(type.name) ? `default` : `ghost`}
                text={type.title}
                onClick={() => handleFilter(type.name)}
                disabled={filters.length === 1 && filters.includes(type.name)}
              />
            ))}
            <Box style={{marginLeft: `auto`}}>
              <Flex gap={2} align="flex-end">
                <Button
                  fontSize={1}
                  icon={SearchIcon}
                  tone="default"
                  mode="bleed"
                  text={small ? `Larger` : `Smaller`}
                  onClick={() => setSmall((current) => !current)}
                />
                <Button
                  fontSize={1}
                  icon={showName ? EyeOpenIcon : EyeClosedIcon}
                  tone="default"
                  mode="bleed"
                  text={showName ? `Hide Names` : `Show Names`}
                  onClick={() => setShowName((current) => !current)}
                />
              </Flex>
            </Box>
          </Flex>
        </div>
        {documentTypes?.length > 0 ? (
          <Flex gap={5} padding={5} align="flex-start">
            {documentTypes
              .filter((schemaType) =>
                filters.length > 0 ? filters.includes(schemaType.name) : true
              )
              .map((schemaType) => {
                if (schemaType.type !== 'document' || !('fields' in schemaType)) {
                  return null
                }

                const schemaTypeFields = schema.get(schemaType.name)

                if (!schemaTypeFields) {
                  return null
                }

                return (
                  <motion.div
                    key={schemaType.name}
                    drag
                    onDragEnd={updateXarrow}
                    dragMomentum={false}
                  >
                    <Card radius={4} shadow={2} style={{minWidth: 300, overflow: `hidden`}}>
                      <Stack>
                        <Card
                          id={`document-${schemaType.name}`}
                          padding={small ? 2 : 3}
                          paddingY={small ? 3 : 4}
                          borderBottom
                          tone="primary"
                        >
                          <Flex>
                            <Box flex={1}>
                              <Text size={small ? 1 : 2} weight="semibold">
                                {schemaType.title}
                              </Text>
                            </Box>
                            <Text size={small ? 1 : 2}>
                              {/* @TODO: Resolve Type for schema icons */}
                              {/* @ts-expect-error */}
                              {schemaType?.icon ? React.createElement(schemaType.icon) : null}
                            </Text>
                          </Flex>
                        </Card>
                        {schemaTypeFields.jsonType === 'object' &&
                        schemaTypeFields.fields?.length > 0 ? (
                          <Stack>
                            {schemaTypeFields.fields.map((field, fieldIndex) => (
                              // @ts-expect-error
                              <Field
                                key={field.name}
                                {...field}
                                depth={0}
                                isFirst={fieldIndex === 0}
                                path={[field.name]}
                                isSmall={small}
                                showName={showName}
                              />
                            ))}
                          </Stack>
                        ) : null}
                      </Stack>
                    </Card>
                  </motion.div>
                )
              })}
          </Flex>
        ) : null}
      </Flex>
    </Card>
  )
}
