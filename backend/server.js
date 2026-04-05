require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const User = require("./models/User");
const Booking = require("./models/Booking");

const app = express();

app.use(cors({
  origin: "https://planmytri.netlify.app"
}));
app.use(express.json());

/* ========================= */
/* 🗄️ DATABASE CONNECTION */
/* ========================= */
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

/* ========================= */
/* 🧪 TEST ROUTE */
/* ========================= */
app.get("/", (req, res) => {
  res.send("API Running");
});

/* ========================= */
/* 🔐 REGISTER API */
/* ========================= */
app.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.send({ message: "User already exists" });
    }

    const newUser = await User.create({ email, password });

    res.send({
      message: "User Registered Successfully",
      user: newUser
    });

  } catch (err) {
    res.send({ error: err.message });
  }
});

/* ========================= */
/* 🔐 LOGIN API */
/* ========================= */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (!user) {
      return res.send({ message: "Invalid Credentials" });
    }

    res.send({
      message: "Login Success",
      user
    });

  } catch (err) {
    res.send({ error: err.message });
  }
});

/* ========================= */
/* ✈️ SEARCH TRIPS API */
/* ========================= */
app.post("/search", async (req, res) => {
  try {
    const { from, to } = req.body;

    // Dummy data (later we can use real APIs)
    const trips = [
      { mode: "Flight", from, to, price: 5000, time: "2h" },
      { mode: "Train", from, to, price: 1500, time: "10h" },
      { mode: "Bus", from, to, price: 800, time: "12h" }
    ];

    res.send({
      message: "Trips Found",
      trips
    });

  } catch (err) {
    res.send({ error: err.message });
  }
});

/* ========================= */
/* 💳 BOOKING API */
/* ========================= */
app.post("/book", async (req, res) => {
  try {
    const booking = await Booking.create(req.body);

    res.send({
      message: "Booking Successful",
      booking
    });

  } catch (err) {
    res.send({ error: err.message });
  }
});

/* ========================= */
/* 🚀 START SERVER */
/* ========================= */
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});