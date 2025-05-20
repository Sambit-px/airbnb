if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const mapToken = process.env.MAP_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js")

//const mongo_url="mongodb://127.0.0.1:27017/wanderlust";
const dbUrl = process.env.ATLASDB_URL;


main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate); /* learn codes from npm ejsmate */
app.use(express.static(path.join(__dirname, "public")));/* to link css file */

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

const sessionOption = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, /*Date.now() provides data in millisecond hence data is converted to millisecond*/
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//app.get("/",(req,res)=>{
//   res.send("Hi, I am root");
//});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success"); /* res.locals.success = req.flash("success"): This stores the success messages in res.locals.success, which can then be accessed in any view rendered after this middleware. This makes it easy to display flash messages on the frontend (EJS views in your case). */
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user; //used in navbar.ejs
  next();
});

// app.get("/demouser", async(req,res) => {
//   let fakeUser = new User({
//     email:"student@gmail.com",
//     username: "delta-student" /*username is not mentioned in userSchema(./models/user.js) yet can be added due to passport-local-mongoose*/
//   });
//   let registeredUser = await User.register(fakeUser, "helloworld");
//   res.send(registeredUser);
// });



app.use("/listings", listingsRouter); /*connected to listing.js in routes folder*/
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);



// app.get("/testListing", async(req,res)=> {
//     let sampleListing = new Listing({
//         title:"My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     });

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("successful testing");
// });

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "page not found")); /*throws error*/
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err; /* the values assigned for statusCode(500)  and message(Something went wrong!)  are default value that would appear if no value is assigned to them*/
  res.status(statusCode).render("error.ejs", { message });
  //res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("listening to port 8080");
});