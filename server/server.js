const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();

//import routes
const authRoutes = require("./routes/auth");

//app middleware
app.use(morgan("dev"));
app.use(bodyParser.json());

// Test if express.json will work in place of bodyParser
// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// app.use(cors()); // enable same-origin resource sharing

if (process.env.NODE_ENV == "development") {
  // if in development allow localhost:3000
  app.use(cors({ origin: `http://localhost:3000` }));
}

//route middleware
app.use("/api", authRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
