import config from '@src/config/css'

export const modalBaseStyle = {
  background: 'transparent',
  flex: 1
}

export const modalParentStyle = Object.assign({}, modalBaseStyle, {
  zIndex: 1000
})

export const modalTransparentStyle = Object.assign({}, modalBaseStyle)
