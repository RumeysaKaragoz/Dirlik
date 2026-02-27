# 🛡️ Dirlik (Afet Yönetimi & SOS Sistemi)

![Build Status](https://img.shields.io/badge/Version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Platform](https://img.shields.io/badge/Platform-Web-orange.svg)

**Dirlik**, afet anlarında kaosu azaltmak, yardıma ihtiyacı olanlar ile yardımcı olmak isteyenleri buluşturmak ve hayati bilgilere erişimi hızlandırmak amacıyla geliştirilmiş, **Amoled-First** tasarıma sahip bir web uygulamasıdır.

> **"Dirlik için, Birlik!"**

---

## 📱 Genel Bakış

Afet anlarında düşük ışık koşullarında gözü yormayan, pil tasarrufu sağlayan ve panik anında bile hata payını düşüren **2x2 Dev Buton** arayüzü ile tasarlanmıştır.



## 🔥 Temel Özellikler

### 🆘 SOS & Yardım İsteme
- **Kritik Seviye Bildirimi:** Aciliyet durumuna göre (Ekstrem, Yüksek, Orta) farklı modlar.
- **Enkaz Modu:** Tek tuşla ekranı karartıp sadece hayati bilgilere ve sesli ikaz butonuna odaklanan özel arayüz.
- **Dinamik Renk Kodları:** Durumuna göre arka plan renginin otomatik değişmesi (Görsel farkındalık).

### 🤝 Yardımcı Paneli
- **Filtrelenebilir İhtiyaçlar:** Tıbbi destek, gıda, arama-kurtarma gibi kategorilere göre listeleme.
- **Gerçek Zamanlı Veri:** LocalStorage ve simüle edilmiş API ile hızlı veri akışı.

### 🛡️ Afet Yönetim Merkezi
- **Kritik Lokasyonlar:** En yakın Toplanma Alanı, Eczane ve Hastaneleri Google Maps entegrasyonu ile tek tıkla bulma.
- **Canlı Haber Akışı:** Son dakika deprem ve afet haberlerini anlık takip etme.

### 🔊 Sesli İlkyardım Rehberi
- **Sesli Komutlar:** Panik anında okumak yerine dinleyerek ilkyardım (Enkaz altı, Kanama durdurma, Kalp masajı).
- **Offline Erişim:** İnternet kesilse dahi cache üzerinden çalışan rehber sayfası.

## 🛠️ Teknik Altyapı

- **Frontend:** Pure HTML5, CSS3 (Custom Variables, Grid, Flexbox).
- **Logic:** Vanilla JavaScript (ES6+).
- **PWA Ready:** Manifest ve Service Worker uyumlu yapı.
- **Responsive:** Mobile-first, Desktop-optimized container yapısı.

## 📂 Dosya Yapısı

```text
├── audio/              # .mp3 formatında ilkyardım talimatları
├── firstaid.html       # Bağımsız sesli rehber sayfası
├── index.html          # Ana uygulama (PWA giriş kapısı)
├── style.css           # Hiyerarşik ve optimize edilmiş CSS
├── script.js           # Uygulama mantığı ve ekran yönetimi
└── audio.js            # Ses motoru fonksiyonları
