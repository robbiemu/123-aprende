import { Platform } from 'react-native'

export default class Logger {
  static levels = {
    DEFAULT: 'log',
    TRACE: 'trace',
    INFO: 'info',
    LOG: 'log',
    WARN: 'warn',
    ERROR: 'error'
  }
  static orderedLevels = ['trace', 'info', 'log', 'warn', 'error']

  _reports (level) {
    return (
      Logger.orderedLevels.indexOf(level) >=
      Logger.orderedLevels.indexOf(this.level)
    )
  }

  constructor () {
    this.level = Logger.levels.DEFAULT
  }

  format (level, message) {
    return `${level} ${message}`
  }

  setLevel (level) {
    this.level = level
  }

  trace () {
    if (!this._reports(Logger.levels.TRACE)) return

    let messages = [...arguments]
    messages[0] = this.format(Logger.levels.TRACE, messages[0])

    Platform.OS === 'ios' ? console.log(...messages) : console.log(...messages)
  }

  info () {
    if (!this._reports(Logger.levels.INFO)) return

    let messages = [...arguments]
    messages[0] = this.format(Logger.levels.INFO, messages[0])

    console.info(...messages)
  }

  log () {
    if (!this._reports(Logger.levels.LOG)) return

    let messages = [...arguments]
    messages[0] = this.format(Logger.levels.LOG, messages[0])

    console.log(...messages)
  }

  warn () {
    if (!this._reports(Logger.levels.WARN)) return

    let messages = [...arguments]
    messages[0] = this.format(Logger.levels.WARN, messages[0])

    console.warn(...messages)
  }

  error () {
    if (!this._reports(Logger.levels.ERROR)) return

    let messages = [...arguments]
    messages[0] = this.format(Logger.levels.ERROR, messages[0])

    Platform.OS === 'ios'
      ? console.log(...messages)
      : console.error(...messages)
  }
}
