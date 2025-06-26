const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");

module.exports.newBooking = async (req, res) => {
  let { id } = req.params;
  let { startDate, endDate } = req.body;
  const listing = await Listing.findById(id).populate("owner");
  const newBooking = new Booking({
      listing: id,
      owner: listing.owner._id,
      booker: req.user._id,
      startDate: new Date(startDate),
      endDate: new Date(endDate)
  });
  await newBooking.populate("booker");
  await newBooking.save();
  req.flash("success", "Booking confirmed!");
  res.render("listings/book.ejs", { listing, booking:newBooking });
};

module.exports.showBooking = async (req, res) => {
    const { id , bookingId } = req.params; 
    const listing = await Listing.findById(id).populate("owner");
    const booking = await Booking.findById(bookingId).populate("listing");
    res.render("listings/showBooking.ejs", { listing,booking });
};


  module.exports.Bookings = async (req, res) => {
    const allBookings = await Booking.find({}).populate("listing").populate("booker");;
    if (!allBookings.length) {
      req.flash("error", "No bookings found.");
    }
    res.render("listings/Booking.ejs", { allBookings });
};

module.exports.bookingEditForm = async (req, res) => {
  const { id, bookingId } = req.params;
  const listing = await Listing.findById(id).populate("owner");
  const booking = await Booking.findById(bookingId).populate("booker");

  if (!booking) {
    req.flash("error", "Booking not found!");
    return res.redirect(`/listings/${id}`);
  }

  res.render("listings/editBooking.ejs", { listing, booking });
};


module.exports.updateBooking = async (req, res) => {
  const { id, bookingId } = req.params;
  const { startDate, endDate } = req.body;

  const booking = await Booking.findByIdAndUpdate(bookingId, {
    startDate: new Date(startDate),
    endDate: new Date(endDate),
  }, { new: true });

  console.log(booking);

  req.flash("success", "Booking updated successfully!");
  res.redirect(`/listings/${id}/bookings/${bookingId}`);
};


module.exports.destroyBooking = async (req, res) => {
  const { id, bookingId } = req.params; 
  let deletedBooking = await Booking.findByIdAndDelete(bookingId);
  console.log(deletedBooking);
  req.flash("success", "Booking Deleted:");
  res.redirect("/bookings/my");
};


