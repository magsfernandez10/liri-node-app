require("dotenv").config();

// Here we include the weather-js so we can use it in our Node application.
var keys = require("./keys.js")
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);

var request = require("request");

spotify
  .request('https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx')
  .then(function(data) {
   // console.log(data); 
  })
  .catch(function(err) {
    console.error('Error occurred: ' + err); 
  });


// Then run a request to the OMDB API with the movie specified
request("http://www.omdbapi.com/?t=remember+the+titans&y=&plot=short&apikey=trilogy", function(error, response, body) {

  // If the request is successful (i.e. if the response status code is 200)
  if (!error && response.statusCode === 200) {

    // Parse the body of the site and recover just the imdbRating
    // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
    console.log("The movie's rating is: " + JSON.parse(body).imdbRating);
  }
});