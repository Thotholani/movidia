require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

const baseUrl = "https://api.themoviedb.org/3/search/movie?api_key=";
const apiKey = process.env.API_KEY;
const parameters = "&language=en-US&query=";
const additionalParameters = "&page=1&include_adult=false";

let hero = "hero.jpg";

app.get("/", function (req, res, err) {
	res.render("index", { heroImage: hero });
});

app.post("/search", function (req, res) {
	let title = "";
	title = req.body.title;
	title = encodeURIComponent(title);

	let url = baseUrl + apiKey + parameters + title + additionalParameters;
	let image = "https://image.tmdb.org/t/p/original";
	let bgImage = "https://image.tmdb.org/t/p/original";
	let name = "";
	let description = "";
	let date = "";
	let rating = "";
	// console.log(url);

	https.get(url, function (httpRes) {
		try {
			if (!process.env.API_KEY) {
				res.send("ERROR! You did not provide your api key");
			}

			if (httpRes.statusCode === 200) {
				httpRes.on("error", function () {
					console.log("error occured");
				});
				httpRes.on("data", function (data) {
					data = JSON.parse(data);
					data = data.results.slice(0, 2);

					console.log(data);

					background = bgImage + data[0].backdrop_path;
					image = image + data[0].poster_path;
					name = data[0].original_title;
					description = data[0].overview;
					date = data[0].release_date;
					rating = data[0].vote_average;

					res.render("film", {
						filmName: name,
						filmImage: image,
						filmDescription: description,
						filmRating: rating,
						filmReleaseDate: date,
						filmBackground: background,
					});
				});
			}
		} catch (error) {
			err(error);
		}
	});
});

app.get("/watch", function (req, res) {
	res.render("watch");
});

app.listen(3000, function () {
	console.log("Server started on port 3000");
});

// https://api.themoviedb.org/3/search/movie?api_key=56864ceb57832e860890334368f1ab3e&language=en-US&query=Pacific%20Rim&page=1&include_adult=false
// &language=en-US&query=Pacific%20Rim&page=1&include_adult=false
