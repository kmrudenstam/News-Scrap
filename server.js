// Dependancies
var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");
var axios = require("axios");
var cheerio = require("cheerio");

// Initialize Express
var app = express();

app.use(express.static("public"));
var PORT = process.env.PORT || 3000;
var db = require("./models");
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsdb";

mongoose.connect(MONGODB_URI);

// Use morgan logger for logging requests
app.use(logger("dev"));

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Retrieve data from the db
app.get("/all", function (req, res) {
    // Find all results from the scrapedData collection in the db
    db.News.find({}, function (error, found) {
        // Throw any errors to the console
        if (error) {
            console.log(error);
        }
        // If there are no errors, send the data to the browser as json
        else {
            res.json(found);
        }
    });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function (req, res) {
    // Make a request via axios for the news section of Liverpool's webpage
    axios.get("https://www.liverpoolfc.com/").then(function (response) {
        // Load the body of the HTML into cheerio
        var $ = cheerio.load(response.data);

        // Empty array to save our scraped data
        var scrapeResults = [];
        console.log("scraped");
        $("article").each(function (i, element) {
            // Article data

            var title = $(this)
                .find("title")
                .text();
            var url = $(this)
                .parent("a")
                .attr("href");
            var img = $(this)
                .find("img")
                .attr("src");

            var newsData = {
                title: title,
                url: url,
                img: img
            };

            db.News.create(newsData)
                .then(dbNews => console.log(dbNews))
                .catch(err => res.json(err));
            console.log(scrapeResults);
        });
    });
    res.redirect("/");
});

// Send a "Scrape Complete" message to the browser

// Route for getting all Articles from the db
app.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.News.find({})
        .then(function (dbNews) {
            // If Articles is successfully found, send back to the client
            res.json(dbNews);
        })
        .catch(function (err) {
            // If error occurred, send it to the client
            res.json(err);
        });
});

// GET Route for grabbing an article by its specific ID and adding a note
app.get("/articles/:id", (req, res) => {
    db.News.findOne({ _id: req.params.id })
        .populate("note")
        .then(dbNews => res.json(dbNews))
        .catch(err => res.json(err));
});

// Route for saving/updating an Article's associated Note
// POST Route for saving an Article's note
app.post("/articles/:id", (req, res) => {
    db.Note.create(req.body)
        .then(dbNote => {
            console.log("article returned");
            return db.News.findOneAndUpdate(
                { _id: req.params.id },
                { saved: true, note: dbNote._id },
                { new: true }
            );
        })
        .then(dbNews => {
            res.redirect("/");
            res.json(dbNews);
        })
        .catch(err => {
            res.json(err);
        });
});

//Delete
app.delete("/clear", function (req, res) {
    db.News.drop(newsData)
    console.log("Deleted");
});


// DELETE route for deleting posts
app.delete("/articles/delete/:id", function (req, res) {
    console.log(req.params.id);
    db.News.findByIdAndRemove({
        _id: req.params.id
    })
        .then(function (dbPost) {
            res.json(dbPost);
        })
        .catch(err => {
            res.json(err);
        });
});

// Listen on port 3000
app.listen(PORT, function () {
    console.log("App running on http://localhost:3000");
});
