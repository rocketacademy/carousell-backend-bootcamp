const BaseController = require("./baseController");

class ListingsController extends BaseController {
  constructor(model, userModel) {
    super(model);
    this.userModel = userModel; //the users model
  }

  /** if a method in this extended class AND the base class has the same name, the one in the extended class will run over the base method */
  // Create listing. Requires authentication.
  async insertOne(req, res) {
    const { title, category, condition, price, description, shippingDetails, sellerEmail, sellerFirstName, sellerLastName, sellerPhone } =
      req.body;
    console.log(req.body);
    try {
      // Get authenticated user's email from request
      const authenticatedUserEmail = sellerEmail; // Assuming you have user information in the request
      console.log(`Get email: ${authenticatedUserEmail}`)
      // TODO: Query Users table to get seller ID based on the authenticated user's email
      const [user, created] = await this.userModel.findOrCreate({
        where: { email: authenticatedUserEmail },
        defaults: {
          firstName: sellerFirstName,
          lastName: sellerLastName,
          phoneNum: sellerPhone,
          email: sellerEmail,
        }
      });
      console.log(user.email); // prints email
      console.log(user.firstName); // prints first name
      console.log(created); // The boolean indicating whether this instance was just created      

      // Create new listing with the retrieved seller's ID
      const newListing = await this.model.create({
        title: title,
        category: category,
        condition: condition,
        price: price,
        description: description,
        shippingDetails: shippingDetails,
        buyerId: null,
        sellerId: user.id, // Use the retrieved seller's ID
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
    const { buyerEmail, buyerFirstName, buyerLastName, buyerPhone } =
      req.body;
      
    try {
      const authenticatedUserEmail = buyerEmail; // Assuming you have user information in the request
      const data = await this.model.findByPk(listingId); //listing data

      // TODO: Query Users table to get seller ID based on the authenticated user's email
      const [user, created] = await this.userModel.findOrCreate({
        where: { email: authenticatedUserEmail },
        defaults: {
          firstName: buyerFirstName,
          lastName: buyerLastName,
          phoneNum: buyerPhone,
          email: buyerEmail,
        }
      });
      // TODO: Get buyer email from auth, query Users table for buyer ID
      await data.update({ buyerId: user.id }); // TODO: Replace with buyer ID of authenticated buyer

      // Respond to acknowledge update
      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = ListingsController;
