const { auth } = require('express-oauth2-jwt-bearer')


// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
    audience: "https://carousell/api",
    issuerBaseURL: `https://dev-9o--f19k.us.auth0.com/`,
  });


module.exports = checkJwt