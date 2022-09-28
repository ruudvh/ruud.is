window.onload = function mainFunction() {
	/***************
	 ** GIPHY
	 ***************/

	const gifbg_div = document.getElementById("gifbg");
	const author_img_div = document.getElementById("author-img");
	
	const channelDuration = 1000 * 10; // Auto loads new gif after x miliseconds
	const channels = ["funny","code","animals","space","family","facepalm","new","politics","sports","animate","tv","movie"]
	let currentChannel = 0; // Based on array `channels`, max 12 channels (max 11 on zero-based index)
	let currentVolume = 3; // Volume of static (max 11 on zero-based index)
	
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
	let on_audio = new Audio('static/tv_on.wav');
	let off_audio = new Audio('static/tv_off.wav');
	let dial_audio = new Audio('static/tv_dial.wav');
	let static_audio = new Audio('static/tv_audio.wav');
	on_audio.volume = 0.3;
	off_audio.volume = 0.3;
	dial_audio.volume = 0.3;
	static_audio.volume = currentVolume / 10;
	let renderStatic = () => {
		static_audio.play();
		gifbg_div.style.backgroundImage = 'url("./static/tv_static.gif")';
	};

	// Auto load new gif
	let refresh;
	let refreshGif = () => {
		clearInterval(refresh);
		refresh = setInterval(function () {
			renderStatic();
			newGif();
		}, channelDuration);
	};

	
	/***************
	 ** TV
	 ***************/
	 
	// Get Channel Dials
	const [channelButton, volumeButton] = document.querySelectorAll(".dial");
	
	// Rotate the Dial
	const moveSelector = (button, direction = 1, event) => {
	  event.preventDefault();
	  const oldValue = button.style.getPropertyValue("--value");
	  const newValue = parseInt(oldValue) + 30 * direction;
	  
	  dial_audio.play();
	  button.style.setProperty("--value", `${newValue}deg`);
	};

	// Change Channel
	const changeChannel = (button, direction = 1, event) => {
		moveSelector(button, 1, event);
		
		if (currentChannel < 11) {
			currentChannel += 1;
		} else {
			currentChannel = 0;
		}	
		
		currentChannelName = channels[currentChannel]; 
		giphyURL = encodeURI(
			giphy.baseURL +
			giphy.type +
			"?api_key=" +
			giphy.apiKey +
			"&tag=" +
			currentChannelName +
			"&rating=" +
			giphy.rating +
			"&limit=" +
			giphy.limit
		);

		$("#tag-input").val('');
		$("#tag-watching").text("Now watching: '" + currentChannelName + "'");

		renderStatic();
		newGif();
	}
	channelButton.addEventListener("click", ev => changeChannel(channelButton, 1, ev));
	channelButton.addEventListener("contextmenu", ev => changeChannel(channelButton, -1, ev));
	
	// Change Volume
	const changeVolume = (button, direction = 1, event) => {
		moveSelector(button, 1, event);
		
		if (currentVolume < 11) {
			currentVolume += 1;
		} else {
			currentVolume = 0;
		}
		static_audio.volume = Math.min(currentVolume / 10, 1);
	}
	volumeButton.addEventListener("click", ev => changeVolume(volumeButton, 1, ev));
	volumeButton.addEventListener("contextmenu", ev => changeVolume(volumeButton, -1, ev));

	// Swith TV on/off
	const [offButton, onButton] = document.querySelectorAll(".button");
	const tv = document.querySelector(".tv");
	onButton.addEventListener("click", () => {
	  static_audio.volume = Math.min(currentVolume / 10, 1);
	  on_audio.play();
	  tv.classList.add("on");
	});
	offButton.addEventListener("click", () => {
	  static_audio.volume = 0;
	  off_audio.play();
	  tv.classList.remove("on");
	});
	
	/***************
	 ** Init
	 ***************/
	 newGif();
};