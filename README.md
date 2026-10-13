# 🎴 KARTU DILEMA DIGITAL: ALGORITHM QUEST

> **"Setiap langkah punya konsekuensi."**

Media pembelajaran interaktif **Informatika** untuk peserta didik **Kelas X / Fase E** — kini **DUA BAGIAN MISI** dalam satu media. Dikembangkan sebagai **media tindakan** dalam Penelitian Tindakan Kelas (PTK):

> *"Penerapan Media Kartu Dilema Digital untuk Meningkatkan Kemampuan Berpikir Algoritmik Peserta Didik Kelas X."*

| Bagian | Modul Ajar | Isi misi |
|---|---|---|
| **BAGIAN 1** | **X.AP.1 — Notasi dan Penulisan Algoritma** | Tutorial teh manis, 10 kartu dilema notasi algoritma, Algorithm Lab (urutan & pseudocode IF/ELSE), Final: Mesin Air Mineral Cerdas |
| **BAGIAN 2** | **X.AP.2 — Instalasi Lingkungan Pemrograman** | Tutorial program pertama "Halo, Dunia!", 10 kartu dilema instalasi (sumber unduhan, layar installer, PATH, verifikasi, troubleshooting), Algorithm Lab (verifikasi instalasi & perbaikan PATH), Final: Menyiapkan Lab Python Kelas |

Kedua bagian berdiri sendiri (progres terpisah) namun memakai satu akun nama, satu sistem skor, dan satu halaman hasil per bagian. Tersedia pula **Ruang Materi**: menu pembahasan lengkap kedua modul (baca sebelum/sesudah bermain), dan **Peta Guru**: pusat akses guru untuk memeriksa seluruh menu tanpa harus menyelesaikan misi.

---

## ✨ Alur Media

| Halaman | Isi |
|---|---|
| **1. Landing** | Identitas media, input nama, **dua kartu pilih bagian (X.AP.1 / X.AP.2)** dengan progres masing-masing, tombol RUANG MATERI, PETA GURU & PANEL GURU |
| **2. Briefing Misi** | Isi berbeda per bagian: Bagian 1 — pengertian algoritma, urutan instruksi, 6 notasi; Bagian 2 — lingkungan pemrograman (editor, interpreter, terminal), alur instalasi 5 langkah |
| **3. Tutorial** | Bagian 1: "Membuat Teh Manis". Bagian 2: "Program Pertama: Halo, Dunia!" — susun urutan langkah, UJI URUTAN, lihat konsekuensinya |
| **4. Kartu Dilema** | **10 kartu per bagian (5 level × 2)**. Setiap kartu: Skenario → Pilih → **Komitmen alasan** → Konsekuensi (simulasi) → Feedback → **Revisi** → **Refleksi mini** |
| **5. Algorithm Lab** | Bagian 1: menyalakan komputer & pseudocode saldo kantin. Bagian 2: **verifikasi instalasi Python & perbaikan PATH yang terlewat** |
| **6. Final Challenge** | Bagian 1: Mesin Air Mineral Cerdas. Bagian 2: **Menyiapkan Lab Python Kelas** (dari cek OS sampai program pertama terverifikasi, dengan blok pengecoh) |
| **7. Hasil Belajar** | Skor (KKTP ≥ 70), kartu selesai, jawaban awal benar, revisi, **progress 5 kemampuan (termasuk indikator Berpikir Algoritmik)**, LIHAT PEMBAHASAN, **unduh CSV untuk data observasi PTK** — per bagian |
| **8. Refleksi** | 3 pertanyaan refleksi akhir (tersimpan & ikut terunduh di CSV) |
| **+ Ruang Materi** | Menu pembahasan **X.AP.1** dan **X.AP.2**: notasi dasar & contoh pseudocode; komponen lingkungan pemrograman, alur instalasi, LKPD verifikasi, perbandingan editor, troubleshooting, etika perangkat lunak |
| **+ Peta Guru** | **Pusat guru: daftar semua menu dalam satu layar** — Ruang Materi (X.AP.1 & X.AP.2, langsung buka modulnya), Panel Guru CSV, dan seluruh tahap kedua bagian (briefing → refleksi, termasuk **10 kartu per level**) dengan **status progres terkini**, semuanya bisa dibuka langsung satu klik. Dilengkapi **MODE JELAJAH BEBAS**: toggle yang membuka semua kunci navigasi, dek kartu, Lab, dan Final Challenge seolah semua progres tercapai — untuk memeriksa materi atau demonstrasi di depan kelas. Ada pengingat & tombol **RESET** sebelum perangkat diserahkan ke siswa |
| **+ Panel Guru** | **Unggah (drag & drop / pilih file) CSV hasil tiap siswa** — campuran Bagian 1 & Bagian 2 bisa sekaligus → rekap kelas: statistik, distribusi skor, **PROGRESS KEMAMPUAN KELAS**, tabel (cari & urut) berlabel materi, detail per siswa **dengan tampilan identik halaman Hasil siswa**, unduh rekap gabungan (CSV) |

### Peta Level Kartu (mengikuti taksonomi modul — sama di kedua bagian)

