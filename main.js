window.onload = function exampleFunction() {

	// Giphy API defaults
	const giphy = {
		baseURL: "https://api.giphy.com/v1/gifs/",
		apiKey: "6OjDYPnScVn68ZSJrSr3GlbLIcsKoWbR",
		tag: "", // funny, fail, etc
		type: "random", //random, trending -> doens't work with trending yet, returns array instead of single gif
		rating: "pg-13",
		limit: 1
	};

	// Giphy API URL
	let giphyURL = encodeURI(
		giphy.baseURL +
		giphy.type +
		"?api_key=" +
		giphy.apiKey +
		"&tag=" +
		giphy.tag +
		"&rating=" +
		giphy.rating +
		"&limit=" +
		giphy.limit
	);

	// Call Giphy API and render data
	let newGif = () => fetch(giphyURL)
		.then(response  => response.json())
		.then(data => renderGif(data.data))
		.catch((error) => {
		  console.error('Error:', error);
		});

	// Display Gif in gif wrap container
	const gif_wrap = document.getElementById("gifbg");
	let renderGif = _giphy => {
		gif_wrap.style.backgroundImage ='url("' + _giphy.images.original.url + '")';

		// Auto load new gif
		refreshGif();
	};

	// Static gif + sound
	let static_audio = new Audio('static/tv_audio.wav');
	static_audio.volume = 0.3;
	let renderStatic = () => {
		static_audio.play();
		gif_wrap.style.backgroundImage ='url(https://media.giphy.com/media/45aI8f1nI1b071X96C/giphy.gif)';
	};

	// Auto load new gif
	let refresh;
	const duration = 1000 * 10;
	let refreshGif = () => {
		clearInterval(refresh);
		refresh = setInterval(function () {
			renderStatic();
			newGif();
		}, duration);
	};

	newGif();
};