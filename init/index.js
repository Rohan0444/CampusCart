const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect('mongodb+srv://rawatrohan443:rawatrohan344@cluster0.mrx3clr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "685a517f382ea1cfa108a78e" ,
    }))
    await Listing.insertMany(initData.data);
    console.log("data was intitialised");
};

initDB();