| Level | Bagian 1 | Bagian 2 | Kemampuan | Bloom |
|---|---|---|---|---|
| 1 | Peta Urutan | Langkah Pasang | Mengidentifikasi urutan langkah | C2–C3 |
| 2 | Baca Kode | Baca Sinyal | Membaca notasi / pesan error & layar installer | C3 |
| 3 | Pemburu Cacat | Detektif Kendala | Menemukan kesalahan & akar masalah | C4 |
| 4 | Dua Jalur | Timbang Pilihan | Membandingkan algoritma / sumber & alat | C5 |
| 5 | Tukang Rakit | Tukang Perbaiki | Memperbaiki & menyusun solusi | P3 |

**Skor:** benar pada percobaan pertama = 10 poin/kartu, benar setelah revisi = 6 poin/kartu, Final Challenge = 10 poin. Total maksimum 110 → dinormalisasi ke 0–100. KKTP mengikuti modul: **minimal 70**.

---

## 🚀 Menjalankan Secara Lokal

```bash
# 1. Clone / ekstrak source
cd kartu-dilema-digital

# 2. Install dependensi (pilih salah satu)
npm install
# atau: bun install
# atau: pnpm install

# 3. Jalankan development server
npm run dev

# 4. Buka http://localhost:3000
```

Build produksi: `npm run build` lalu `npm run start`.

## ▲ Deploy ke Vercel

> **PENTING — cek dulu ini sebelum deploy:** isi repository GitHub kamu **harus persis seperti isi folder ini**, bukan foldernya sendiri. Ketika kamu ekstrak zip, kamu dapat satu folder (mis. `kartu-dilema-digital/`). Yang di-push ke GitHub adalah **ISI** folder itu, sehingga `package.json` berada di **root repository**.

Struktur yang benar:

```
repo-github-kamu/
├── package.json        ← harus di ROOT (bukan di dalam subfolder!)
├── bun.lock
├── next.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── tailwind.config.ts
├── components.json
├── eslint.config.mjs
├── README.md
├── .gitignore
└── src/
    ├── app/
    ├── components/
    ├── hooks/
    └── lib/
```

### Cara 1 — Upload lewat web GitHub (paling cepat)

1. Ekstrak zip, lalu **masuk ke dalam folder hasil ekstrak**.
2. Di GitHub: **New repository** → beri nama → **Create**.
3. Klik **uploading an existing file** → drag **SEMUA file & folder dari DALAM folder hasil ekstrak** (blok semua: `src`, `public`, `package.json`, dst.) → **Commit changes**.
4. Pastikan `package.json` tampil di daftar file root repo. Kalau tidak, berarti yang ke-upload adalah foldernya — hapus, ulangi langkah 3.

### Cara 2 — Lewat Git (disarankan)

```bash
# masuk ke DALAM folder hasil ekstrak
cd kartu-dilema-digital

git init
git add .
git commit -m "Kartu Dilema Digital: Algorithm Quest"
git branch -M main
git remote add origin https://github.com/USERNAME/NAMA-REPO.git
git push -u origin main
```

### Deploy

