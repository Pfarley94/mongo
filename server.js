var express = require("express");
var bodyParser = require("body-parser"); 
var mongoose = require("mongoose");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var request = require("request");
var PORT = 3000;
var app = express();

// Configure middleware

// Use morgan logger for logging requests
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/mongo");

// Routes
request("http://www.bbc.com/", function(error, response, html) {

  // Load the HTML into cheerio
  var $ = cheerio.load(html);

  // Make an empty array for saving our scraped info
  var results = [];

  // With cheerio, look at each award-winning site, enclosed in "figure" tags with the class name "site"
  // With cheerio, find each h4-tag with the class "headline-link" and loop through the results
  $(".media__link").each(function(i, element) {

    // Save the text of the h4-tag as "title"
    var title = $(element).text();

    // Find the h4 tag's parent a-tag, and save it's href value as "link"
    var link = $(element).parent().attr("href");

    // Make an object with data we scraped for this h4 and push it to the results array
    results.push({
      title: title,
      link: link
    });
  });

  // After looping through each h4.headline-link, log the results
  console.log(results);
});







// // A GET route for scraping the echoJS website
// app.get("/scrape", function(req, res) {
//   // First, we grab the body of the html with request
//   axios.get("http://www.bbc.com/").then(function(response) {
//     // Then, we load that into cheerio and save it to $ for a shorthand selector
//     var $ = cheerio.load(response.data);

//     // Now, we grab every h2 within an article tag, and do the following:
//     $("block-link_overlay-link").each(function(i, element) {
//       // Save an empty result object
//       var result = {};

//       // Add the text and href of every link, and save them as properties of the result object
//       result.title = $(this)
//         .children("a")
//         .text();
//       result.link = $(this)
//         .children("a")
//         .attr("href");

//       // Create a new Article using the `result` object built from scraping
//       db.Article.create(result)
//         .then(function(dbArticle) {
//           // View the added result in the console
//           console.log(dbArticle);
//         })
//         .catch(function(err) {
//           // If an error occurred, send it to the client
//           return res.json(err);
//         });
//     });

//     // If we were able to successfully scrape and save an Article, send a message to the client
//     res.send("Scrape Complete");
//   });
// });

// // Route for getting all Articles from the db
// app.get("/articles", function(req, res) {
//   // Grab every document in the Articles collection
//   db.Article.find({})
//     .then(function(dbArticle) {
//       // If we were able to successfully find Articles, send them back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// // Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function(req, res) {
//   // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
//   db.Article.findOne({ _id: req.params.id })
//     // ..and populate all of the notes associated with it
//     .populate("note")
//     .then(function(dbArticle) {
//       // If we were able to successfully find an Article with the given id, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {
//   // Create a new note and pass the req.body to the entry
//   db.Note.create(req.body)
//     .then(function(dbNote) {
//       // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
//       // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
//       // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
//       return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
//     })
//     .then(function(dbArticle) {
//       // If we were able to successfully update an Article, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurred, send it to the client
//       res.json(err);
//     });
// });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT);
});
