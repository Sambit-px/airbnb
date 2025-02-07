const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings }); /* When you use res.render("listings/index"), Express looks for the index.ejs file inside the views/listings/ directory. */
};

module.exports.renderNewForm = (req, res) => {  /*Here, you're not querying a database or performing any operations that take time. You're simply responding with a form (the new.ejs view). So, this route doesn't need to be asynchronous*/
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews" , populate: {path:"author",},}).populate("owner");
    if(! listing){
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs" , {listing});
};

module.exports.createListing = async (req,res,next) => {
  let response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1,
  })
  .send()
  

  let url = req.file.path;
  let filename = req.file.filename;

  const newListing = new Listing(req.body.listing); /*new Listing(req.body.listing) creates an instance of a Mongoose document with the full set of Mongoose methods (such as .save() */
  newListing.owner = req.user._id;
  newListing.image = {url , filename};

  newListing.geometry = response.body.features[0].geometry;

  let savedListing = await newListing.save();
  console.log(savedListing);

  req.flash("success", "New Listing Created:");
  console.log(newListing);
  res.redirect("/listings");
  };

  module.exports.renderEditForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(! listing){
      req.flash("error", "Listing you requested for does not exist");
      res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace("/upload", "/upload/w_250") // visit this website to know more:"https://cloudinary.com/documentation/image_transformations"
    res.render("listings/edit.ejs", { listing , originalImageUrl });
  };

  module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }); /* ...=> it is required as req.body is a object and we need to pass its value */
    
    if(typeof req.file !== "undefined"){
      let url = req.file.path;
      let filename = req.file.filename;
      listing.image = { url,filename };
      await listing.save();
    }
    

    req.flash("success", "Listing Updated:");
    res.redirect(`/listings/${id}`);
  };

  module.exports.destroyListing = async (req,res)=>{
    let{id}=req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted:");
    res.redirect("/listings");
  };


// Function to filter listings by category
module.exports.filterByCategory = async (req, res) => {
  const { category } = req.params;
  const filteredListings = await Listing.find({ "geometry.categories": category });

  if (!filteredListings.length) {
    req.flash("error", "No listings found for this category.");
    return res.redirect("/listings");
  }

  res.render('listings/index.ejs', { allListings: filteredListings });
};

module.exports.filterByLocation = async (req,res) => {
  const { location } = req.query;

  const filteredLocation = await Listing.find({ "location": { $regex: location, $options: 'i' }}); // case-insensitive search

  res.render('listings/index.ejs', { allListings: filteredLocation });
}


