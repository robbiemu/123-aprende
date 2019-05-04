# Third Party Demo

This thrd party demo is designed to illustrate how to utilize the Behavior-based Notifications app.

# Prerequisites

Before developiing the changes necessary to use BBN as a third party app, you should apply. This way you can see the costs and benefits up front, and have already arranged all of the prerequisite materials to be made available before you commit resources. Even if you are aware and certain you will begin service, it makes sense to wait through the application process before development, as many materials consequent to that process are required in advance.

# Specifications

* notify - the notification payload specification in an onOpen call to BBN
* metric - the metric payload to the firebase bbn backend
* app - the app document that must be configured during signup
* notifications - the notifications document that must be configured during signup
* models - the models document (and related model file) that may be configured during signup

# Patterns to implement

* [Signin and custom JWT](./custom_jwt.md)
* [generating an application metric](./metric.md)
* [openURL Linking](./linking.md)
* [Setting up push notifications](./push_notifications.md)
* [Using custom models](./using_custom_models.md)