const cors = require("cors");
const express = require("express");
const { auth } = require("express-oauth2-jwt-bearer");
require("dotenv").config();

// middleware for Auth0:
const checkJwt = auth({
  audience: "https://carousell/api/reuben",
  issuerBaseURL: `https://dev-uun7isc4ev72mwao.us.auth0.com/`,
});

// importing Routers
const ListingsRouter = require("./routers/listingsRouter");

// importing Controllers
const ListingsController = require("./controllers/listingsController");

// importing DB
const db = require("./db/models/index");
const { listing, user } = db;

// initializing Controllers -> note the lowercase for the first word
const listingsController = new ListingsController(listing, user);

// inittializing Routers
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

// Auth0 Route that requires authentication:
app.get("/api/private", checkJwt, function (req, res) {
  res.json({
    message:
      "Hello from a private endpoint! You need to be authenticated to see this.",
  });
});

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
