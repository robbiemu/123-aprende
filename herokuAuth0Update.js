var ManagementClient = require('auth0').ManagementClient;
var management = new ManagementClient({
  domain: 'third-party-demo.auth0.com',
  clientId: `${process.env.AUTH0_CLIENT_ID}`,
  clientSecret: `${process.env.AUTH0_CLIENT_SECRET}`,
  scope: 'read:client_keys update:client_keys'
});

var params = { client_id: process.env.AUTH0_123_CLIENT_ID }

management.getClient(params, function (err, client) {
  if (err) {
    return console.log(err)
  }

  callbacks = client.callbacks
  callbacks.forEach((uri, i) => {
    if(new RegExp(process.env.HEROKU_HOSTNAME).test(uri)) {
      callbacks[i] = `${process.env.HEROKU_URL}:${process.env.PORT}/callback`
    }
    return uri
  })

  var data = { callbacks }

  management.updateClient(params, data, function (err, client) {
    if (err) {
      return console.log(err)
    }

    console.log(client.callbacks)
  })
})
