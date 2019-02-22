export default {
  appName: 'uno-dos-tres-aprende',
  appScheme: 'uno-dos-tres', // 'expo'
  appId: 'a1b2c3d4-5555-6e7f-0000-9a8b7a605000',
  logLevel: 'trace',
  states: {
    app: {
      uid: '',
      appid: '',
      appName: '1,2,3 Aprende',
      deviceToken: '',
      bundleid:
        'edu.harvard.thesis.behavior-based-notifications.third-party-demo'
    },
    firebase: {
      appData: {
        path: 'sampleData/apps/'
      }
    }
  },
  constants: {
    state: {
      app: {
        SET_APPDATA: 'SET_APPDATA'
      },
      firebase: {
        EDIT_APPDATA_PATH: 'EDIT_APPDATA_PATH'
      }
    },
    messages: {
      IOS_TOKEN_UNAVAILABLE:
        'Token unavailable (must log in once on iOS to get your settings)',
      LOADING: 'Loading...',
      AUTHENTICATING: 'Authenticating...'
    },
    urls: {
      connectionDetails: 'connectionDetails'
    },
    bbn: {
      connectionDetails: {
        bundle: 'bundleId',
        app: 'appId',
        uid: 'uid',
        token: 'deviceToken'
      }
    },
    graphcool: {
      user_id: 'user_id'
    }
  }
}
