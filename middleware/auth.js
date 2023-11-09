const { auth } = require("express-oauth2-jwt-bearer");

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: "https://carousell/api",
  issuerBaseURL: `https://dev-4rxclp7pj6nst5op.us.auth0.com/`,
  // tokenSigningAlg: "RS256",
});

module.exports = checkJwt;
