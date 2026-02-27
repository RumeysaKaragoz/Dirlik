const API_URL = "https://api.npoint.io/433d2b54b3c3bb324e23";
let allData = [];
let currentSosStatus = "";

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

// 1. EKRAN YÖNETİMİ
function showScreen(screenId) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  const targetScreen = document.getElementById(screenId);

  if (targetScreen) {
    targetScreen.classList.add("active");
  }
  if(screenId === 'guide-mode') {
        updateNewsFeed();
    }
  if (screenId === "helper-mode") {
    fetchData();
    renderMyTasks(); 
  }
}

// 2. SOS DURUM SEÇİMİ
function setSosStatus(status, element) {
  currentSosStatus = status;

  document.querySelectorAll(".sos-btn").forEach((btn) => {
    btn.classList.remove("selected-status");
    btn.style.opacity = "0.4";
  });

  element.classList.add("selected-status");
  element.style.opacity = "1";
  element.style.border = "3px solid white";

  if (status === "Enkaz Altında") {
    document.body.className = "mode-extreme";
  } else if (status === "Yaralı") {
    document.body.className = "mode-high";
  } else if (status === "Diğer") {
    document.body.className = "mode-other";
    const noteArea = document.getElementById("sos-note");
    if (noteArea) noteArea.focus();
  } else {
    document.body.className = "mode-medium";
  }
}

// 3. SOS GÖNDERME SÜRECİ
async function sendSOSProcess() {
    if(!currentSosStatus) {
        alert("Lütfen bir durum seçin!");
        return;
    }

    const note = document.getElementById('sos-note').value;
    
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const battery = await navigator.getBattery();
            const batteryLevel = Math.round(battery.level * 100);

            const finalPayload = {
                id: Date.now(),
                tip: 'ihtiyac',
                status: currentSosStatus,
                note: note,
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
                pil: batteryLevel,
                tarih: new Date().toISOString()
            };

            console.log("Sinyal Kaydedildi:", finalPayload);
            localStorage.setItem('sos_sent', "true");
            localStorage.setItem('last_my_sos', JSON.stringify(finalPayload));
            
            
            if(currentSosStatus === 'Enkaz Altında') {
                startAudioSignal();
                startBluetoothBeacon();
                showScreen('waiting-screen');
            } else {
                alert("Talebiniz başarıyla iletildi. Ana sayfaya yönlendiriliyorsunuz.");
                showScreen('mode-select'); 
            }

        }, (err) => {
            alert("Konum izni olmadan sinyal gönderilemez.");
        });
    }
}

function calculateUrgency(status, battery) {
  let score = 0;
  if (status === "Enkaz Altında") score += 7;
  else if (status === "Yaralı") score += 5;
  else if (status === "Gıda / Su") score += 3;
  else score += 2;

  if (battery < 15) score += 3;
  else if (battery < 30) score += 1;
  return Math.min(score, 10);
}

// 4. YARDIMCI (API) VE GÖREV ÜSTLENME
async function fetchData() {
  const banner = document.getElementById("offline-banner");
  const loader = document.getElementById("loader");

  try {
    const res = await fetch(API_URL);
    allData = await res.json();
    if (banner) banner.classList.add("hidden");
    localStorage.setItem("cached_help", JSON.stringify(allData));
  } catch (e) {
    allData = JSON.parse(localStorage.getItem("cached_help")) || [];
    if (banner) banner.classList.remove("hidden");
  } finally {
    if (loader) loader.style.display = "none";
    renderHelperUI();
  }
}

function renderHelperUI() {
  const filterContainer = document.getElementById("dynamic-filters");
  if (!filterContainer) return;

  const categories = [
    "hepsi",
    "acil",
    ...new Set(allData.map((i) => i.kategori)),
  ];

  filterContainer.innerHTML = categories
    .map(
      (cat) =>
        `<button onclick="filterRequests('${cat}')">${cat.toUpperCase()}</button>`,
    )
    .join("");

  renderData(allData);
}

function filterRequests(type) {
  let filtered =
    type === "hepsi"
      ? allData
      : type === "acil"
        ? allData.filter((i) => i.acil)
        : allData.filter((i) => i.kategori === type);
  renderData(filtered);
}

function renderData(data) {
  const list = document.getElementById("request-list");
  if (!list) return;

  list.innerHTML = data
    .map(
      (item) => `
        <div class="card ${item.acil ? "urgent-card" : ""}">
            <div class="card-header">
                <small>#${item.kategori.toUpperCase()}</small>
            </div>
            <h3>${item.baslik || item.durum || "Yardım Talebi"}</h3>
            <p>${item.detay || item.note || "Detay belirtilmemiş."}</p>
            <div class="info">📍 ${item.konum || "Konum Belirtilmedi"}</div>
            <button class="assign-btn" onclick="assignTask('${item.id}')">Görevi Üstlen</button>
        </div>
    `,
    )
    .join("");
}

