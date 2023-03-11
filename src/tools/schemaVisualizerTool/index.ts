import {Tool} from 'sanity'
import {PresentationIcon} from '@sanity/icons'

import SchemaVisualizer from './SchemaVisualizer'
import {SchemaVisualizerConfig} from '../../types'

export type SchemaVisualizerToolConfig = (options: SchemaVisualizerConfig) => Tool

export const schemaVisualizerTool: SchemaVisualizerToolConfig = (
  options: SchemaVisualizerConfig
) => ({
  name: 'visualizer',
  title: 'Visualizer',
  component: SchemaVisualizer,
  icon: PresentationIcon,
  options,
})
