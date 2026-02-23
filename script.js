let selectedNeed = null;

/* ======================
   EKRAN YÖNETİMİ
====================== */
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.remove('active');
  });
  document.getElementById(id).classList.add('active');
}

function selectMode(mode) {
  if (mode === 'requester') {
    showScreen('requester-mode');
  } else {
    showScreen('helper-mode');
  }
}

/* ======================
   YARDIM TALEBİ OLUŞTURMA
====================== */
function createHelpRequest(lat, lon, need) {
  return {
    need: need,
    lat: lat,
    lon: lon,
    time: Date.now()
  };
}

function selectNeed(need) {
  selectedNeed = need;
  alert("Seçilen ihtiyaç: " + need);
}

/* ======================
   OFFLINE QUEUE
====================== */
function saveToQueue(request) {
  let queue = JSON.parse(localStorage.getItem("helpQueue")) || [];
  queue.push(request);
  localStorage.setItem("helpQueue", JSON.stringify(queue));
}

function sendToServer(request) {
  return new Promise((resolve) => {
    console.log("Gönderildi:", request);
    setTimeout(resolve, 1000); // server simülasyonu
  });
}

async function flushQueue() {
  if (!navigator.onLine) return;

  let queue = JSON.parse(localStorage.getItem("helpQueue")) || [];
  if (queue.length === 0) return;

  let remaining = [];

  for (let req of queue) {
    try {
      await sendToServer(req);
    } catch {
      remaining.push(req);
    }
  }

  localStorage.setItem("helpQueue", JSON.stringify(remaining));
}

window.addEventListener("online", flushQueue);

/* ======================
   YARDIM GÖNDERME
====================== */
function sendHelpRequest() {
  if (!selectedNeed) {
    alert("Lütfen bir ihtiyaç seç.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lon = pos.coords.longitude;

      const request = createHelpRequest(lat, lon, selectedNeed);

      if (navigator.onLine) {
        sendToServer(request);
      } else {
        saveToQueue(request);
      }

      showScreen("waiting-screen");
    },
    () => {
      alert("Konum alınamadı.");
    }
  );
}

/* ======================
   YARDIMCI MODU
====================== */
function markHelped() {
  showScreen('helper-mode');
}

function acceptHelp() {
  alert("Yardım talebi kabul edildi.");
}

function refreshList() {
  alert("Liste yenilendi (mock).");
}
//bluetooth ile yardım isteme
async function sendBluetoothSignal() {
  if (!navigator.bluetooth) {
    alert("Bluetooth desteklenmiyor.");
    return;
  }

  try {
    // Basit ve yaygın bir servis UUID (POC için yeterli)
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: ['battery_service']
    });

    alert("Yakındaki cihaza sinyal gönderildi (POC).");
    console.log("Bluetooth cihazı:", device.name);

  } catch (error) {
    console.log("Bluetooth iptal edildi:", error);
  }
}