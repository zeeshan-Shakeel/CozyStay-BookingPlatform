const mongoose = require("mongoose");
const Review = require("./review");

const listingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  image: {
    url: String,
    filename: String
  },
  price: Number,
  location: String,
  country: String,

  // GeoJSON format for coordinates
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },

  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

// Middleware to delete associated reviews when listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews }
    });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