1. Buka [vercel.com/new](https://vercel.com/new) → pilih repository tersebut.
2. Vercel otomatis mendeteksi **Next.js** — **tidak perlu mengubah pengaturan apa pun** (tidak perlu environment variables, tidak perlu database).
3. Klik **Deploy** (build ± 1–2 menit). Selesai — media siap dibagikan ke peserta didik.

> **Catatan:** butuh Node.js ≥ 20 (sudah diset otomatis via `engines` di `package.json`). Aplikasi ini 100% frontend — seluruh progres siswa tersimpan di `localStorage` per perangkat, jadi tidak ada konfigurasi database. Tombol 🔄 di pojok kanan atas menghapus progres — gunakan antar siswa yang berbagi satu perangkat.

### Troubleshooting deploy

| Pesan error di Vercel | Penyebab | Solusi |
|---|---|---|
| `Couldn't find any pages or app directory` / `No Next.js version detected` | `package.json` tidak di root repo (file ke-upload di dalam subfolder) | Pindahkan seluruh isi folder ke root repo, push ulang |
| `Cannot find module ...` / `Module not found` | Ada file/folder `src` yang tidak ter-upload (upload web GitHub kadang melewatkan banyak file sekaligus) | Pastikan 4 folder `src/app`, `src/components`, `src/hooks`, `src/lib` lengkap; kalau via web gagal terus, pakai Cara 2 (git) |
| `Unsupported engine` / Node version error | Node < 20 | Vercel otomatis pakai Node 22; kalau deploy lewat CLI lokal, upgrade Node |
| Build gagal tapi lokal jalan | Cache Vercel | Deploy → tab **Deployments** → ⋯ → **Redeploy** dengan **Use existing Build Cache: OFF** |
| `Multiple lockfiles detected` (warning) | Ada `package-lock.json` buatan sendiri di repo | Tidak fatal — hapus `package-lock.json` kalau mau bersih, biarkan `bun.lock` saja |

---

## 🗂️ Struktur Kode

```
src/
├── app/
│   ├── page.tsx              # Router tampilan (single-page flow, termasuk fase materi)
│   ├── layout.tsx            # Metadata + tema
│   └── globals.css           # Tema dark navy / off-white / orange / electric blue
├── lib/
│   ├── gameData.ts           # KONTEN BAGIAN 1 (X.AP.1): kartu, notasi, lab, final
│   ├── gameDataP2.ts         # KONTEN BAGIAN 2 (X.AP.2) — barrel dari src/lib/p2/
│   ├── p2/                   # Sumber konten Bagian 2: tutorial.ts, cardsL1–L5.ts, lab.ts
│   ├── content.ts            # Accessor konten per bagian (CONTENTS, getContent)
│   ├── materiData.ts         # Konten Ruang Materi (kedua modul)
│   ├── store.ts              # Zustand store + persist + unlock per bagian
│   ├── scoring.ts            # Skor, KKTP, progress kemampuan, ekspor CSV (per bagian)
│   └── recap.ts              # Panel Guru: parser CSV siswa, rekap, CSV gabungan
└── components/game/
    ├── ui.tsx                # Header, footer, renderer pseudocode, konsol simulasi
    ├── Landing.tsx           # Landing (pilih bagian)
    ├── Briefing.tsx / Tutorial.tsx / CardsScreen.tsx / CardPlay.tsx
    ├── Lab.tsx / Final.tsx / Results.tsx / Reflection.tsx
    ├── Materi.tsx            # Ruang Materi (menu + pembaca materi)
    ├── GuruMap.tsx           # Peta Guru (peta semua menu + mode jelajah bebas)
    ├── GuruPanel.tsx         # Panel Guru
    └── ResultView.tsx        # Komponen tampilan hasil (dipakai siswa & guru — jaminan 1:1)
```

### Mengedit konten kartu
Konten Bagian 1 terpusat di `src/lib/gameData.ts` (`CARDS`); konten Bagian 2 di `src/lib/p2/cardsL1.ts` … `cardsL5.ts` (per level). Setiap kartu memuat: `scenario`, `mission`, `options` (pseudocode + log konsekuensi + feedback), `reasons`, `conceptTags`, dan `pembahasan`. Tambah/kurangi kartu cukup dengan mengedit array — skor, unlock, dan halaman hasil menyesuaikan otomatis. Konten Ruang Materi ada di `src/lib/materiData.ts`.

---

## 🛠️ Teknologi

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4** + komponen **shadcn/ui**
- **Framer Motion** (animasi halus, drag-and-drop via `Reorder`)
- **Zustand** + persist (progres tersimpan otomatis)
- **Lucide React** (ikon)

## 📊 Catatan untuk PTK

### Alur pengumpulan data (siswa → guru)

1. Tiap peserta didik menyelesaikan misi (Bagian 1 dan/atau Bagian 2), lalu di **Hasil Belajar** menekan `UNDUH DATA HASIL (CSV)` — satu CSV per bagian (file Bagian 2 diberi awalan `bagian2-`).
2. Guru mengumpulkan file CSV tersebut (disk/Drive/WA — bebas).
3. Guru membuka **PANEL GURU** (tombol di halaman awal, tanpa perlu bermain media) dan mengunggah semua file sekaligus — **CSV Bagian 1 dan Bagian 2 bisa dicampur**, tiap siswa otomatis terlabeli materinya.
4. Panel menampilkan rekap: statistik kelas, distribusi skor, **PROGRESS KEMAMPUAN KELAS (rata-rata 5 kemampuan — indikator Berpikir Algoritmik)**, tabel siswa (cari & urut, berlabel X.AP.1/X.AP.2), dan detail per siswa yang tampilannya **identik dengan halaman Hasil siswa**.
5. `UNDUH REKAP (CSV)` menghasilkan satu file gabungan siap dilampirkan ke laporan PTK.

> File dengan nama siswa yang sama otomatis menimpa data lama (sinkronisasi ulang aman). Data rekap tersimpan di `localStorage` perangkat guru dan **tidak terhapus** oleh reset progres siswa — gunakan tombol hapus di panel bila ingin mulai dari nol.

- Kolom data pada CSV: identitas, materi (X.AP.1/X.AP.2), skor, status KKTP, **PROGRESS KEMAMPUAN (5 kemampuan Bloom, termasuk indikator Berpikir Algoritmik)**, jawaban awal vs hasil revisi tiap kartu, kualitas argumen, percobaan final challenge, dan refleksi — siap dianalisis (Excel/SPSS) sebagai instrumen/dokumen observasi.
- Indikator kemampuan pada halaman hasil mengacu pada Tujuan Pembelajaran modul (LOTS C2–C3 dan HOTS C4–C5 serta psikomotor P3).
- Siswa dapat mengulang media setelah reset; pola jawaban pada siklus berikutnya dapat dibandingkan sebagai data siklus PTK.
- **Berpindah bagian:** dari Landing, pilih kartu BAGIAN 1 atau BAGIAN 2 — progres tiap bagian tersimpan terpisah untuk nama yang sama.
"# mediapembelajaran" 
