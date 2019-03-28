require('dotenv').config()
var inquirer = require('inquirer');
var clear = require('clear');
var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require('node-spotify-api');
var fs = require("fs");
var moment = require('moment');

var spotify = new Spotify(keys.spotify);
var movieName = "";
var songName = "";
var bandName = "";

// BANDSINTOWN FUNCTION

function bandsintownFunc() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please enter a band name.",
        name: "bandName",
        default: "Red Sun Rising",
      }
    ]).then(function (response) {
      bandName = response.bandName.split(" ").join("+");
      var queryUrl = "https://rest.bandsintown.com/artists/" + bandName + "/events?app_id=codingbootcamp&date=upcoming";
      axios.get(queryUrl).then(
        function (response) {
          var bandData = [];
          for (var i = 0; i < 8; i++) {
            var date = moment(response.data[i].datetime).format("MM/DD/YYYY");
            bandData = [
              "================",
              "Venue: " + response.data[i].venue.name,
              "City: " + response.data[i].venue.city + ", "  + response.data[i].venue.region,
              "Date: " + date + "\n",
            ].join("\n");
            console.log(bandData);

            fs.appendFile("log.txt", bandData, function (error) {
              if (error) {
                console.log(error)
              }
            });
          }
        });
    })
}
// END BANDSINTOWN FUNCTION


// SPOTIFY FUNCTION
function spotifyFunc() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please enter a song title",
        name: "songName",
        default: "I want it that way.",
      }
    ]).then(function (response) {
      songName = response.songName;
      fs.writeFile('random.txt', songName, function (err) {
        if (err) throw err;
      });

      fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
          return console.log(error);
        }
        var songName = data
        spotify.search({ type: 'track', query: songName, limit: 3 }, function (err, data) {
          if (err) {
            return console.log('Error occurred: ' + err);
          }
          clear()
          var songData = [];
          for (var i = 0; i < 3; i++) {
            songData = [
              "================",
              "Artist: " + data.tracks.items[i].artists[0].name,
              "Song Title: " + data.tracks.items[i].name,
              "30 second preview: " + data.tracks.items[i].preview_url,
              "Album: " + data.tracks.items[i].album.name + "\n",
            ].join("\n");
            console.log(songData);
            fs.appendFile("log.txt", songData, function (error) {
              if (error) {
                console.log(error)
              }
            });
          }
        });
      });
    });
};
// END SPOTIFY FUNCTION



// OMDB FUNCTION
function OMDBFunc() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Please enter a movie title",
        name: "movieName",
        default: "Poolhall Junkies",
      },
    ]).then(function (response) {
      movieName = response.movieName;
      fs.writeFile('random.txt', movieName, function (err) {
        if (err) throw err;
      });

      fs.readFile("random.txt", "utf8", function (error, data) {

        if (error) {
          return console.log(error);
        }
        console.log(data)
        var movieName = data.split(" ").join("+")


        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
        axios.get(queryUrl).then(
          function (response) {
            var movieData = [
              "================",
              "Title: " + response.data.Title,
              "Year: " + response.data.Year,
              "IMDB Rating: " + response.data.Ratings[0].Value,
              "Rotten Tomatoes Rating: " + response.data.Ratings[1].Value,
              "Country: " + response.data.Country,
              "Language: " + response.data.Language,
              "Plot: " + response.data.Plot,
              "Actors: " + response.data.Actors,
            ].join("\n");
            fs.appendFile("log.txt", movieData, function (error) {
              if (error) {
                console.log(error)
              }
            });
            console.log(movieData);
          });
      });
    });
};
// END OMDB FUNCTION



// SWITCH FUNCTION
inquirer
  .prompt([
    {
      type: "list",
      message: "What would you like to lookup?",
      choices: ["spotify", "BandsInTown", "OMDB"],
      name: "command"
    }
  ]).then(function (response) {
    if (response.command === "spotify") {
      clear();
      spotifyFunc();
      return;
    }
    else if (response.command === "BandsInTown") {
      clear();
      bandsintownFunc();
      return;

    }
    else if (response.command === "OMDB") {
      clear();
      OMDBFunc();
      return;

    }
  })

// END SWITCH FUNCTION
