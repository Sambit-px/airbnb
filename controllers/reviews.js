const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.createReview = async(req,res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
  
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    
    console.log("new review saved");
    //res.send("new review saved");
    req.flash("success", "New Review Created:");
    res.redirect(`/listings/${listing._id}`);
  };


  module.exports.destroyReview = async (req,res) =>{
    let {id,reviewId} = req.params;
  
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});  /* The $pull operator removes from an existing array all instances of a value that matches a specified condition */
    await Review.findByIdAndDelete(reviewId); /*Delete the review from the Review model using Review.findByIdAndDelete*/
    req.flash("success", "Review Deleted:");
    res.redirect(`/listings/${id}`);
  };