const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postRoutes = require("./api/routes/posts");
const photoRoutes = require("./api/routes/photos");
const fileRoutes = require("./api/routes/files");

mongoose.connect("mongodb://localhost:27017/project", {
  useNewUrlParser: true
});

//log all the requests
app.use(morgan("dev"));
app.use('/uploads',express.static("uploads"));

//Use this to parse the incoming url request and Json data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Handling Cross-Origin-Resource-Sharing errors, occurs when the client and server are in diff domians
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT ,POST,PATCH,DELETE,GET");
    return res.status(200).json({}); // Here we return back the request as the browser is only checking what options are provided
  }
  next();
});

//Routes to handle request
app.use("/posts", postRoutes);
app.use("/photos", photoRoutes);
app.use("/files", fileRoutes);

//Used to handle any routes that were not handled before
app.use((req, res, next) => {
  const error = new Error("Not valid URL");
  error.status = 404;
  next(error);
});

//used to handle all the errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
