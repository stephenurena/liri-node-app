
//load the npm packages to read and write
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var moment = require('moment');
var fs = require("fs");

//take two arguments
//The first wil lbe the action(my-tweets, spotify-this-song, movie-this, do-what-it-says)
//The second will pass the value into the function associated with the first argument
var action = process.argv[2];
var value = process.argv[3];

 
//Created a switch-case statement, will direct which function gets run.
switch (action) {
    //if user inputs my-tweets, it will run the function myTweets, to find my latest 20 tweets
  case "my-tweets":
    myTweets();
    break;

    //if user inputs spotify-this-song, it will run the function spotifyThisSong, to find album info on song names
  case "spotify-this-song":
    spotifyThisSong();
    break;

    //if user inputs movie-this, it will run the function movieThis, to find movie information
  case "movie-this":
    movieThis();
    break;

    //if user inputs do-what-it-says, it will run the function doWhatItSays, to find 
  case "do-what-it-says":
    doWhatItSays();
    break;

  //if user does not enter a task, default by printing some instructions:
  default:
    console.log("Woothere, don't you want to see awesomeness?" + "\nPlease enter one of the following commands:" + '\n"my-tweets", "spotify-this-song", "movie-this", or "do-what-it-says"');
}

//function called if user inputs my-tweets on process.argv[2], this will show users last 20 tweets,
function myTweets(){
    /*This will show your last 20 tweets and when they were created at in your terminal/bash window.
    */
    //var keys is importing/calling the keys.js file, to use users access tokens, to authenticate user's profile. 
    var keys = require('./keys.js');

    //passes the required keys from object keys.twitterKeys.
    var client = new Twitter({
      consumer_key: keys.twitterKeys.consumer_key,
      consumer_secret: keys.twitterKeys.consumer_secret,
      access_token_key: keys.twitterKeys.access_token_key,
      access_token_secret: keys.twitterKeys.access_token_secret
    });

    //set a limit of only showing 20 tweets, starting from most recent.
    var params = {count: 20};


     client.get('statuses/user_timeline', params, function(error, tweets){
        //if not a success, will print last 20 tweets
          if (!error) {
               for (var i = 0; i < tweets.length; i++) {
                    console.log("\n==================Tweet# " + i + "===========================\n" + "My Tweet: " + tweets[i].text + " \nCreated on: " + moment(tweets[i].created_at).format('MMMM Do YYYY, h:mm a') + "\n");

                    //will also log the tweets into log.txt file, will not overwrite, just append on every new call.
                    fs.appendFile('log.txt', "\n==================Tweet# " + i + "===========================\n" + "My Tweet: " + tweets[i].text + " \nCreated on: " + moment(tweets[i].created_at).format('MMMM Do YYYY, h:mm a') + "\n");
               }

               //or else will print an error
          } else {
               console.log(error);
          }
     });

}

//function called if user inputs spotify-this-song on process.argv[2], will print album information.
function spotifyThisSong(){
    //default the query to song name "All the small things", by Blink-182, if user does not input a song on process.argv[3].
    query = "All the small things";

    //if user does enter a song name it will pass the query to the spotify.search
    if(value != undefined || null){
        query = value;
    }
    spotify.search({ type: 'track', query: query }, function(err, data) {

        //if the search is not a success, will print an error.
        if ( err ) {
            console.log('Error occurred: ' + err);
            return;
        }

        //This will print, Artist Name, Song Name, Spotify song URL and album title.
        console.log("\n=============================================\n");
        console.log("Artist name: " + data.tracks.items[0].artists[0].name);
        console.log("Song name: " + data.tracks.items[0].name);
        console.log("Spotify song url: " + data.tracks.items[0].preview_url);
        console.log("Album title: " + data.tracks.items[0].album.name)
        console.log("\n=============================================\n");

        fs.appendFile('log.txt',"\n====================Spotify this song!=======================\n" + "Artist name: " + data.tracks.items[0].artists[0].name + "\nSong name: " + data.tracks.items[0].name + "\nSpotify song url: " + data.tracks.items[0].preview_url + "\nAlbum title: " + data.tracks.items[0].album.name + "\n============================================================\n")
    });

}

