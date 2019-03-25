import { pageContainerStyle } from '@src/styles/components/page'

const baseStyle = {
  flex: 1
}

export const listStyle = Object.assign({}, baseStyle, pageContainerStyle)

export const listTouchableStyle = Object.assign({}, baseStyle,{
  justifyContent: 'center',
  alignItems: 'center'
})
