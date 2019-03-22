import secret from './private'

export default {
  appName: 'uno-dos-tres-aprende',
  appScheme: 'uno-dos-tres', // 'expo'
  appId: secret.appId, // uuid app fingerprint
  logLevel: 'trace',
  states: {
    app: {
      uid: '',
      appid: '',
      appName: '1,2,3 Aprende',
      deviceToken: '',
      bundleid: secret.bundleId // your app's bundleId
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
      },
    },
    cards: {
      forward: 'forward',
      backward: 'backward',
      faces: {
        false: 'es',
        true: 'en'
      }
    },
    activities: {
      types: {
        Activity: 'Activity',
        VocabularyPairs: 'VocabularyPairs',
        VideoSubmission: 'VideoSubmission',
        AudioSubmission: 'AudioSubmission'
      },
      VocabularyPairs:  {
        review: 'review',
        quiz: 'quiz',
        test: 'test',
        memoryGame: 'memoryGame',
        list: 'list',
      }
    },
    graphcool: {
      user_id: 'user_id'
    }
  },
  routes: ['/activity', '/page', '/home', '/override']
}
