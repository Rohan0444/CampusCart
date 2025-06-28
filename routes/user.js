const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const { isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.renderSignup)
  .post(userController.signup);

router
  .route("/login")
  .get(userController.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

router.post("/:id/cart", isLoggedIn, userController.addToCart);

router.get("/cart", isLoggedIn, userController.getCart);

router.get("/logout", userController.logout);

router.get("/", (req, res) => {
  res.render("users/home");
});

module.exports = router;
