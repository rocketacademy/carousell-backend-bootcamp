const BaseController = require("./baseController");

class ListingsController extends BaseController {
  constructor(model, userModel) {
    super(model);
    this.userModel = userModel;
  }

  async insertOne(req, res) {
    const {
      title,
      category,
      condition,
      price,
      description,
      shippingDetails,
      email,
    } = req.body;

    try {
      // Check user ID
      const [user] = await this.userModel.findOrCreate({
        where: { email: email },
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
        sellerId: user.dataValues.id,
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
    const { email } = req.body;
    console.log(email);
    try {
      // Find listing
      const data = await this.model.findByPk(listingId);

      // Find or create user
      const [user] = await this.userModel.findOrCreate({
        where: { email: email },
      });

      // Update listing
      const updatedListing = await data.update({
        buyerId: user.dataValues.id,
      });

      // Respond with updated listing
      return res.json(updatedListing);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = ListingsController;
