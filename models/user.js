const { required } = require("joi");
const mongoose = require("mongoose");
const { use } = require("passport");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }],
    cart: [{
        type: Schema.Types.ObjectId,
        ref: "Listing"
    }],
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);