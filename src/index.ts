import {definePlugin} from 'sanity'

import {schemaVisualizerTool} from './tools/schemaVisualizerTool'
import {SchemaVisualizerConfig} from './types'

export const schemaVisualizer = definePlugin<SchemaVisualizerConfig | void>((config) => {
  const {defaultSchemaTypes = [], hiddenSchemaTypes = []} = config || {}

  return {
    name: 'sanity-plugin-schema-visualizer',
    tools: [schemaVisualizerTool({defaultSchemaTypes, hiddenSchemaTypes})],
  }
})
