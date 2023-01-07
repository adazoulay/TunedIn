const mongoose = require("mongoose");
mongoose.set("strictQuery", true); // ! Look into this, supresses warning
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URI);
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectDB;