// GÖREV ÜSTLENME 
function assignTask(id) {
  const task = allData.find((i) => String(i.id) === String(id));

  if (!task) {
    console.error("Görev bulunamadı: ", id);
    return;
  }

  let myTasks = JSON.parse(localStorage.getItem("my_tasks")) || [];

  if (!myTasks.find((t) => String(t.id) === String(id))) {
    myTasks.push({ ...task, done: false });
    localStorage.setItem("my_tasks", JSON.stringify(myTasks));
    renderMyTasks();
    alert("Görev listenize eklendi.");
  } else {
    alert("Bu görevi zaten üstlendiniz.");
  }
}

function renderMyTasks() {
  const container = document.getElementById("saved-tasks");
  if (!container) return;

  const tasks = JSON.parse(localStorage.getItem("my_tasks")) || [];

  if (tasks.length === 0) {
    container.innerHTML =
      "<p style='color:gray; padding:10px;'>Henüz bir görev üstlenmediniz.</p>";
    return;
  }

  container.innerHTML = tasks
    .map(
      (t) => `
        <div class="card ${t.done ? "completed" : ""}">
            <h3>${t.baslik || t.detay}</h3>
            <div class="task-actions">
                ${t.done ? "<span>✅ Tamamlandı</span>" : `<button class="done-btn" onclick="markTaskDone('${t.id}')">Tamamladım</button>`}
                <button class="remove-btn" onclick="removeTask('${t.id}')">Kaldır</button>
            </div>
        </div>
    `,
    )
    .join("");
}

function markTaskDone(id) {
  let tasks = JSON.parse(localStorage.getItem("my_tasks")) || [];
  tasks = tasks.map((t) =>
    String(t.id) === String(id) ? { ...t, done: true } : t,
  );
  localStorage.setItem("my_tasks", JSON.stringify(tasks));
  renderMyTasks();
}

function removeTask(id) {
  let tasks = JSON.parse(localStorage.getItem("my_tasks")) || [];
  tasks = tasks.filter((t) => String(t.id) !== String(id));
  localStorage.setItem("my_tasks", JSON.stringify(tasks));
  renderMyTasks();
}

// Başlangıç Ayarları
document.addEventListener("DOMContentLoaded", () => {
  renderMyTasks();
});
let alarmInterval = null;
let audioCtx = null;
let oscillator = null;

// Sesli Sinyal
function startAudioSignal() {
  if (alarmInterval) return;

  console.log("🔊 Sesli sinyal modu aktif.");
  playAlarm(); 
  alarmInterval = setInterval(playAlarm, 30000);
}

function playAlarm() {
  try {
    if (!audioCtx)
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(1000, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);

    oscillator.connect(gain);
    gain.connect(audioCtx.destination);

    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 2); 
  } catch (e) {
    console.error("Ses çalınamadı:", e);
  }
}

function stopAudioSignal() {
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
  if (oscillator) {
    try {
      oscillator.stop();
    } catch (e) {}
  }
  console.log("🔇 Sesli sinyal tamamen durduruldu.");
}
function markHelped() {
  localStorage.removeItem("sos_sent");
  localStorage.removeItem("last_my_sos");
  stopAudioSignal(); 
  location.reload(); 
}
//çevrim dışı
async function startBluetoothBeacon() {
    try {
        console.log("🔵 Bluetooth başlatılıyor...");
        const device = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
        });

        console.log("Cihaz bulundu ve eşleşmeye hazır:", device.name);
    } catch (error) {
        console.warn("Bluetooth erişimi reddedildi veya desteklenmiyor:", error);
    }
}

function openMap(query) {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(query)}`;
    window.open(url, '_blank');
}
function updateNewsFeed() {
    const feed = document.getElementById('news-feed');
    // Simüle edilmiş canlı haber akışı
    const news = [
        { time: "16:45", text: "AFAD: Marmara Denizi açıklarında 3.2 sarsıntı kaydedildi.", urgent: false },
        { time: "16:20", text: "Kandilli: Bölgedeki toplanma alanları kapasiteleri güncellendi.", urgent: false },
        { time: "15:10", text: "UYARI: Hasarlı binalara giriş yapmayın.", urgent: true }
    ];

    feed.innerHTML = news.map(item => `
        <div class="news-item ${item.urgent ? 'danger' : ''}">
            <small>${item.time}</small>
            <p>${item.text}</p>
        </div>
    `).join('');
}
