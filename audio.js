let currentAudio = null;

function playAudio(name) {
  if (currentAudio) {
    currentAudio.pause();
  }

  currentAudio = new Audio(`audio/${name}.mp3`);
  currentAudio.play();
}