const BaseController = require("./baseController");

class ListingsController extends BaseController {
  constructor(model, userModel) {
    super(model);
    this.model = model;
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
      userEmail,
      userFirstName,
      userLastName,
      userPhoneNumber,
    } = req.body;
    try {
      // TODO: Get seller email from auth, query Users table for seller ID
      const [user, created] = await this.userModel.findOrCreate({
        where: { email: userEmail }, // Replace with the correct attribute name for email in your Users model
        defaults: {
          // Additional default attributes you may want to set when a new user is created
          firstName: userFirstName,
          lastName: userLastName,
          phoneNum: userPhoneNumber,
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
        sellerId: user.id, // TODO: Replace with seller ID of authenticated seller
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
    const { userEmail, userFirstName, userLastName, userPhoneNumber } =
      req.body;
    try {
      const data = await this.model.findByPk(listingId);

      // TODO: Get buyer email from auth, query Users table for buyer ID
      const [user, created] = await this.userModel.findOrCreate({
        where: { email: userEmail }, // Replace with the correct attribute name for email in your Users model
        defaults: {
          // Additional default attributes you may want to set when a new user is created
          firstName: userFirstName,
          lastName: userLastName,
          phoneNum: userPhoneNumber,
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
