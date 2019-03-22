module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        '@babel/plugin-proposal-class-properties',
        {
          loose: false
        }
      ],

      [
        'module-resolver',
        {
          alias: {
            '@src': './src',
            '@styles': './src/styles'
          }
        }
      ]
    ]
  }
}
