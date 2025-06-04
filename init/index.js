require("dotenv").config({ path: "../.env" });

const mongoose = require("mongoose");
const initData = require("./data.js"); /* ./ -> current directory */
const Listing = require("../models/listing.js"); /* ../ -> parent directoy */

const mongo_url = process.env.ATLASDB_URL;
//const owner_id1 = "682d612bb8339304cd84525e"; //from mongoDB
//const owner_id2 = "67e006af800d9a3a4938942a"; //from mongo atlas


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
  initData.data = initData.data.map((obj) => ({ ...obj, owner: "67e006af800d9a3a4938942a" }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};


initDB();
