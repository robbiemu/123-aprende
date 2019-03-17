module.exports = {
  port () {
    switch (process.env['NODE_ENV']) {
      case 'production':
        return process.env.PORT || 80
      case 'TEST':
        return 8888
      case 'development':
      default:
        return 8080
    }
  },
  public: 'build',
  routes: ['/', '/callback', '/logout', '/home', '/page', '/activity']
}
