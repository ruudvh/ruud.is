window.onload = function mainFunction() {
	/***************
	 ** GIPHY
	 ***************/

	const gifbg_div = document.getElementById("gifbg");
	const author_img_div = document.getElementById("author-img");

	// Giphy API defaults
	const giphy = {
		baseURL: "https://api.giphy.com/v1/gifs/",
		apiKey: "6OjDYPnScVn68ZSJrSr3GlbLIcsKoWbR",
		tag: "funny", // funny, fail, etc
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
		.then(response => response.json())
		.then(data => renderGif(data.data))
		.catch((error) => {
			console.error('Error:', error);
		});

	// Display Gif in gif wrap container
	let renderGif = _giphy => {
		// Set gif background
		gifbg_div.style.backgroundImage = 'url("' + _giphy.images.original.url + '")';

		// Set author info
		author_img_div.style.backgroundImage = 'url("./static/tv_static.gif")';
		$("#author-name").text('Gif from: ' + _giphy.source_tld);
		if (_giphy.user) {
			author_img_div.style.backgroundImage = 'url("' + _giphy.user.avatar_url + '")';
			$("#author-name").text('Gif by: ' + _giphy.user.display_name);
		}

		// Auto load new gif
		refreshGif();
	};

	// Static gif + sound
	let static_audio = new Audio('static/tv_audio.wav');
	static_audio.volume = 0.3;
	let renderStatic = () => {
		static_audio.play();
		gifbg_div.style.backgroundImage = 'url("./static/tv_static.gif")';
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

	/***************
	 ** CONSOLE
	 ***************/

	// TODO
	// remove Jquery, switch to plain JS

	//Enter button
	$(document).on('keydown', function (e) {
		var x = event.which || event.keyCode;
		if (x === 13 || x == 13) {
			var consoleLine = $('#tag-input').val();
			executeLine(consoleLine);
		}
	});
	$(document).on('keydown', function (e) {
		var x = event.which || event.keyCode;
		var line = $('#tag-input');
		var length = line.val().length;
		if (x != 8) {
			line.attr("size", 1 + length);
		} else {
			line.attr("size", length * .95);
		}
		if (length === 0) {
			$('#tag-input').attr("size", '14');
		}
	});

	//Execute the line
	function executeLine(command) {
		let CurrentCommand = command.toLowerCase();
		let giphyCat = CurrentCommand.replace("//", "").split(' ')[0];

		if (giphyCat == '') {
			giphyCat = 'funny';
		}
		giphyURL = encodeURI(
			giphy.baseURL +
			giphy.type +
			"?api_key=" +
			giphy.apiKey +
			"&tag=" +
			giphyCat +
			"&rating=" +
			giphy.rating +
			"&limit=" +
			giphy.limit
		);

		$("#tag-input").val('');
		$("#tag-watching").text("Now watching: '" + giphyCat + "'");

		renderStatic();
		newGif();
	}

	/***************
	 ** Init
	 ***************/

	// Load gif
	newGif();

	// Focus input field
	$('#tag-input').focus();
};