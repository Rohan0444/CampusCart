const Review = require("../models/review.js");
const User = require("../models/user.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id).populate("owner");
    let newReview = new Review(req.body.review);
    let owner = listing.owner;
    
    newReview.author = req.user._id;
    owner.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    await owner.save();
    req.flash("success", "review created successfully");
    res.redirect(`/listings/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;
    if (!id) {
      req.flash("error", "Listing you are seaching is doesn't exist");
      res.redirect(`/listings`);
    }
    let listing = await Listing.findById(id).populate("owner");

    let owner = listing.owner;
    await User.findByIdAndUpdate(owner._id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "review deleted successfully");
    res.redirect(`/listings/${id}`);
};