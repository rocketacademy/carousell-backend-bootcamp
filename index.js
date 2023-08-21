const cors = require("cors");
const express = require("express");
require("dotenv").config();

// importing DB
const db = require("./db/models/index");

const { auth } = require("express-oauth2-jwt-bearer");

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: "https://carousell/api",
  issuerBaseURL: `https://dev-kx74c48sk3s6nw7i.us.auth0.com/`,
});

const { listing, user } = db;
// importing controllers
// initializing Controllers -> note the lowercase for the first word
const ListingsController = require("./controllers/listingsController");
const listingsController = new ListingsController(listing, user);
// importing routers
// inittializing Routers
const ListingsRouter = require("./routers/listingsRouter");
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

// enable and use router
app.use("/listings", listingsRouter);

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
