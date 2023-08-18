const cors = require("cors");
const express = require("express");
const { auth } = require("express-oauth2-jwt-bearer");

require("dotenv").config();

// importing DB
const db = require("./db/models/index");
const { listing, user } = db;

const PORT = process.env.PORT;
const app = express();

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: "https://carousell/api",
  issuerBaseURL: `https://dev-jg0bahnmapfmuy3a.us.auth0.com/`,
});

// importing Controllers
// initializing Controllers -> note the lowercase for the first word
const ListingsController = require("./controllers/listingsController");
const listingsController = new ListingsController(listing, user);

// importing Routers
// inittializing Routers
const ListingsRouter = require("./routers/listingsRouter");
const listingsRouter = new ListingsRouter(
  listingsController,
  checkJwt
).routes();

// Enable reading JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Enable CORS access to this server
app.use(cors());

// enable and use router
app.use("/listings", listingsRouter);

app.use("/", (req, res) => {
  res.send("Incorrect path");
});

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
