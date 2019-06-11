// Dependencies
const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const axios = require("axios");
const logger = require("morgan");
const bodyParser = require("body-parser");

// Initialize Express
const app = express();

app.use(logger("dev"));
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(express.static(process.cwd() + "/public"));

// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("vire engine", "handlebars");

// Mongoose connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI);
const db = mongoose.connection;
// Error catcher
db.on('error', console.error.bind(console, "connection error"));
db.once("open", function () {
    console.log("Connected to Mongoose!");
});

// Port
app.listen(3000, function () {
    console.log("App running on http://localhost:3000");
});