//function called if user inputs movie-this on process.argv[2], will print movie information
function movieThis(){
    /*
    * This will output the following information to your terminal/bash window:

    * Title of the movie.
    * Year the movie came out.
    * IMDB Rating of the movie.
    * Country where the movie was produced.
    * Language of the movie.
    * Plot of the movie.
    * Actors in the movie.
    * Rotten Tomatoes Rating.
    * Rotten Tomatoes URL.

* If the user doesn't type a movie in, the program will output data for the movie 'Mr. Nobody.'
    * If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
    * It's on Netflix!
    */

    //will default to the movie "Mr. Nobody", if the user does not input something on process.argv[3].
     query = "Mr. Nobody";

     //if user does enter a movie name on process.argv[3], will pass the  query to the request function.
     if (value !== undefined || null) {
          query = value;
     }
     request('http://www.omdbapi.com/?t=' + query + "&tomatoes=true", function (error, response, body) {
          if (!error && response.statusCode == 200) {
               var movieData = JSON.parse(body);
               console.log("\n=============================================\n");
               console.log("Title: " + movieData.Title);
               console.log("Year: " + movieData.Year);
               console.log("IMDB Rating: " + movieData.imdbRating);
               console.log("Country: " + movieData.Country);
               console.log("Language: " + movieData.Language);
               console.log("Plot: " + movieData.Plot);
               console.log("Actors: " + movieData.Actors);
               console.log("Rotten Tomatoes Rating: " + movieData.Ratings[1].Value);
               console.log("Rotten Tomatoes URL: " + movieData.tomatoURL);
               console.log("\n=============================================\n");

               //will log movie information into the log.txt file, will append data when function is called.
               fs.appendFile('log.txt',"\n====================OMBD Movie title info=======================\n" + "Title: " + movieData.Title + "\n" + "Year: " + movieData.Year + "\n" + "IMDB Rating: " + movieData.imdbRating + "\n" + "Country: " + movieData.Country + "\n" + "Language: " + movieData.Language + "\n" + "Plot: " + movieData.Plot + "\n" + "Actors: " + movieData.Actors + "\n" + "Rotten Tomatoes Rating: " + movieData.Ratings[1].Value + "\n" + "Rotten Tomatoes URL: " + movieData.tomatoURL + "\n=============================================\n");
          }
          else {
               console.log(error);
          }
     });
}

//function called when user inputs do-What-It-Says, will run spotify-this-song, and pass the text in the random.txt file.
function doWhatItSays() {
    //will pass the text from random.txt, using the fs.readFile function, created above as a global.
    fs.readFile("random.txt", "utf8", function(error, data) {
        //if there is an error will print an error
        if(error){
            console.log(error);
        }
        //if a success create an array queryArr, that will hold the action, and song query
            var queryArr = data.split(",");

            //assigned query to queryArr[1], to pass into spotify search.
            query = queryArr[1];

      spotify.search({ type: 'track', query: query }, function(err, data) {

          //if the search is not a success, will print an error.
          if ( err ) {
              console.log('Woops, somthing happened bro! ' + err);
              return;
          }

          //This will print, Artist Name, Song Name, Spotify song URL and album title.
          console.log("\n====================Spotify this song!======================\n");
          console.log("Artist name: " + data.tracks.items[0].artists[0].name);
          console.log("Song name: " + data.tracks.items[0].name);
          console.log("Spotify song url: " + data.tracks.items[0].preview_url);
          console.log("Album title: " + data.tracks.items[0].album.name)
          console.log("\n============================================================\n");

          fs.appendFile('log.txt',"\n====================-Random Spotify this song!=======================\n" + "\nArtist name: " + data.tracks.items[0].artists[0].name + "\nSong name: " + data.tracks.items[0].name + "\nSpotify song url: " + data.tracks.items[0].preview_url + "\nAlbum title: " + data.tracks.items[0].album.name + "\n============================================================\n")
      });

            
    });
    
}