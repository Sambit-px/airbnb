const mongoose = require("mongoose");
const initData = require("./data.js"); /* ./ -> current directory */
const Listing = require("../models/listing.js"); /* ../ -> parent directoy */

const mongo_url="mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
      console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main(){
    await mongoose.connect(mongo_url);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: "6793148172ea09b7418aefad" }));
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};


initDB();
