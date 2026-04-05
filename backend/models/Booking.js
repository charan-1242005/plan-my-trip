const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userEmail: String,
  from: String,
  to: String,
  mode: String,
  price: Number,
  passengers: Number,
  paymentStatus: String
});

module.exports = mongoose.model("Booking", bookingSchema);