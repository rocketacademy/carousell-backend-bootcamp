const BaseController = require("./baseController");

class ListingsController extends BaseController {
  constructor(model, userModel) {
    super(model);
    this.userModel = userModel;
  }

  /** if a method in this extended class AND the base class has the same name, the one in the extended class will run over the base method */
  // Create listing. Requires authentication.
  async insertOne(req, res) {
    const { title, category, condition, price, description, shippingDetails } =
      req.body;
    try {
      // TODO: Get seller email from auth, query Users table for seller ID
      const [seller] = await this.userModel.findOrCreate({
        where: {
          email: req.body.sellerEmail,
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
        sellerId: seller.id, // TODO: Replace with seller ID of authenticated seller
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
    try {
      const data = await this.model.findByPk(listingId);

      // TODO: Get buyer email from auth, query Users table for buyer ID
      const [buyer] = await this.userModel.findOrCreate({
        where: {
          email: req.body.buyerEmail,
        },
      });

      // Update listing to reference buyer's user ID
      await data.update({ buyerId: buyer.id });

      // Respond to acknowledge update
      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }
  async buyCancel(req, res) {
    const { listingId } = req.params;

    try {
      const data = await this.model.findByPk(listingId);

      const [buyer] = await this.userModel.findOrCreate({
        where: {
          email: req.body.buyerEmail,
        },
      });
      if (data.buyerId === buyer.id) {
        // Update listing to reference buyer's user ID
        await data.update({ buyerId: null });
        return res.json(data);
      } else {
        return res
          .status(403)
          .json({ error: true, msg: "Buyer IDs do not match" });
      }
    } catch (err) {
      return res.status(400).json({ error: true, msg: err.message });
    }
  }
}

module.exports = ListingsController;
