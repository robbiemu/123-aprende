import { Permissions, Notifications } from 'expo'

export async function registerForPushNotifications (inConstructor) {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS)

  if (status !== 'granted') {
    console.log('APNtoken status ', status)
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS)
    console.log('APNtoken status ', status)
    if (status !== 'granted') {
      return
    }
  }

  const APNtoken = await Notifications.getExpoPushTokenAsync()

  console.log('APNtoken', APNtoken)

  this.subscription = Notifications.addListener(handleNotification)

  if (!inConstructor) this.setState({ APNtoken })
  else this.state.APNtoken = APNtoken
}

export async function handleNotification () {
  console.log('arguments', arguments)
}
