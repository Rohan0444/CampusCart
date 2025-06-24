const User = require("../models/user.js");

module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs");
  };

module.exports.signup = async (req, res) => {
    try {
      let { username, email, password, hostel, roomNumber  } = req.body;
      const newUser = new User({ email, username, hostel, roomNumber });
      const registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.login(registerUser, (err) => {
        if (err) {
          return next(err);
        }
        req.flash("success", "Welcome to Wanderlust!");
        res.redirect("/listings");
      });
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/signup");
    }
  };

module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs");
  };

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  };

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "you are logged out!");
      res.redirect("/listings");
    });
  };

module.exports.addToCart = async (req, res) => {
    const { id } = req.params;
    const user = await User.findById(req.user._id);
    
    if (!user.cart.includes(id)) {
      user.cart.push(id);
      await user.save();
      req.flash("success", "Item added to cart successfully!");
    } else {
      req.flash("error", "Item is already in your cart.");
    }
    
    res.redirect("/cart");
  };

module.exports.getCart = async (req, res) => {
    const user = await User.findById(req.user._id).populate("cart");
    
    if (!user.cart || user.cart.length === 0) {
      req.flash("error", "Your cart is empty.");
      return res.redirect("/listings");
    }
    
    res.render("listings/cart.ejs", { allListings: user.cart });
  };