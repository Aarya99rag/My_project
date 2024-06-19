const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type : String,
        required : true,
    },
    description: String,
    image: {
        type: String,
        set : (v) => v === "" ? "https://unsplash.com/photos/a-house-in-the-middle-of-a-forest-next-to-a-river-QsjKrm2eeM4" : v,
    },
    price: Number,
    location: String,
    country: String, 
});

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;


