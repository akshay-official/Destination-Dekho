const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
    title : String,
    description : String,
    image : String,
    price : Number,
    location : String,
    country : String,
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;