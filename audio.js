let currentAudio = null;

function playAudio(audioPath) {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }
  currentAudio = new Audio(audioPath);
  currentAudio.play().catch(error => {
    console.error("Ses çalınamadı:", error);
    alert("Ses dosyasına ulaşılamadı veya tarayıcı engelledi.");
  });
}
