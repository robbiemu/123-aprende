export default {
  native: {
    domain: 'https://third-party-demo.auth0.com',
    connect: {
      client_id: 'GuAJ72Ic23OWUad5sPaUGaLMdgu8qThf',
      redirect_uri: 'https://auth.expo.io/@robertotomas/expo-rnw-paper',
      response_type: 'token id_token',
      scope: 'openid profile email'
      //        audience: 'https://third-party-demo.auth0.com/userinfo'
    }
  },
  web: {
    connect: {
      domain: 'third-party-demo.auth0.com',
      clientID: 'GuAJ72Ic23OWUad5sPaUGaLMdgu8qThf',
      redirectUri: 'http://localhost:3000/callback',
      responseType: 'token id_token',
      scope: 'openid profile email'
    }
  }
}
