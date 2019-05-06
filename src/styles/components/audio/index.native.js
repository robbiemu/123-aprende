import { vw } from 'react-native-expo-viewport-units'

export const playerStyle = {
  alignItems: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.063)',
  borderRadius: 3,
  color: 'rgb(255, 65, 54)',
  display: 'flex',
  flexDirection: 'row',
  fontFamily: 'Avenir Next',
  fontSize: 16,
  minHeight: 35,
  maxHeight: 102,
  lineHeight: 24,
  marginBottom: 0,
  marginTop: 8,
  padding: 8,
  flex: 1
}

export const bodyContainerStyle = {
  lineHeight: 0,
  width: vw(100) - 124
}

export const playButtonStyle = {
  backgroundColor: 'rgb(252, 86, 30)',
  borderColor: 'white',
  borderRadius: '50%',
  borderStyle: 'solid',
  borderWidth: 1,
  color: 'white',
  display: 'flex',
  height: 58,
  marginRight: 16,
  paddingTop: 5,
  width: 58,
  zIndex: 2
}

export const rangeStyle = {
  backgroundColor: 'rgba(0, 0, 0, 0)',
  // color: 'rgb(144, 144, 144)',
  display: 'flex',
  height: 3.1875,
  marginBottom: 16,
  marginLeft: 2,
  marginRight: 2,
  marginTop: 16,
  padding: 0,
  width: 96
}

export const artistTitleStyle = {
  color: 'rgb(0, 31, 63)',
  display: 'flex',
  fontFamily: 'Avenir Next',
  fontSize: 16,
  fontWeight: '700',
  height: 20,
  maxWidth: vw(100) - 128,
  flexWrap: 'wrap',
  lineHeight: 20,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  marginTop: 0
}
