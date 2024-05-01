const express = require("express");
const router = express.Router();
const jwtVerify = require("../middleware/authMiddleware");
// const MusicArtItem = require("../models/musicArtItem");
const userModel = require("../models/user");
const { ObjectId } = require("mongodb");
// const musicArtItem = require("../models/musicArtItem");
const cartItem = require("../models/cartItem");



router.post('/:userId/bookmarks', async (req, res) => {
  try {
    const { userId } = req.params;
    const { storyId } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.bookmarkedStories.includes(storyId)) {
      return res.status(400).json({ error: 'Story already bookmarked' });
    }

    user.bookmarkedStories.push(storyId);
    const updatedUser = await user.save();

    res.status(200).json(updatedUser.bookmarkedStories);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});



router.post("/cart/add", jwtVerify, async (req, res) => {
    try {     
     const userID = req.body.userId || "";
        const { itemId,quantity, colour} = req.body;
        if (!itemId || !quantity || !colour ) {
            return res.status(400).json({
                errorMessage: "Bad Request",
            });
        }
        const user = await userModel.findById(userID);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
        const existingItem = user.cartList.find(item => item._id.toString() == itemId);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          user.cartList.push(new cartItem({ itemId, quantity, colour }));
        }
        const updatedUser = await user.save()
        res.json({ message: 'Item added to cart successfully', cart: updatedUser.cartList });
    } catch (error) {
        console.log(error);
    }
});

async function getItemDetails(itemID) {
     const musicArtItemDetails = await musicArtItem.findById(itemID);
     return musicArtItemDetails;
   }

 router.get("/cart/all",jwtVerify, async (req, res) => {
     try {          
        const userID = req.body.userId || "";
        const queryToFind = {"id" : userID };
        const cart =  await user.findById(userID).select('cartList');
        if(cart.length==0){          
          res.json({ status : 204 , data: null ,message: "No Items added in the cart"});
        }        
        else{          
          const cartItemsWithDetails = await Promise.all(
               cart.map(async (cartItem) => {
                 const itemDetails = await getItemDetails(cartItem._id);
                 return itemDetails;
               })
             );
        res.json({ status : 500 , data: cartItemsWithDetails , message: "There are Items in the cart"});
        }
       } catch (error) {
         console.log(error);
     }
 });

router.get("/item/:itemid",jwtVerify, async (req, res) => {
     try {          
        const userID = req.body.userId || "";
        const musicArtItemID = (req.params.itemid).substring(7);
        
        const musicArtItemList =  await musicArtItem.findById(musicArtItemID);
        
        res.json({ status : 500 , data: musicArtItemList });
       } catch (error) {
         console.log(error);
     }
 });


 router.get("/filter",jwtVerify, async (req, res) => {
     try {          
          const query = {};
        const userID = req.body.userId || "";
        const filters = (req.body);
        const pipeline = [
          {
            $match: {
              $and: filters.map(filter => ({ [filter.filterItem]: filter.filterValue }))
            }
          }
        ];
        console.log(pipeline);
        const musicArtItemList =  await musicArtItem.aggregate(pipeline);
        if(musicArtItemList.length<0)
        {
          res.json({ status : 204 , data: null });
        }
        else{
          res.json({ status : 200 , data: musicArtItemList });
        }
       } catch (error) {
         console.log(error);
         res.json({ status : 404 , data: "Not Found" });
     }
 });


module.exports = router;