const User = require("../usermodels");

 exports.addToWishlist = async (req, res) => {
  const lToken = req.session.logintoken;

  if (lToken) {
    const email = req.session.email;
    const data = JSON.parse(req.body.data);
    console.log(data.id);
    console.log(data);

    try {
      const user = await User.findOne({ email });

      if (user) {
        const wishlistItem = user.wishlist.find((item) => item.title === data.title);

        if (wishlistItem) {
          // If the product already exists in the wishlist, increase the quantity
          wishlistItem.quantity += parseInt(data.quantity);
        } else {
          // If the product doesn't exist in the wishlist, add a new item
          const newWishlistItem = {
            idd: parseInt(data.id),
            title: data.title,
            image: data.image,
            description: data.description,
            price: data.price,
            quantity: parseInt(data.quantity),
          };

          user.wishlist.push(newWishlistItem);
        }

        await user.save();
      } else {
        console.log("User not found");
        res.redirect("/login");
      }
    } catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  } else {
    res.redirect("/login");
  }
};


  exports.removeWishlistItem = async (req, res) => {
    const lToken = req.session.logintoken;
  
  
    if (lToken) {
      const email = req.session.email;
      const itemId = JSON.parse(req.body.data);
  
      try {
        const user = await User.findOne({ email });
  
        if (user) {
          const wishlistItemIndex = user.wishlist.findIndex((item) => item.idd === parseInt(itemId.id));
  
          if (wishlistItemIndex !== -1) {
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
      const data = JSON.parse(req.body.data);
  
      try {
        const user = await User.findOne({ email });
  
        if (user) {
          const cartItem = user.cart.find((item) => item.idd === parseInt(data.itemId));
          if (cartItem) {
            cartItem.quantity += data.quantity;
          } else {
            const newcartItem = {
              idd: parseInt(data.itemId),
              title: data.title,
              image: data.image,
              description: data.description,
              price: data.price,
              quantity:data.quantity
            };
            user.cart.push(newcartItem);
          }
  
          const wishlistItemIndex = user.wishlist.findIndex((item) => item.idd === parseInt(data.itemId));
          if (wishlistItemIndex !== -1) {
          user.wishlist.splice(wishlistItemIndex, 1);
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
  