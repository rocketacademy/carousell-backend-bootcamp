const cors = require("cors");
const express = require("express");
const { auth, requiredScopes } = require("express-oauth2-jwt-bearer");
require("dotenv").config();

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
const listingsRouter = new ListingsRouter(listingsController).routes();

const PORT = process.env.PORT;
const app = express();

// Enable CORS access to this server
app.use(cors());

// Enable reading JSON request bodies
app.use(express.json());

// Create auth0 instance
const checkJWT = auth({
  audience: process.env.AUDIENCE,
  issuerBaseURL: process.env.ISSUER_BASE_URL,
  tokenSigningAlg: "RS256",
});
// const checkScopes = requiredScopes("read:messages");

// enable and use router
app.use("/listings", listingsRouter);

app.get("/api/private", checkJWT, (req, res) => {
  res.json({ message: `Hello private user!` });
});

app.get("/api/public", (req, res) => {
  res.json({ message: `Hello public user!` });
});

app.listen(PORT, () => {
  console.log(`Express app listening on port ${PORT}!`);
});
