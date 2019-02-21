import React from 'react'
import ReactDom from 'react-dom'

import App from './App'

import '@styles/app.scss'
import '@src/lib/polys'

ReactDom.render(<App />, document.getElementById('react-native-web-app'))
