const { defaults } = require("pg");
const BaseController = require("./baseController");

class ListingsController extends BaseController {
  constructor(model, userModel) {
    super(model);
    this.userModel = userModel;
  }

  /** if a method in this extended class AND the base class has the same name, the one in the extended class will run over the base method */
  // Create listing. Requires authentication.
  async insertOne(req, res) {
    const {
      title,
      category,
      condition,
      price,
      description,
      shippingDetails,
      sellerEmail,
      sellerFirstName,
      sellerLastName,
      sellerPhone,
    } = req.body;
    try {
      // get authenticated user's email from request
      const authenticatedEmail = sellerEmail;
      // TODO: Get seller email from auth, query Users table for seller ID
      const [user, created] = await this.userModel.findOrCreate({
        where: { email: authenticatedEmail },
        defaults: {
          firstName: sellerFirstName,
          lastName: sellerLastName,
          phoneNum: sellerPhone,
          email: sellerEmail,
        },
      });

      // Create new listing
      const newListing = await this.model.create({
        title: title,
        category: category,
        condition: condition,
        price: price,
        description: description,
        shippingDetails: shippingDetails,
        buyerId: null,
        sellerId: user.id, // TODO: Replace with seller ID of authenticated seller = Retrieved user's ID
      });

      // Respond with new listing
      return res.json(newListing);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Retrieve specific listing. No authentication required.
  async getOne(req, res) {
    const { listingId } = req.params;
    try {
      const output = await this.model.findByPk(listingId);
      return res.json(output);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }

  // Buy specific listing. Requires authentication.
  async buyItem(req, res) {
    const { listingId } = req.params;
    const { buyerEmail, buyerFirstName, buyerLastName, buyerPhone } = req.body;
    try {
      // get authenticated user's email from request
      const authenticatedEmail = buyerEmail;
      const data = await this.model.findByPk(listingId);

      // TODO: Get buyer email from auth, query Users table for buyer ID
      const [user, created] = await this.userModel.findOrCreate({
        where: { email: authenticatedEmail },
        defaults: {
          firstName: buyerFirstName,
          lastName: buyerLastName,
          phoneNum: buyerPhone,
          email: buyerEmail,
        },
      });
      await data.update({ buyerId: user.id }); // TODO: Replace with buyer ID of authenticated buyer

      // Respond to acknowledge update
      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = ListingsController;
