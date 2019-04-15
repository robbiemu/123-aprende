import { Alert } from 'react-native'

export async function handleNotification () {
  Alert.alert(JSON.stringify(arguments))
  console.log('arguments', arguments)
}
