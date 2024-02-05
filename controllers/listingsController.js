const BaseController = require("./baseController");

class ListingsController extends BaseController {
  constructor(model, userModel) {
    super(model);
    this.userModel = userModel;
  }

  /** if a method in this extended class AND the base class has the same name, the one in the extended class will run over the base method */
  // Create listing. Requires authentication.
  async insertOne(req, res) {
    console.log(`body`, req.body);
    const {
      category,
      condition,
      description,
      email,
      price,
      shippingDetails,
      title,
    } = req.body;
    try {
      console.log("enter", email);
      // TODO: Get seller email from auth, query Users table for seller ID
      const sellerId = await this.userModel.findOrCreate({
        where: {
          email: email,
        },
      });
      console.log(`seller`, sellerId);

      const sellerUser = sellerId[0];
      const sellerIdValue = sellerUser.dataValues.id;

      // Create new listing
      const newListing = await this.model.create({
        title: title,
        category: category,
        condition: condition,
        price: price,
        description: description,
        shippingDetails: shippingDetails,
        buyerId: null,
        sellerId: sellerIdValue,
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
    console.log(`id`, listingId);
    const { email } = req.body;
    console.log(`email`, email);
    try {
      const data = await this.model.findByPk(listingId);
      console.log(`WOW data`, data);

      // TODO: Get buyer email from auth, query Users table for buyer ID
      const buyerId = await this.userModel.findOrCreate({
        where: {
          email: email,
        },
      });
      console.log(`we got here`, buyerId);
      const buyerUser = buyerId[0];
      const buyerIdValue = buyerUser.dataValues.id;

      await data.update({
        buyerId: buyerIdValue,
      }); // TODO: Replace with buyer ID of authenticated buyer
      console.log("buyer", buyerId);
      // Respond to acknowledge update
      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = ListingsController;
