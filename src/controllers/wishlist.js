const User = require("../usermodels");
 
 exports.addToWishlist = async (req, res) => {
    const lToken = req.session.logintoken;
  
    if (lToken) {
      const email = req.session.email;
      const { id, title, image, description, price, quantity } = req.body;
  
      try {
        const user = await User.findOne({ email });
  
        if (user) {
          const wishlistItem = user.wishlist.find((item) => item.idd === parseInt(id));
          if (wishlistItem) {
            // If the product already exists in the wishlist, increase the quantity
            wishlistItem.quantity += parseInt(quantity);
          } else {
            // If the product doesn't exist in the wishlist, add a new item
            const newWishlistItem = {
              idd: parseInt(id),
              title: title,
              image: image,
              description: description,
              price: price,
              quantity: quantity,
            };
            user.wishlist.push(newWishlistItem);
          }
  
          await user.save();
          return;
        } else {
          console.log("User not found");
          res.redirect("/login");
        }
      } catch (error) {
        console.log(error);
        // Handle the error appropriately
      }
    }else{
      res.redirect("/login")
    }
  };

  exports.removeWishlistItem = async (req, res) => {
    const lToken = req.session.logintoken;
  
  
    if (lToken) {
      const email = req.session.email;
      const itemId = req.body.itemId;
  
      try {
        const user = await User.findOne({ email });
  
        if (user) {
          const wishlistItemIndex = user.wishlist.findIndex((item) => item.idd === parseInt(itemId));
  
          if (wishlistItemIndex !== -1) {
            // Remove the item from the cart
            user.wishlist.splice(wishlistItemIndex, 1);
            await user.save();
            res.redirect("/wishlist")
          } else {
            res.status(404).send("Item not found in cart");
          }
        } else {
          res.status(404).send("User not found");
        }
      } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred");
      }
    }else{
      res.redirect("/login")
    }
  };
  
  exports.wishlist_render = async (req, res) => {
    const lToken = req.session.logintoken;
    const isAuth = req.session.isAuth;

  if (!isAuth) {
    res.redirect("/login");
    return;
  }
  
    if (lToken) {
      const email = req.session.email;
  
      try {
        const user = await User.findOne({ email });
  
        if (user) {
          const wishlistItems = user.wishlist;
          res.render("views/wishlist", { wishlistItems }); 
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.log(error);
      }
    }else{
      res.redirect("/login")
    }
  };

  exports.wishlist_update = async (req, res) => {
    const lToken = req.session.logintoken;
    const isAuth = req.session.isAuth;

  if (!isAuth) {
    res.redirect("/login");
    return;
  }
  
    if (lToken) {
      const email = req.session.email;
      const { itemId, quantity, image, price, title, description } = JSON.parse(req.body.data);
  
      try {
        const user = await User.findOne({ email });
  
        if (user) {
          const cartItem = user.cart.find((item) => item.idd === parseInt(itemId));
          if (cartItem) {
            // If the product already exists in the wishlist, increase the quantity
            cartItem.quantity += parseInt(quantity);
          } else {
            // If the product doesn't exist in the wishlist, add a new item
            const newcartItem = {
              idd: parseInt(itemId),
              title: title,
              image: image,
              description: description,
              price: price,
              quantity: parseInt(quantity)
            };
            user.cart.push(newcartItem);
          }
  
          await user.save();
          res.redirect("/wishlist");
        } else {
          res.status(404).send("User not found");
        }
      } catch (error) {
        console.log(error);
        res.status(500).send("An error occurred");
      }
    } else {
      res.redirect("/login");
    }
  };
  