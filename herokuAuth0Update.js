var ManagementClient = require('auth0').ManagementClient;
var management = new ManagementClient({
  domain: 'third-party-demo.auth0.com',
  clientId: `${process.env.AUTH0_CLIENT_ID}`,
  clientSecret: `${process.env.AUTH0_CLIENT_SECRET}`,
  scope: 'read:client_keys update:client_keys'
});

management.getClient({ client_id: process.env.AUTH0_CLIENT_ID }, function (err, client) {
  if (err) {
    return console.log(err)
  }

  callbacks = client.callbacks
  callbacks.map(uri => {
    if(new Regexp(process.env.HEROKU_HOSTNAME).test(uri)) {
      uri = `${process.env.HEROKU_URL}:${process.env.PORT}`
    }
    return uri
  })

  var data = { callbacks };
  var params = { client_id: process.env.AUTH0_CLIENT_ID };

  management.client.update(params, data, function (err, client) {
    if (err) {
      return console.log(err)
    }

    console.log(client.callbacks)
  });
});
