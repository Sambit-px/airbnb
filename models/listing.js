const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref:"Review",
    }
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref:"User",
  },
  geometry: { //search geojson mongoose for further info
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    },
    categories: {
      type: [String],  // Array to store multiple categories
      enum: ['Trending','Rooms','Iconic Cities','Mountains','Castles','Amazing Pools','Camping','Farms','Arctic','Domes','Boats'], // Enum to restrict categories to a specific list
      required: true
    }
  }
});

/*The findOneAndDelete is triggered when the delete route in app.js is triggered*/
listingSchema.post("findOneAndDelete" , async(listing) => {   /*Mongoose registers updateOne middleware on Query.prototype.updateOne() by default. This means that both doc.updateOne() and Model.updateOne() trigger updateOne hooks, but this refers to a query, not a document. To register updateOne middleware as document middleware, use schema.pre('updateOne', { document: true, query: false }).*/    
  if(listing){
    await Review.deleteMany({_id: {$in: listing.reviews}}); 
  }
})

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;