# Signin and Custom JWT

Our backend firebase interface is deisnged to allow authorized third parties to write data to some tables related to their app. In this way you can report the metric calculated for the user. Your app must generate the JWT for the user as a custom JWT, with the app_id given to you in the claim. 

_If you need to read up on jwt or test your generated payload, see [jwt.io](https://jwt.io)._

## Prerequisites

The app_id and _firebase-service-credentials.json_ will be generated for you when you sign up to use Behavior-based Notifications. You will also need to be handing linking to get the uid fo he user from Behavior-based notifications (see the related document on how to implement linking openURL).

### Note on Security

You will be handling three distinct pieces of secure information. Two of them will be in the code itself (the app_id and the firebase credentials) and need to be excluded from your git repository using _.gitignore_. The other is the user_id from Behavior-based notifications, which simply requires being sure not to expose the data to external apps.

## Pattern

An example of this is in the backend repo for this project: [third-party-graphcool](https://github.com/robbiemu/third-party-graphcool). In this case, we use a custom resolver to allow the graphcool backend to generate the JWT for us. This resolver is in the folder `src/resolvers/FirebaseToken`.

Here, we use the normal `firebase-admin` package to generate the token.

### Custom claim

We create a custom claim payload to add to our jwt in the file `custom-token-claims.js`. This must list the app_id as _appid_ (no underscore):

```
export default {
  appid: 'MY_APP_ID'
}
```

### Firebase credentials

We also load the firebase credentials in a file in the project.

### Creating the custom token

We then attach the call to `FirebaseAdmin.auth().createCustomToken()` to the user_id of the user. This is the user id generated during callback from onOpen Linking with the Behavior-based notifications (see the related document on how to implement linking openURL).

These pieces are all ttied together in our service (resolver) at grahpcool:

```
var FirebaseAdmin = require('firebase-admin')
var serviceAccount = require('./firebase-service-credentials.json')
var claims = require('./custom-token-claims')

let credential = FirebaseAdmin.credential.cert(serviceAccount)
FirebaseAdmin.initializeApp({ credential })

const generateTokenWithPayload = async id => {
  try {
    const token = await FirebaseAdmin.auth().createCustomToken(id, claims)

    return { data: { token } }
  } catch (err) {
    return { error }
  }
}

module.exports = async event =>
  await generateTokenWithPayload(event.data.userIdentifier)
```