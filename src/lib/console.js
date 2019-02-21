import config from '@src/config/app'
import Logger from '@src/lib/Logger'

const logger = new Logger()

logger.setLevel(config.logLevel || Logger.levels.DEFAULT)
logger.format = function (level, message) {
  return `${level} [${config.appName}:${this.preface}] ${message}`
}
logger.setPreface = function (preface) {
  this.preface = preface
}

export default logger
