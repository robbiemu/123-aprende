export const modalBaseStyle = {
  background: 'transparent',
  position: 'fixed',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
}

export const modalParentStyle = Object.assign({}, modalBaseStyle,{
  zIndex: 1000
})

export const modalTransparentStyle = Object.assign({}, modalBaseStyle)