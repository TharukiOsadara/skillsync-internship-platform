//pw- UlXBiR5jYEmmFQSd
const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');//lead the web brower to access its resources from different origins (domains, ports, or protocols) than its own.
const router = require('./Routes/UserRoutes');
const internshipRouter = require('./Routes/InternshipRoutes');
const cvRouter = require('./Routes/CVRoutes');


const app = express();


// Middleware to parse JSON bodies
app.use(cors());

app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use("/users", router);
app.use("/internships", internshipRouter);
app.use("/cv", cvRouter);
<<<<<<< HEAD
=======

>>>>>>> e0d674ae2f2f05615d90c73277f4a188ef08b8bc

mongoose.connect("mongodb+srv://admin:UlXBiR5jYEmmFQSd@cluster0.pa8q59u.mongodb.net/")
.then(() => console.log("Connected to MongoDB"))
.then(() => {
  app.listen(5000, () => console.log("Server running on http://localhost:5000"));
})
.catch((err) => console.log("Failed to connect to MongoDB", err));