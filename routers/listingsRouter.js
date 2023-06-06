const express = require("express");
const router = express.Router();
const { auth } = require("express-oauth2-jwt-bearer");
const checkJwt = auth();
class ListingsRouter {
  constructor(controller) {
    this.controller = controller;
  }
  routes() {
    // we will insert routes into here later on
    router.get("/", this.controller.getAll.bind(this.controller));
    router.post("/", checkJwt, this.controller.insertOne.bind(this.controller));
    router.get("/:listingId", this.controller.getOne.bind(this.controller));
    router.put(
      "/:listingId",
      checkJwt,
      this.controller.buyItem.bind(this.controller)
    );
    return router;
  }
}

module.exports = ListingsRouter;
