console.log("Let's write JS");
let currentSong = new Audio();

function secondsToMinutesAndSeconds(seconds) {
    // Ensure seconds is a non-negative integer
    if (!Number.isInteger(seconds) || seconds < 0) {
        return 'Invalid input';
    }

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format the result with leading zeros
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = remainingSeconds < 10 ? '0' + remainingSeconds : remainingSeconds;

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {
	let a = await fetch("http://127.0.0.1:3000/songs/");
	let response = await a.text();
	let div = document.createElement("div");
	div.innerHTML = response;
	let as = div.getElementsByTagName("a");
	let songs = [];
	for (let index = 0; index < as.length; index++) {
		const element = as[index];
		if (element.href.endsWith(".mp3")) {
			songs.push(element.href.split("/songs/")[1]);
		}
	}
	return songs;
}

const playMusic = (music, pause = false) => {
	// let track = new Audio("/songs/" + music);
	currentSong.src = "/songs/" + music;
	if(!pause){
		currentSong.play();
		play.src = "pause.svg";
	}
	document.querySelector(".songinfo").innerHTML = music;
	document.querySelector(".songtime").innerHTML = "00:00/00:00";	
};

async function main() {
	let songs = await getSongs();
	playMusic(songs[0], true)

	let songUL = document
		.querySelector(".songlist")
		.getElementsByTagName("ul")[0];
	for (const song of songs) {
		songUL.innerHTML =
			songUL.innerHTML +
			`<li>
						<img class="invert" src="music.svg" alt="music">
						<div class="info">
							<div class="w-2">${song.replaceAll("%20", " ")}</div>
							<div class="w-2">Amanat</div>
						</div>
						<div class="playNow">
							<span>Play Now</span>
							<img class="invert" src="play.svg" alt="play">
						</div>
						</li>`;
	}

	Array.from(
		document.querySelector(".songlist").getElementsByTagName("li")
	).forEach((e) => {
		e.addEventListener("click", (element) => {
			console.log(e.querySelector(".info").firstElementChild.innerHTML);
			playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
		});
	});

	play.addEventListener("click", () => {
		if (currentSong.paused) {
			currentSong.play();
			play.src = "pause.svg";
		} else {
			currentSong.pause();
			play.src = "play.svg";
		}
	});

	currentSong.addEventListener("timeupdate", () => {
		console.log(currentSong.currentTime, currentSong.duration);
		document.querySelector(".songtime").innerHTML = `${secondsToMinutesAndSeconds(parseInt(currentSong.currentTime))}/${secondsToMinutesAndSeconds(parseInt(currentSong.duration))}`
		document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
	})


	document.querySelector(".seekbar").addEventListener("click",e=>{
		let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
		document.querySelector(".circle").style.left = percent + "%";
		currentSong.currentTime = ((currentSong.duration) * percent) / 100;
	})

}
main();
