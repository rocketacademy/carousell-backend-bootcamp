const cors = require('cors');
const express = require('express');
const { auth } = require('express-oauth2-jwt-bearer');

require('dotenv').config();

const PORT = process.env.PORT;
const app = express();

const checkJwt = auth({
  audience: process.env.API_AUDIENCE,
  issuerBaseURL: process.env.API_ISSUERBASEURL,
});


// importing DB
const db = require('./db/models/index')
const { listing, user } = db;

// importing Controllers
// initializing Controllers -> note the lowercase for the first word
const ListingsController = require('./controllers/listingsController')
const listingsController = new ListingsController(listing, user)

// importing Routers
// initializing Routers
const ListingsRouter = require('./routers/listingsRouter')
const listingsRouter = new ListingsRouter(
  listingsController,
  checkJwt
).routes();

// Enable CORS access to this server
app.use(cors());

// Enable reading JSON request bodies
app.use(express.json());

// enable and use router
app.use('/listings', listingsRouter)

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});