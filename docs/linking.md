# openURL Linking patterns

A third-party app is expected to interact with behavior-based notifications in a specific way when running on an iOS device. Until it has received a user_id from BBN, it must attempt to open the app with an application linking openURL call. Should this fail, it can be handled silently, or invite the user to install BBN with a friendly message. If it succeeds, it will need to include in openURL call a callback so that BBN can return the data. For this reason, we divide the document up into two patterns:

* Flow to BBN (calling bbn with openURL)
* Flow from BBN (receving an openURL call from BBN)

Our coverage of linking behavior is in _src/lib/Linking.js_ and related files (all named with _"linking"_, such as extensionLinking.hs in _src/lib/graphcool_).

We're using the term "linking" that react native uses, because the lack of any distinct term for openURL behavior in iOS is inconvenient. In case you are unfamiliar with this process, here are some backgorund links:

* [openURL(_:)](https://developer.apple.com/documentation/uikit/uiapplication/1648685-openurl?language=objc) [developer.apple.com]
* [Working with URL Schemes in iOS Apps](https://www.appcoda.com/working-url-schemes-ios/) [appcoda]
* [Linking](https://facebook.github.io/react-native/docs/linking) [facebook's react native]
* [Linking](https://docs.expo.io/versions/latest/workflow/linking/) [expo]

## Prerequisites

You will need an app_id and the appname we registered for our app, assigned to the app during initial adminsitrative setup. You will need to configure your notification for APN/push notification callback. _see [push notifications](push_notifications.md)._ This includes configuring the app's _notification_ document during initial signup for the app with BBN.

You will need to give your app permissions to openURL and to receive openURL calls - this requires registering your app's url scheme. (see [iOS Custom URL Scheme](https://coderwall.com/p/mtjaeq/ios-custom-url-scheme))

## Flow to BBN

### Identify where to add an openURL call

First, identify where to insert this functionality. You do not need to open BBN on the device if you already have a identified the BBN service to receive the user_id. Additionally, you may want to call this for your own purposes in can you have the user_id but have not yet associated it with this appication on the device. This will allow the user to see your app in the graph of metric and lcoation data in BBN on the current device, as well as any other devices associated to the user_id. To allow this, a device_token is also issued in the callback.

Locate during application launch where you get the user_id from app state. Insert a check to see if it is set. Optionally, also check to see if a device tooken that you have generated is associated with any devicetokens you have already received. This sort of data should come from user session data. 

In the flow of session initialization, a good location is likely just after the following:

1. initial app load
2. session detection
3. session initialization
4. backend session user info retrieved

In our app, this is done in _relayBBNToGraphcool_ from _relayAuthToGraphcool_ called in App,  .. ultimately calling _register_ in Linking when it is not set up.

### Conditionally call openURL to BBN

Relatively speaking, this is pretty simple. The URI we need to call is:

```
`bbn://register?appname=${
  config.appName
}&notify=${notify}&callback=${uri}?action=${
  config.constants.urls.connectionDetails
}&appid=${appid}`
```

* _appname_ is the name we have registered for our app.
* _appid_ is the app_id associated with the app.
* _callback_ specifies the callback we url when the user acknowledges the app is associated to the BBN in bbn (once the user permits this to start, it will call openURL to return the user back to your app)
* _notify_ specifies how we wish to recieve push notifications.

_callback_ specifies _our_ app URL: it will be similar to the above but just needs to be a callback endpoint like "appname://connection_details". In our case, we assign a parameter to require in addition to the other parameters that we will recieve: _action_ is the registration event we are sending to BBN. It must be "connectionDetails".

_notify_ specifies how we want to be notified. It is a json specification. At a minimum, it includes 

```
{
  token: 'open APN device token'
}
```

_see also [specifications/notify](./specifications/notify.md)_

## Flow from BBN

So now that we have triggered a call to openURL, we need to receive and process the callback.

First, register a listener onOpenURL. This should be done in the AppDelegate, or immediately when the app is opened for non-iOS-native code (ie, react-native). This way, when the app if first brought to the foreground it will already have an active listener. 

The callback will recieve a url with queryparameters:

* token - the devicetoken that bbn generates for this device
* bundle - the bbn bundle identifier
* uid - the user id

The _bundle_ is provided as a sanity check you can use to ensure the callback is coming from he right place before processing it.

The _token_ can optionally be associated with a device token you generate separately to ensure that that the curent device is regisered with BBN.

The _uid_ is the user_id that BBN associates with the current user.

Our listener will recevie all calls to our app's URL, so we will need to process this data only after indentifying the callback (based on the specific URI in the callback).

These values should be added to the user session details and saved remotely so it can be interrogated on new devices as well as refreshed on existing installations.
