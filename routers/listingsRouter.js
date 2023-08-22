const express = require('express')
const router = express.Router()
const { auth } = require("express-oauth2-jwt-bearer");

// Authorization middleware. When used, the Access Token must
// exist and be verified against the Auth0 JSON Web Key Set.
const checkJwt = auth({
  audience: "https://carousell/api",
  issuerBaseURL: `https://dev-cq6rsxn01ib3224k.au.auth0.com/`,
});

class ListingsRouter {
    constructor(controller){
        this.controller = controller
    }
    routes(){
        // we will insert routes into here later on
        router.get('/', this.controller.getAll.bind(this.controller))
        router.post('/', checkJwt, this.controller.insertOne.bind(this.controller))
        router.get('/:listingId', this.controller.getOne.bind(this.controller))
        router.put('/:listingId/buy', checkJwt, this.controller.buyItem.bind(this.controller))
        return router
    }
}

module.exports = ListingsRouter