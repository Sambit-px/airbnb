require("dotenv").config({ path: "../.env" });


const mongoose = require("mongoose");
const initData = require("./data.js"); /* ./ -> current directory */
const Listing = require("../models/listing.js"); /* ../ -> parent directoy */

const mongo_url = process.env.ATLASDB_URL;
console.log("Mongo URL:", mongo_url);


main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "682d612bb8339304cd84525e" }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};


initDB();
