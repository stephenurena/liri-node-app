/* 
* `my-tweets`

* `spotify-this-song`

* `movie-this`

* `do-what-it-says`

*/
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');

request('http://www.omdbapi.com', function (error, response, body) {
  console.log('error:', error); // Print the error if one occurred 
  console.log('statusCode:', response); // Print the response object if a response was received 
  // console.log('body:', body); // Print the HTML for the ombd homepage. 
});