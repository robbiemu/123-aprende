import { Alert } from 'react-native'
import { Permissions, Notifications } from 'expo'
import AsyncStorage from '@callstack/async-storage'

import { handleNotification } from '@src/lib/APNs'

export async function registerForPushNotifications () {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS)

  if (status !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    if (status !== 'granted') {
      Alert.alert('received no permission to listen to APNs')
      return
    }
  }

  const expoToken = await Notifications.getExpoPushTokenAsync()
  Alert.alert('recieved permission to listen to APNs with token ' + expoToken)

  this.subscription = Notifications.addListener(handleNotification)

  this.setState({ expoToken })
  AsyncStorage.setItem('expoToken', expoToken)
}
