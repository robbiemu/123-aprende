import secret from './private'

export default {
  native: {
    domain: secret.auth0.rn_domain,
    connect: {
      client_id: secret.auth0.clientId,
      redirect_uri: secret.auth0.rn_callback,
      response_type: 'token id_token',
      scope: 'openid profile email'
      //        audience: '**-auth0-domain--type-fqurl@auth0.com-**/userinfo'
    }
  },
  web: {
    connect: {
      domain: secret.auth0.rnw_domain,
      clientID: secret.auth0.clientId,
      redirectUri: secret.auth0.rnw_callback,
      responseType: 'token id_token',
      scope: 'openid profile email'
    }
  }
}
