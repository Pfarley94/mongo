console.log("connection of app.js")

$(document).ready(function () {
    $('.container').hide();
});
// Grab the articles as a json

$(document).on("click", "#scrapeBtn.nav-link", function () {
    console.log("clicked")
    $('.container').show();
    $.getJSON("/articles", function (data) {
        // For each one
        for (var i = 0; i < data.length; i++) {
            $("#articles").append("<p data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
        }
    });
});