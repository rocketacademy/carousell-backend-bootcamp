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
      email,
    } = req.body;
    try {
      // TODO: Get seller email from auth, query Users table for seller ID
      const [user] = await this.userModel.findOrCreate({
        where: {
          email: email,
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
        sellerId: user.id,
      });

      // Respond with new listing
      return res.json(newListing);
    } catch (err) {
      console.log("Error in createnewitem:", err);
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
    console.log("at the top");
    const { listingId } = req.params;
    const { email } = req.body;
    try {
      const data = await this.model.findByPk(listingId);
      const listing = await this.model.findByPk(req.params.listingId);
      console.log("Before findOrCreate");
      // Retrieve seller from DB via seller email from auth
      const [user] = await this.userModel.findOrCreate({
        where: {
          email: email,
        },
      });
      console.log("After findOrCreate");
      // Update listing to reference buyer's user ID
      console.log("Before listing.update");
      await listing.update({ buyerId: user.id });
      // Respond to acknowledge update
      return res.json(data);
    } catch (err) {
      console.log("Error in buyItem:", err);
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = ListingsController;
