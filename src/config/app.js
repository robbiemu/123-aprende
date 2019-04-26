import secret from './private'

export default {
  appName: 'uno-dos-tres-aprende',
  appTags: ['123Aprende', 'spring2019'],
  appScheme: 'uno-dos-tres', // 'expo'
  appId: secret.appId, // uuid app fingerprint
  appHome: '/home',
  appRoot: '/',
  logLevel: 'trace',
  states: {
    app: {
      uid: '',
      appid: '',
      appName: 'Uno, Dos, Tres, Aprende',
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
      }
    },
    graphcool: {
      user_id: 'user_id',
      progress: 'progress',
      HOME_PAGE_ID: 'cjtj9dw7t8rcj0136xycoxoon',
      RESOURCES_PAGE_ID: 'cju7a82ry9h2a0136lqq4yjgn',
      REQUIREMENTS_PAGE_ID: 'cju79kmlq9h210136evnynihm',
      MASTER_LIST_ID: 'cjtnp665i8uls0136ncn02tdp'
    },
    drawer: {
      index: {
        logout: 'logout',
        bbn: 'bbn'
      },
      items: [{ id: 'logout', label: 'logout' }]
    },
    cards: {
      forward: 'forward',
      backward: 'backward',
      faces: {
        false: 'es',
        true: 'en'
      }
    },
    pages: {
      types: {
        Page: 'Page',
        Lesson: 'Lesson'
      }
    },
    activities: {
      types: {
        Activity: 'Activity',
        VocabularyPairs: 'VocabularyPairs',
        VideoSubmission: 'VideoSubmission',
        AudioSubmission: 'AudioSubmission'
      },
      VocabularyPairs: {
        review: 'review',
        quiz: 'quiz',
        test: 'test',
        memoryGame: 'memoryGame',
        list: 'list'
      },
      AudioSubmission: {
        soundcloud_base_uri: 'https://soundcloud.com/'
      },
      LIST: '...at a glance',
      OPEN_ON_SOUNDCLOUD: 'open on SoundCloud',
      VIDEOSUBMISSION: 'Video Submission',
      AUDIOSUBMISSION: 'Audio Submission'
    }
  },
  routes: ['activity', 'page', 'home', 'override', 'splash']
}
