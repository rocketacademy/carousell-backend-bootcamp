const cors = require('cors')
const express = require('express')
require('dotenv').config(); // Load the .env variables

/////////////////////////////////////
//importing middleware - START
/////////////////////////////////////
const { auth } = require('express-oauth2-jwt-bearer');

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
    audience: process.env.AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
  });
/////////////////////////////////////
//importing middleware - END
/////////////////////////////////////


// importing Routers
const ListingsRouter = require('./routers/listingsRouter')

// importing Controllers
const ListingsController = require('./controllers/listingsController')

// importing DB
const db = require('./db/models/index')
const { listing, user } = db;

// initializing Controllers -> note the lowercase for the first word
const listingsController = new ListingsController(listing, user)

// inittializing Routers
//check the Access Token’s scopes for a specific route
const listingsRouter = new ListingsRouter(listingsController,checkJwt).routes() 

const PORT = process.env.PORT;
const app = express();

// Enable CORS access to this server
app.use(cors());

// Enable reading JSON request bodies
app.use(express.json());

// enable and use router
app.use('/listings', listingsRouter)

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
