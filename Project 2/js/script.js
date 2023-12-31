console.log("Let's write JS");
let currentSong = new Audio();
let songs;
let currfolder;

function secondsToMinutesAndSeconds(seconds) {
	// Ensure seconds is a non-negative integer
	if (!Number.isInteger(seconds) || seconds < 0) {
		return "00:00";
	}

	// Calculate minutes and remaining seconds
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;

	// Format the result with leading zeros
	const formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
	const formattedSeconds =
		remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

	return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
	currfolder = folder;
	let a = await fetch(`/songs/${folder}/`);
	let response = await a.text();
	let div = document.createElement("div");
	div.innerHTML = response;
	let as = div.getElementsByTagName("a");
	songs = [];
	for (let index = 0; index < as.length; index++) {
		const element = as[index];
		if (element.href.endsWith(".mp3")) {
			songs.push(element.href.split(`/${folder}/`)[1]);
		}
	}
	let songUL = document
		.querySelector(".songlist")
		.getElementsByTagName("ul")[0];
	songUL.innerHTML = "";
	for (const song of songs) {
		songUL.innerHTML =
			songUL.innerHTML +
			`<li>
						<img class="invert" src="imgs/music.svg" alt="music">
						<div class="info">
							<div class="w-2">${song.replaceAll("%20", " ")}</div>
							<div class="w-2">${currfolder}</div>
						</div>
						<div class="playNow">
							<span>Play Now</span>
							<img class="invert" src="imgs/play.svg" alt="play">
						</div>
						</li>`;
	}

	Array.from(
		document.querySelector(".songlist").getElementsByTagName("li")
	).forEach((e) => {
		e.addEventListener("click", (element) => {
			playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
		});
	});
	return songs;
}

const playMusic = (music, pause = false) => {
	currentSong.src = `songs/${currfolder}/` + music;
	if (!pause) {
		currentSong.play();
		play.src = "imgs/pause.svg";
	}
	let w20 = music.replaceAll("%20", " ");
	document.querySelector(".songinfo").innerHTML = w20.replaceAll(".mp3", "");
	document.querySelector(".songtime").innerHTML = "00:00/00:00";
};

async function displayAlbms() {
	let a = await fetch(`/songs/`);
	let response = await a.text();
	let div = document.createElement("div");
	div.innerHTML = response;
	let anchours = div.getElementsByTagName("a");
	let cardContainer = document.querySelector(".cardContainar");
	let array = Array.from(anchours);
	for (let index = 0; index < array.length; index++) {
		const e = array[index];

		if (e.href.includes("/songs")  && !e.href.includes(".htaccesss")){
			let folder = e.href.split("/").slice(-2)[0];
			let b = await fetch(`/songs/${folder}/info.json`);
			let response = await b.json();

			cardContainer.innerHTML =
				cardContainer.innerHTML +
				`<div data-folder="${folder}" class="card">
			<div class="play">
				<svg width="36px" height="36px" viewBox="0 0 24 24" fill="none"
					xmlns="http://www.w3.org/2000/svg">
					<circle cx="12" cy="12" r="10" stroke="#1ed760" stroke-width="1.5" fill="#1ed760" />
					<path
						d="M15.4531 12.3948C15.3016 13.0215 14.5857 13.4644 13.1539 14.3502C11.7697 15.2064 11.0777 15.6346 10.5199 15.4625C10.2893 15.3913 10.0793 15.2562 9.90982 15.07C9.5 14.6198 9.5 13.7465 9.5 12C9.5 10.2535 9.5 9.38018 9.90982 8.92995C10.0793 8.74381 10.2893 8.60868 10.5199 8.53753C11.0777 8.36544 11.7697 8.79357 13.1539 9.64983C14.5857 10.5356 15.3016 10.9785 15.4531 11.6052C15.5156 11.8639 15.5156 12.1361 15.4531 12.3948Z"
						stroke="#000" stroke-width="1.5" stroke-linejoin="round" fill="#000" />
				</svg>
			</div>
			<img src="/songs/${folder}/cover.jpg" alt="${folder}">
			<h2>${response.title}</h2>
			<p>${response.discription}</p>
		</div>`;
		}
	}
	Array.from(document.getElementsByClassName("card")).forEach((e) => {
		e.addEventListener("click", async (item) => {
			songs = await getSongs(`${item.currentTarget.dataset.folder}`);
			playMusic(songs[0])
		});
	});
}

async function main() {
	await getSongs("AtifAslam");
	playMusic(songs[0], true);

	displayAlbms();

	play.addEventListener("click", () => {
		if (currentSong.paused) {
			currentSong.play();
			play.src = "imgs/pause.svg";
		} else {
			currentSong.pause();
			play.src = "imgs/play.svg";
		}
	});

	currentSong.addEventListener("timeupdate", () => {
		document.querySelector(
			".songtime"
		).innerHTML = `${secondsToMinutesAndSeconds(
			parseInt(currentSong.currentTime)
		)}/${secondsToMinutesAndSeconds(parseInt(currentSong.duration))}`;
		document.querySelector(".circle").style.left =
			(currentSong.currentTime / currentSong.duration) * 100 + "%";
	});

	document.querySelector(".seekbar").addEventListener("click", (e) => {
		let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
		document.querySelector(".circle").style.left = percent + "%";
		currentSong.currentTime = (currentSong.duration * percent) / 100;
	});

	document.querySelector(".hamburger").addEventListener("click", () => {
		document.querySelector(".left").style.left = "0";
	});

	document.querySelector(".close").addEventListener("click", () => {
		document.querySelector(".left").style.left = "-120%";
	});

	previous.addEventListener("click", () => {
		let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
		if (index - 1 >= 0) {
			playMusic(songs[index - 1]);
		}
	});

	next.addEventListener("click", () => {
		currentSong.pause();
		let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
		if (index + 1 < songs.length - 1) {
			playMusic(songs[index + 1]);
		}
	});

	document
		.querySelector(".range")
		.getElementsByTagName("input")[0]
		.addEventListener("change", (e) => {
			currentSong.volume = parseFloat(e.target.value / 100);
		});

	document.querySelector(".volume>img").addEventListener("click", e=>{
		// console.log(e.target)
		if (e.target.src.includes("volume.svg")){
			e.target.src = e.target.src.replace('volume.svg','mute.svg');
			currentSong.volume = 0;
			document.querySelector(".range").getElementsByTagName("input")[0].value = 0
		}
		
		else{
			e.target.src = e.target.src.replace('mute.svg', 'volume.svg');
			currentSong.volume = 1;
			document.querySelector(".range").getElementsByTagName("input")[0].value = 100
		}
	})
}

main();
