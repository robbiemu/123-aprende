export default {
  native: {
    domain: '**-auth0-domain--type-fqurl@auth0.com-**',
    connect: {
      client_id: '**-auth0.clientid-**',
      redirect_uri: '**-redirect-url-for-auth0-rn-callback-**',
      response_type: 'token id_token',
      scope: 'openid profile email'
      //        audience: '**-auth0-domain--type-fqurl@auth0.com-**/userinfo'
    }
  },
  web: {
    connect: {
      domain: '**-auth0-domain--type-url@auth0.com-**',
      clientID: '**-auth0.clientid-**',
      redirectUri: '**-redirect-url-for-auth0-rnw-callback-**',
      responseType: 'token id_token',
      scope: 'openid profile email'
    }
  }
}
