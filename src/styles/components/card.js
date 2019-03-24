export const cardStyle = {
  /* golden ratio card dim */
  width: 2 * 100,
  height: 2 * 161.8,
  backgroundColor: '#fafafa',
  borderRadius: 8
}

export const cardContentStyle = {
  flex: 1,
  justifyContent: 'center',
  alignItems: 'center'
}

const textInput = {
  height: 48,
  maxHeight: 48,
  width: 168,
  flex: 1,
  fontSize: '16pt',
}

export const cardTextInputStyle = Object.assign({}, textInput, {
  autoFocus: true,
  autoCapitalize: 'none',
  paddingHorizontal: 16
})

export const cardNativeTextInputStyle = Object.assign({}, textInput,{
  borderRadius: 3,
  marginTop: 8,
  borderWidth: '1pt',
  borderColor: 'grey',
  padding: 16
})
