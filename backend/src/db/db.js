const mongoose = require("mongoose");

function connectDB() {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Db connected successfully");
    })
    .catch((err) => {
      console.log("THE ERROR IS " + err);
    });
}

module.exports = connectDB;
