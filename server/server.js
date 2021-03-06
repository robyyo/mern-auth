const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();
const app = express();
//conect to db
mongoose
  .connect(process.env.DATABASE, {
    // useNewUrlParser: true,
    // usefindAndModify: false,
    // useUnifiedTopolgy: true,
    // useCreateIndex: true,
  })
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log("DB CONNECTION ERROR ", err);
  });

//import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

//app middleware
app.use(morgan("dev"));
// Express.json will work in place of bodyParser
// app.use(bodyParser.json());

// app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(cors()); // enable same-origin resource sharing

if (process.env.NODE_ENV == "development") {
  // if in development allow localhost:3000
  app.use(cors({ origin: `http://localhost:3000` }));
}

//route middleware
app.use("/api", authRoutes);
app.use("/api", userRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
