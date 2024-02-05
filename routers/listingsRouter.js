const express = require("express");
const router = express.Router();

class ListingsRouter {
  constructor(controller, jwt) {
    this.controller = controller;
    this.jwt = jwt;
  }
  routes() {
    // we will insert routes into here later on
    router.get("/", this.controller.getAll.bind(this.controller));
    //auth for post
    router.post("/", this.jwt, this.controller.insertOne.bind(this.controller));
    router.get("/:listingId", this.controller.getOne.bind(this.controller));
    //auth for buying
    router.put(
      "/:listingId",
      this.jwt,
      this.controller.buyItem.bind(this.controller)
    );
    return router;
  }
}

module.exports = ListingsRouter;
