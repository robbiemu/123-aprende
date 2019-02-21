export default {
  appName: 'third-party-demo',
  appId: '***-app-id--type-uuid-**',
  logLevel: 'trace',
  states: {
    app: {
      uid: '',
      appid: '',
      appName: 'third-party-demo',
      deviceToken: '',
      bundleid: '**-bundle-id--type-namespace-**'
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
