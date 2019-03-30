import React from 'react'
import { Svg } from 'expo'

const Path = Svg.Path

export const VolumeIconMuteSVG = props => (
  <Svg
    x={0}
    y={0}
    width={75}
    height={75}
    fill='currentColor'
    stroke='currentColor'
    {...props}>
    <Path
      stroke='#11111'
      d='M39.389 13.769L22.235 28.606H6v19.093h15.989l17.4 15.051V13.769z'
    />
    <Path
      d='M48.652 50.27L69.395 25.97M69.395 50.27L48.652 25.97'
      fill='none'
    />
  </Svg>
)

export const VolumeIconLoudSVG = props => (
  <Svg
    x={0}
    y={0}
    width={75}
    height={75}
    fill='currentColor'
    stroke='currentColor'
    {...props}>
    <Path d='M39.389 13.769L22.235 28.606H6v19.093h15.989l17.4 15.051V13.769z' />
    <Path
      d='M48.128 49.03a20.087 20.087 0 0 0-.085-21.453M55.082 20.537a29.86 29.86 0 0 1 5.884 17.84 29.83 29.83 0 0 1-5.788 17.699M61.71 62.611a38.952 38.952 0 0 0 8.418-24.233 38.968 38.968 0 0 0-8.519-24.368'
      fill='none'
    />
  </Svg>
)

export const PlayIconSVG = props => (
  <Svg x={0} y={0} width={32} height={32} fill='currentColor' {...props}>
    <Path d='M0 0l32 16L0 32z' />
  </Svg>
)

export const PauseIconSVG = props => (
  <Svg x={0} y={0} width={32} height={32} fill='currentColor' {...props}>
    <Path d='M0 0h12v32H0zm20 0h12v32H20z' />
  </Svg>
)
