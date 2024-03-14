const cors = require("cors");
const express = require("express");
require("dotenv").config();
const { auth, requiredScopes } = require("express-oauth2-jwt-bearer");

const checkJwt = auth({
  audience: "http://carousell/api",
  issuerBaseURL: `https://localhost:3000`,
});

const checkScopes = requiredScopes("read:messages");

// importing Routers
const ListingsRouter = require("./routers/listingsRouter");

// importing Controllers
const ListingsController = require("./controllers/listingsController");

// importing DB
const db = require("./db/models/index");
const { listing, user } = db;

// initializing Controllers -> note the lowercase for the first word
const listingsController = new ListingsController(listing, user, checkJwt);

// inittializing Routers
const listingsRouter = new ListingsRouter(listingsController).routes();

const PORT = process.env.PORT;
const app = express();

// Enable CORS access to this server
app.use(cors());

// Enable reading JSON request bodies
app.use(express.json());

// enable and use router
app.use("/listings", listingsRouter);

app.get("/api/private", checkJwt, checkScopes, (req, res) => {
  res.json({
    message:
      "Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.",
  });
});

app.get("/api/public", function (req, res) {
  res.json({
    message:
      "Hello from a public endpoint! You don't need to be authenticated to see this.",
  });
});

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
