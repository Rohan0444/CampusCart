const Listing = require("../models/listing.js");
const User = require("../models/user.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});

    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: "owner",
      populate: {
        path: "reviews",
        populate: {
          path: "author",
        },
      },
    });

  if (!listing) {
    req.flash("error", "Listing you are searching for doesn't exist");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let url = req.file.path;
    let filename = req.file.filename;

    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    await newListing.save();
    req.flash("success", "listing created successfully");
    res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
      req.flash("error", "Listing you are seaching is doesn't exist");
      res.redirect(`/listings`);
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url, filename };
      await listing.save();
    }

    req.flash("success", "listing updated successfully");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndDelete(id);
    req.flash("success", "listing deleted successfully");
    res.redirect(`/listings`);
};

module.exports.searchListings = async (req, res) => {
    const { search:query } = req.query;
    console.log(query);
    if (!query) {
        req.flash("error", "Please enter a search term");
        return res.redirect("/listings");
    }

    const regex = new RegExp(query, "i"); // Case-insensitive search
    const allListings = await Listing.find({
        $or: [
            { title: regex },
            { description: regex },
            { hostel: regex },
            { roomNumber: regex }
        ]
    });

    res.render("listings/search.ejs", { allListings, query });
};