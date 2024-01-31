const cors = require('cors')
const express = require('express')
require('dotenv').config();
const { auth } = require('express-oauth2-jwt-bearer');

// importing Routers
const ListingsRouter = require('./routers/listingsRouter')

// importing Controllers
const ListingsController = require('./controllers/listingsController')

// importing DB
const db = require('./db/models/index')
const { listing, user } = db;

//auth
const jwtCheck = auth({
  audience:process.env.AUTH_AUDIENCE,
  issuerBaseURL:process.env.AUTH_ISSUER_BASE_URL,
	tokenSigningAlg:"RS256",
});

// initializing Controllers -> note the lowercase for the first word
const listingsController = new ListingsController(listing, user)

// inittializing Routers
const listingsRouter = new ListingsRouter(jwtCheck,listingsController).routes()

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
