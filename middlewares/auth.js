const { auth } = require('express-oauth2-jwt-bearer')

const checkJwt = auth({
    audience: "https://carousell/api",
    issuerBaseURL: `https://dev-9o--f19k.us.auth0.com/`,
  });


module.exports = checkJwt