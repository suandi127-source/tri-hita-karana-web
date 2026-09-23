# Tri Hita Karana — Interactive Web Experience

🌐 **Live Preview**: [https://suandi127-source.github.io/tri-hita-karana-web/](https://suandi127-source.github.io/tri-hita-karana-web/)

Sebuah website interaktif yang memperkenalkan dan mengeksplorasi filosofi kearifan lokal Bali: **Tri Hita Karana** (tiga penyebab terciptanya kebahagiaan dan keharmonisan).

1. **Parahyangan** — Harmoni hubungan manusia dengan Sang Pencipta / Tuhan.
2. **Pawongan** — Harmoni hubungan manusia dengan sesama.
3. **Palemahan** — Harmoni hubungan manusia dengan alam dan lingkungan.

---

## 🚀 Cara Menjalankan

### Menggunakan Node.js:
```bash
npm run dev
# atau
node server.cjs
```
Buka browser di **[http://localhost:4182](http://localhost:4182)**.

### Menggunakan Python (Alternatif tanpa Node):
```bash
python -m http.server 4182
```

---

## 📂 Struktur File
* `index.html` — Struktur halaman semantik & konten.
* `css/style.css` — Tema hijau hutan, animasi, dan responsivitas mobile/desktop.
* `js/app.js` — Logika tab pilar, modal dialog, dan kuis interaktif.
* `assets/` — Gambar ilustrasi lanskap, preview, dan foto budaya.
* `server.cjs` — Server statis lokal ringan (port 4181).
* `AGENTS.md` — Panduan standar bagi AI coding assistant (Antigravity, Codex, Hermes).
* `STATUS.md` — Log status dan catatan handoff antar-agen.

---

## 🤖 Bekerja dengan Multi-Agent (AG, Codex, Hermes)
Project ini didesain agar bisa diedit dan dikembangkan dengan lancar oleh berbagai AI assistant di berbagai perangkat (laptop, WSL, mobile via gateway):
* Selalu baca **`STATUS.md`** sebelum mulai mengerjakan fitur baru.
* Perbarui **`STATUS.md`** setelah menyelesaikan pekerjaan.
