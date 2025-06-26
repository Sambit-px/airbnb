const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Booking = require("../models/booking.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const bookingController = require("../controllers/booking.js");

//Book route
router.post("/listings/:id/booking", isLoggedIn, wrapAsync(bookingController.newBooking));

//Show booking route
router.get("/listings/:id/bookings/:bookingId", isLoggedIn, wrapAsync(bookingController.showBooking));

//dashboard route
router.get("/bookings/my", isLoggedIn,  wrapAsync(bookingController.Bookings));

//delete booking route
router.delete("/listings/:id/bookings/:bookingId",isLoggedIn, wrapAsync(bookingController.destroyBooking));

//Edit booking route
router.get("/listings/:id/bookings/:bookingId/edit", isLoggedIn, wrapAsync(bookingController.bookingEditForm));

//Update booking route
router.put("/listings/:id/bookings/:bookingId", isLoggedIn, wrapAsync(bookingController.updateBooking));

module.exports = router;