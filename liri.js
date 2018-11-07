require("dotenv").config();


var keys = require("./keys.js");
var request = require('request');
var moment = require('moment');
var Spotify = require('node-spotify-api');
var fs = require('fs');
var input = process.argv;
var command  = input[2];
var searchThing = input[3];

switch (command ) {
	case "concert-this":
        concert(searchThing);
        break;

	case "spotify-this-song":
        spotify(searchThing);
        break;

	case "movie-this":
        movie(searchThing);
        break;

	case "do-what-it-says":
        doitanyway();
        break;
    
    default:
        console.log("Not working");
};

function concert (searchThing){
    var queryUrl = "https://rest.bandsintown.com/artists/" + searchThing + "/events?app_id=codingbootcamp";
    // console.log("print something");
    request (queryUrl, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			let concertThis = JSON.parse(body)[0];
		  console.log("----------------------------------");
		  console.log(`Artist: ${searchThing}\n Venue: ${concertThis.venue.name}\n Location: ${concertThis.venue.city} ${concertThis.venue.country}`);
		  console.log("Time"+ ": " + moment(body.datetime, 'YYYY-MM-DDh-m-s').format('MM/DD/YYYY'));
		  console.log("----------------------------------");
		} else {
		  console.log(error);
		}
	  });
};

// node liri.js spotify-this-song '<song name here>'
function spotify(searchThing) {

	var spotify = new Spotify(keys.spotify);
		if (!searchThing){
        	searchThing = 'Stronger';
    	}
		spotify.search({ type: 'track', query: searchThing }, function(err, data) {
			if (err){
	            console.log('STOP: Error occurred: ' + err);
	            return;
	        }
			var songInfo = data.tracks.items;
			console.log("----------------------------------")
	        console.log(` Artist(s): ${songInfo[0].artists[0].name}\n Song Name: ${songInfo[0].name}\n Preview Link: ${songInfo[0].preview_url}\n Album: ${songInfo[0].album.name}`);
			console.log("----------------------------------")
	});
}

// node liri.js movie-this '<movie name here>'
function movie(searchThing) {

	var queryUrl = "http://www.omdbapi.com/?t=" + searchThing + "&y=&plot=short&apikey=ba8cb97";

	request(queryUrl, function(error, response, body) {
		if (!searchThing){
        	searchThing = 'Pretty Woman';
    	}
		if (!error && response.statusCode === 200) {
			let movieInfo = JSON.parse(body);
			console.log('----------------------------------');
			console.log(` Title: ${movieInfo.Title}\n Release Year: ${movieInfo.Year}\n IMDB Rating:${movieInfo.imdbRating}\n Rotten Tomatoes Rating: ${movieInfo.Ratings[1].Value}\n Country: ${movieInfo.Country}\n Language: ${movieInfo.Language}\n Plot: ${movieInfo.Plot}\n Actors: ${movieInfo.Actors}`);
			console.log('-----------------------------------');
		}
	});
};
// node liri.js do-what-it-says
function doitanyway() {
	fs.readFile('random.txt', "utf8", function(error, data){
		if (error) {
    		return console.log(error);
  		}
		// Then split it by commas 
		var dataArr = data.split(",");

		if (dataArr[0] === "spotify-this-song") {
			var songcheck = dataArr[1].slice(1, -1);
			spotify(songcheck);
		} else if (dataArr[0] === "concert-this") {
			var concertName = dataArr[1].slice(1, -1);
			concert(concertName);
		} else if(dataArr[0] === "movie-this") {
			var movie_name = dataArr[1].slice(1, -1);
			movie(movie_name);
		} 
  	});
};