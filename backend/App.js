const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

const internshipRouter = require("./Routes/InternshipRoutes");
const userRouter = require("./Routes/UserRoutes");
const cvRouter = require("./Routes/CVRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working ✅");
});

// Routes
app.use("/internships", internshipRouter);
app.use("/users", userRouter);
app.use("/cv", cvRouter);

// Database connection
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://admin:UlXBiR5jYEmmFQSd@cluster0.pa8q59u.mongodb.net/")
.then(() => console.log("Connected to MongoDB"))
.then(() => {
  app.listen(5000, () => console.log("Server running on port 5000"));
})
.catch((err) => console.log("Failed to connect to MongoDB", err));