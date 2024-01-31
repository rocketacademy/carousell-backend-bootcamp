const BaseController = require("./baseController");

class ListingsController extends BaseController {
  constructor(model, userModel) {
    super(model);
    this.userModel = userModel;
  }

  /** if a method in this extended class AND the base class has the same name, the one in the extended class will run over the base method */
  // Create listing. Requires authentication.
		async insertOne(req, res) {
			const { title, category, condition, price, description, shippingDetails, sellerId } =
      req.body;
    try {
      // TODO: Get seller email from auth, query Users table for seller ID

      // Create new listing
      const newListing = await this.model.create({
        title: title,
        category: category,
        condition: condition,
        price: price,
        description: description,
        shippingDetails: shippingDetails,
        buyerId: null,
        sellerId: sellerId, // TODO: Replace with seller ID of authenticated seller
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
	
	async getUser(req,res){
		const { email } = req.params
		try{
			const thisUser = await this.userModel.findAll({
				where:{
					email
				}
			})
			return res.status(200).json(thisUser)
		}catch(err){
			return res.status(400).json({err:true, msg:err})
		}
	}

	async findOrCreateUser(req,res){
		const { email } = req.body
		try{
			const [user, created] = await this.userModel.findOrCreate({
				where:{
					email
				}
			})
			return res.status(200).json(user)
		}catch(err){
			return res.status(400).json({error:true, msg:err})
		}
	}

  // Buy specific listing. Requires authentication.
  async buyItem(req, res) {
    const { listingId } = req.params;
		const { buyerId } = req.body
    try {
      const data = await this.model.findByPk(listingId);

      // TODO: Get buyer email from auth, query Users table for buyer ID
      await data.update({ buyerId: buyerId }); // TODO: Replace with buyer ID of authenticated buyer

      // Respond to acknowledge update
      return res.json(data);
    } catch (err) {
      return res.status(400).json({ error: true, msg: err });
    }
  }
}

module.exports = ListingsController;


//TODO: TAKE USER INFO FROM AUTH0, THEN PUSH IT INTO BACKEND VIA FIND OR CREATE, THEN USE THE USERID AS BUYER ID WHEN CLICKING ON BUY
