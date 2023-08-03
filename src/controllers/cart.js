const User = require("../usermodels");

 exports.products = async (req, res) => {
    const lToken = req.session.logintoken;

    if (lToken) {
        const email = req.session.email;
        const data = JSON.parse(req.body.data);
        console.log(data);

        try {
            const user = await User.findOne({ email });

            if (user) {
                const cartItem = user.cart.find((item) => item.idd === parseInt(data.id));

                if (cartItem) {
                    // If the product already exists in the cart, increase the quantity
                    cartItem.quantity += parseInt(data.quantity);
                } else {
                    // If the product doesn't exist in the cart, add a new item
                    const newCartItem = {
                        idd: parseInt(data.id),
                        title: data.title,
                        image: data.image,
                        description: data.description,
                        price: data.price,
                        quantity: parseInt(data.quantity),
                    };

                    user.cart.push(newCartItem);
                }

                await user.save();
            } else {
                console.log("User not found");
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        res.redirect("/login");
    }
};

const calculateTotalPrice = (cartItems) => {
  let totalPrice = 0;
  for (const item of cartItems) {
    totalPrice += item.price * item.quantity;
  }
  return totalPrice.toFixed(2);
};

 exports.productsCart = async (req, res) => {
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
        const cartItems = user.cart;
        const cartMessage = req.session.cartMessage;
        req.session.cartMessage = null; 
        const totalPrice = calculateTotalPrice(cartItems);
        user.totalAmount = totalPrice;
        await user.save();

        res.render("views/cart", { cartItems, cartMessage, totalPrice });
      } else {
        console.log("User not found");
        res.redirect("/login")
      }
    } catch (error) {
      console.log(error);
      // Handle the error appropriately
    }
  }else{
    res.redirect("/login")
  }
};

 exports.removeCartItem = async (req, res) => {
  const lToken = req.session.logintoken;

  if (lToken) {
    const email = req.session.email;
    const itemId = JSON.parse(req.body.data);

    try {
      const user = await User.findOne({ email });

      if (user) {
        const cartItemIndex = user.cart.findIndex((item) => item.idd === parseInt(itemId.id));

        if (cartItemIndex !== -1) {
          // Remove the item from the cart
          user.cart.splice(cartItemIndex, 1);
          await user.save();
          res.redirect("/cart")
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

 exports.reduceCartItem = async (req, res) => {
  const lToken = req.session.logintoken;

  if (lToken) {
    const email = req.session.email;
    const itemId = JSON.parse(req.body.data);

    try {
      const user = await User.findOne({ email });

      if (user) {
        const cartItem = user.cart.find((item) => item.idd === parseInt(itemId.id));

        if (cartItem) {
          if (cartItem.quantity > 1) {
            // Reduce the quantity by 1
            cartItem.quantity -= 1;
            await user.save();
            res.redirect("/cart");
          } else {
            // Remove the item from the cart
            user.cart = user.cart.filter((item) => item.idd !== parseInt(itemId));
            await user.save();
            res.redirect("/cart");
          }
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


