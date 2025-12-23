# 🎴 Remi Box Score

**Remi Box Score** adalah aplikasi web berbasis **Nuxt.js** yang digunakan untuk mencatat, menghitung, dan menampilkan skor permainan **Remi Box** secara **real-time**, **offline**, dan **mudah digunakan**.

Aplikasi ini dirancang khusus untuk permainan 4–5 pemain dengan jumlah sesi yang tidak terbatas, dilengkapi ranking otomatis, undo/edit sesi, serta ekspor hasil permainan ke PDF.

---

## ✨ Fitur Utama

- 👥 **Manajemen Pemain**
  - Mendukung 4–5 pemain
  - Tambah / hapus input pemain secara dinamis
  - Ganti nama pemain di tengah permainan (skor tetap dilanjutkan)

- 🧮 **Perhitungan Skor Otomatis**
  - Skor per sesi (bilangan negatif & positif)
  - Akumulasi skor total otomatis
  - Validasi input real-time

- 📊 **Ranking Live**
  - Ranking diperbarui setiap sesi
  - Skor tertinggi = pemenang
  - Tie-break berdasarkan skor sesi terakhir

- ↩️ **Undo & Edit**
  - Undo sesi terakhir
  - Edit skor sesi sebelumnya

- 📄 **Export PDF**
  - Unduh tabel skor & ranking akhir dalam format PDF

- 💾 **Offline-First**
  - Tanpa backend
  - Data tersimpan di `localStorage`
  - Aman saat refresh halaman
  - Siap dikembangkan ke backend di masa depan

- 📱 **Mobile-First UI**
  - Optimal untuk smartphone
  - Responsif di semua ukuran layar

---

## 🛠️ Teknologi yang Digunakan

- ⚡ **Nuxt.js (v4 / latest)**
- 🧠 **Pinia**
- 🎨 **Tailwind CSS**
- 📄 **jsPDF + AutoTable**
- 🧩 **TypeScript**
- 💾 **LocalStorage**

---

## 🚀 Instalasi & Menjalankan Proyek

### Install Dependencies

```bash
npm install
```

### Development Mode

```bash
npm run dev
```

Akses di: http://localhost:3000

---

## 🌍 Deployment

Proyek ini dapat dideploy sebagai static site menggunakan GitHub Pages, Netlify, atau Cloudflare Pages.

Pastikan:
- `ssr: false`
- `baseURL` sesuai nama repository

---
## 🤝 Kontribusi

Kami menyambut kontribusi dari siapa saja! Silakan buat pull request atau issue jika kamu ingin membantu mengembangkan aplikasi ini.

## 📄 Lisensi

MIT License  
© 2025 — Dibuat dengan ❤️ menggunakan Nuxt.js
