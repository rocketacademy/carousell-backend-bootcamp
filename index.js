const cors = require('cors');
const express = require('express');
require('dotenv').config();

const { auth } = require('express-oauth2-jwt-bearer');

// Authorization middleware. When used, the Access Token must

// exist and be verified against the Auth0 JSON Web Key Set.

const checkJwt = auth({
  audience: process.env.AUDIENCE,

  issuerBaseURL: process.env.ISSUER_BASE_URL,
});

// importing Routers
const ListingsRouter = require('./routers/listingsRouter');

// importing Controllers
const ListingsController = require('./controllers/listingsController');

// importing DB
const db = require('./db/models/index');

const { listing, user } = db;

// initializing Controllers -> note the lowercase for the first word
const listingsController = new ListingsController(listing, user);

// initializing Routers
const listingsRouter = new ListingsRouter(
  listingsController,
  checkJwt
).routes();

const PORT = process.env.PORT;
const app = express();

// Enable CORS access to this server
app.use(cors());

// Enable reading JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// enable and use router
app.use('/listings', listingsRouter);

// This route doesn't need authentication

app.get('/api/public', function (req, res) {
  res.json({
    message:
      "Hello from a public endpoint! You don't need to be authenticated to see this.",
  });
});

// This route needs authentication

app.get('/api/private', checkJwt, function (req, res) {
  res.json({
    message:
      'Hello from a private endpoint! You need to be authenticated to see this.',
  });
});

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
