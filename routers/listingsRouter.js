const express = require("express");
const { auth } = require("express-oauth2-jwt-bearer");
const router = express.Router();

class ListingsRouter {
  constructor(controller) {
    this.controller = controller;
  }
  checkJWT = auth({
    audience: process.env.AUDIENCE,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    tokenSigningAlg: "RS256",
  });
  routes() {
    // we will insert routes into here later on
    router.get("/", this.controller.getAll.bind(this.controller));
    router.post(
      "/",
      this.checkJWT,
      this.controller.insertOne.bind(this.controller)
    );
    router.get("/:listingId", this.controller.getOne.bind(this.controller));
    router.put(
      "/:listingId",
      this.checkJWT,
      this.controller.buyItem.bind(this.controller)
    );
    return router;
  }
}

module.exports = ListingsRouter;
