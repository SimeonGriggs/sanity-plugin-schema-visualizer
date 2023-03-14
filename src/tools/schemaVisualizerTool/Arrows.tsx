import React from 'react'
import Xarrow, {xarrowPropsType} from 'react-xarrows'
import {hues} from '@sanity/color'
import {Portal} from '@sanity/ui'

type ArrowsProps = {
  types?: string[]
  path: string[]
}

export default function Arrows(props: ArrowsProps) {
  const {types, path} = props

  const arrows: xarrowPropsType[] = React.useMemo(
    () =>
      types?.length
        ? types.map((type) => ({
            start: path.join('.'),
            end: `document-${type}`,
            endAnchor: 'auto',
            color: hues.blue[500].hex,
            animateDrawing: true,
            strokeWidth: 1,
            path: 'grid',
            dashness: {
              strokeLen: 6,
              nonStrokeLen: 2,
              animation: false,
            },
          }))
        : [],
    [path, types]
  )

  if (!arrows?.length) {
    return null
  }

  return (
    <Portal>
      {arrows.map((arrow) => (
        <Xarrow key={`${arrow.start}-${arrow.end}`} {...arrow} />
      ))}
    </Portal>
  )
}
