module.exports = {
  port () {
    switch (process.env['NODE_ENV']) {
      case 'production':
        return process.env.PORT || 80
      case 'TEST':
        return 8888
      case 'development':
      default:
        return 3000
    }
  },
  public: 'build'
}
