// ============================================================
// BAGIAN 2 — KARTU DILEMA LEVEL 3: DETEKTIF KENDALA
// Menganalisis penyebab kendala instalasi (C4)
// ============================================================

import { DilemmaCard } from "../gameData";

export const CARDS_P2_L3: DilemmaCard[] = [
  {
    id: "p2-3-1",
    level: 3,
    slot: 1,
    ability: "menganalisis",
    title: "Kotak Centang yang Terlewat",
    hook: "Python sudah terpasang — tapi terminal bilang tidak kenal.",
    scenario:
      "Dimas menjalankan installer Python di Windows. Pada layar pertama terdapat opsi 'Add python.exe to PATH' — ia mengklik Install Now begitu saja. Setelah selesai, ia ingin memeriksa instalasi lewat Command Prompt dengan perintah python --version, dan layar membalas: \"'python' is not recognized as an internal or external command.\"",
    mission: "Analisis akar masalahnya, lalu pilih rencana perbaikan yang paling tepat.",
    notation: ["Akar masalah", "PATH", "Perbaikan runtut"],
    options: [
      {
        id: "A",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Kesimpulan: instalasi gagal total",
          "Hapus Python dari Settings",
          "Unduh ulang installer",
          "Instal ulang dengan cara yang sama persis",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Menganalisis…" },
          { kind: "warn", text: "Kesimpulan meleset: Python BERHASIL terpasang — yang bermasalah adalah konfigurasi PATH." },
          { kind: "step", text: "Menghapus Python…" },
          { kind: "step", text: "Menginstal ulang dengan cara yang sama…" },
          { kind: "warn", text: "Layar pertama dilewati lagi — kotak PATH kembali tidak dicentang." },
          { kind: "step", text: "Menguji python --version…" },
          { kind: "err", text: "'python' is not recognized — masalah BERULANG persis." },
        ],
        outcome: {
          title: "Dikirim kembali ke titik nol",
          desc: "Seluruh proses diulang — unduh ulang, instal ulang, waktu dua kali lipat — tetapi karena layar pertama kembali dilewati, konfigurasi yang hilang tetap hilang. Analisis yang salah menghasilkan perbaikan yang sia-sia.",
        },
        feedback: {
          right: "Bersedia mengulang dari awal memang menunjukkan keseriusan.",
          wrong: "Analisis salah: pesan 'not recognized' tidak berarti instalasi gagal, melainkan PATH belum dikonfigurasi. Mengulang cara yang sama hanya mereproduksi masalah yang sama.",
          why: "Akar masalah ada pada satu kotak centang yang terlewat. Perbaikan yang tepat menyentuh akar itu — bukan menggembungkan cakupan kerja dengan mengulang semuanya.",
          correctIs: "Pilihan C",
        },
      },
      {
        id: "B",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Coba python --version dari berbagai folder",
          "Pindah ke C:\\, ke Desktop, ke Documents…",
          "Uji lagi di setiap folder",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Menguji dari C:\\Users\\Dimas…" },
          { kind: "err", text: "'python' is not recognized." },
          { kind: "step", text: "Menguji dari Desktop…" },
          { kind: "err", text: "'python' is not recognized." },
          { kind: "step", text: "Menguji dari Documents…" },
          { kind: "err", text: "'python' is not recognized." },
          { kind: "warn", text: "Folder tidak memengaruhi apa pun — yang dicari sistem adalah entri PATH, bukan lokasi kamu mengetik." },
        ],
        outcome: {
          title: "Salah curiga pada folder",
          desc: "PATH bukan tentang dari mana kamu mengetik, melainkan daftar lokasi tempat sistem mencari program. Pindah folder mengubah nol variabel yang relevan — tiga tes, tiga hasil identik, akar masalah tetap aman di tempatnya.",
        },
        feedback: {
          right: "Sistematis menguji beberapa kondisi memang metode yang layak.",
          wrong: "Variabel yang diubah (folder kerja) tidak ada hubungannya dengan penyebab (daftar lokasi yang dikenali sistem).",
          why: "Menganalisis berarti menemukan variabel yang BENAR untuk diubah. Pesan 'not recognized' menunjuk ke daftar lokasi sistem (PATH) — bukan ke direktori kerja.",
          correctIs: "Pilihan C",
        },
      },
      {
        id: "C",
        verdict: "optimal",
        pseudo: [
          "MULAI",
          "Baca pesan: 'not recognized' = lokasi python tak dikenali",
          "Cek: Python tercatat terpasang → instalasi SEHAT",
          "Jalankan ulang installer → pilih Modify",
          "Aktifkan 'Add python.exe to PATH'",
          "Buka terminal BARU",
          "Uji ulang: python --version",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Membaca pesan error sebagai petunjuk…" },
          { kind: "ok", text: "Diagnosis: perintah tidak dikenali → PATH belum berisi lokasi Python." },
          { kind: "step", text: "Memeriksa daftar aplikasi terpasang…" },
          { kind: "ok", text: "Python 3.12 ada — tidak perlu instal ulang." },
          { kind: "step", text: "Menjalankan installer, memilih Modify…" },
          { kind: "ok", text: "Opsi 'Add python.exe to PATH' diaktifkan." },
          { kind: "step", text: "Membuka terminal BARU (PATH terbaca ulang)…" },
          { kind: "ok", text: "Python 3.12.1 — perbaikan TERVERIFIKASI ✓" },
        ],
        outcome: {
          title: "Satu kotak centang, masalah tuntas",
          desc: "Analisis membaca dua bukti: pesan error (lokasi tak dikenali) dan daftar aplikasi (instalasi sehat). Kesimpulannya sempit dan pasti: konfigurasi PATH. Perbaikannya pun sempit dan pasti — Modify, centang, terminal baru, verifikasi. Selesai dalam beberapa menit.",
        },
        feedback: {
          right: "Diagnosis sempit → perbaikan minimal → verifikasi ulang di terminal baru.",
          wrong: "Tidak ada — jalur ini tepat.",
          why: "Perbaikan konfigurasi lewat Modify menyasar akar masalah tanpa mengorbankan apa pun. Terminal baru diperlukan karena terminal lama masih menyimpan salinan PATH lama — detail kecil yang sering membuat orang menyalahkan perbaikan yang sebenarnya berhasil.",
          correctIs: "—",
        },
      },
    ],
    reasonPrompt: "Kunci jawabanmu: alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "Akarnya adalah konfigurasi PATH yang terlewat — memperbaiki konfigurasi lewat Modify lebih tepat daripada mengulang seluruh instalasi.",
        sound: true,
        note: "Tepat — perbaikan yang menyentuh akar selalu lebih kecil dan lebih pasti daripada pengulangan.",
      },
      {
        id: "r2",
        text: "Masalah pasti hilang kalau instalasi diulang dengan cara yang sama persis.",
        sound: false,
        note: "Justru sebaliknya — penyebab yang sama yang diulang menghasilkan kegagalan yang sama.",
      },
      {
        id: "r3",
        text: "Lokasi folder memengaruhi perintah terminal, jadi pindah-pindah folder layak dicoba.",
        sound: false,
        note: "PATH adalah daftar lokasi program yang dikenali sistem — bukan folder tempat kamu mengetik.",
      },
    ],
    conceptTags: ["Akar masalah", "PATH", "Perbaikan runtut"],
    pembahasan:
      "Kartu ini adalah kartu Contoh Dilema 2 pada modul X.AP.2, dipertajam menjadi latihan analisis. Rantai buktinya: pesan 'not recognized' → sistem tidak menemukan perintah; daftar aplikasi → instalasi sehat. Persimpangan dua bukti menunjuk satu penyebab: PATH. A salah mendiagnosis lalu mengulang buta; B mengubah variabel yang tak relevan; C menemukan akar, memperbaiki dengan Modify, dan menutup dengan verifikasi di terminal baru. Pola diagnosis ini berlaku untuk hampir semua kendala instalasi.",
  },
  {
    id: "p2-3-2",
    level: 3,
    slot: 2,
    ability: "menganalisis",
    title: "Skrip yang Tak Pernah Jalan",
    hook: "\"Sudah kutulis kok!\" — tapi tidak ada bukti keluaran.",
    scenario:
      "Kelompok Budi menulis kode print(\"Halo, Dunia!\") di Notepad, menyimpannya sebagai halo.py, lalu melaporkan: \"Tugas selesai — program kami berhasil.\" Saat guru bertanya keluarannya apa, tidak ada yang bisa menjawab: file itu tidak pernah dijalankan sejak disimpan.",
    mission: "Analisis: di bagian mana klaim 'program berhasil' itu runtuh — dan langkah mana yang membuktikannya?",
    notation: ["Verifikasi", "Editor vs interpreter", "Bukti keluaran"],
    options: [
      {
        id: "A",
        verdict: "optimal",
        pseudo: [
          "MULAI",
          "Identifikasi klaim: 'program berhasil'",
          "Cari bukti: keluaran dari interpreter?",
          "→ TIDAK ADA: file tak pernah dijalankan",
          "Kesimpulan: klaim = asumsi, verifikasi BELUM terjadi",
          "Jalankan halo.py → baca shell",
          "Sajikan keluaran: Halo, Dunia!",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Menelusuri rantai: tulis → simpan → ??? → klaim…" },
          { kind: "warn", text: "Rantai putus di antara 'simpan' dan 'klaim': tidak ada langkah menjalankan." },
          { kind: "step", text: "Menjalankan halo.py dengan interpreter…" },
          { kind: "ok", text: "Shell menampilkan: Halo, Dunia!" },
          { kind: "step", text: "Membandingkan dengan harapan LKPD…" },
          { kind: "ok", text: "Sesuai — klaim kini DIDUKUNG BUKTI ✓" },
        ],
        outcome: {
          title: "Klaim diperbaiki dengan bukti",
          desc: "Analisis menemukan lubang tepat di tengah: antara menyimpan dan mengklaim, tidak pernah ada eksekusi. Menjalankan file selama tiga detik mengubah 'katanya berhasil' menjadi 'terbukti berhasil — ini keluarannya'.",
        },
        feedback: {
          right: "Lubang verifikasi ditemukan, lalu ditambal dengan eksekusi nyata.",
          wrong: "Tidak ada — jalur ini tepat.",
          why: "Editor (termasuk Notepad) hanya menulis dan menyimpan. Menjalankan adalah pekerjaan interpreter — peran yang sama sekali berbeda. Klaim keberhasilan program tanpa keluaran dari interpreter adalah asumsi yang belum diuji.",
          correctIs: "—",
        },
      },
      {
        id: "B",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Nilai: kode terlihat benar di layar",
          "Simpulkan: menulis di Notepad = menguji",
          "Pertahankan klaim 'berhasil'",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Memeriksa kode secara mata…" },
          { kind: "ok", text: "print(\"Halo, Dunia!\") memang tampak benar." },
          { kind: "step", text: "Mencari jejak eksekusi…" },
          { kind: "err", text: "Tidak ada: interpreter tidak pernah dipanggil." },
          { kind: "warn", text: "Melihat bukan menjalankan — kesalahan yang hanya muncul saat eksekusi lolos tak terdeteksi." },
        ],
        outcome: {
          title: "Mata bukan interpreter",
          desc: "Kode yang tampak benar bisa menyimpan kejutan: file tersimpan sebagai halo.py.txt, kutipan yang tak terlihat jelas, atau karakter salah. Interpreter adalah satu-satunya hakim yang sah — dan ia belum pernah dipanggil.",
        },
        feedback: {
          right: "Menilai kode secara visual memang langkah awal yang wajar.",
          wrong: "Menyamakan 'terlihat benar' dengan 'teruji' — padahal syarat program teruji adalah dijalankan dan keluarannya dicocokkan.",
          why: "Dua peran lingkungan pemrograman tidak boleh ditukar: editor menyimpan teks, interpreter menjalankannya. Klaim keberhasilan hanya boleh berdiri di atas keluaran, bukan kesan.",
          correctIs: "Pilihan A",
        },
      },
      {
        id: "C",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Ganti teks kode tiga kali di Notepad",
          "Simpan ulang setiap versi",
          "Tetap tidak menjalankan",
          "Laporkan ulang dengan lebih yakin",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Menulis versi 1, 2, 3…" },
          { kind: "ok", text: "Tiga file tersimpan." },
          { kind: "step", text: "Mencari keluaran…" },
          { kind: "err", text: "Masih nol: tidak satu pun versi pernah dieksekusi." },
          { kind: "warn", text: "Tiga versi tak teruji tidak lebih kuat daripada satu — semuanya sama-sama belum dibuktikan." },
        ],
        outcome: {
          title: "Lebih banyak, bukan lebih terbukti",
          desc: "Kepercayaan diri meningkat seiring jumlah versi — tetapi buktinya tetap nol. Mengulang langkah yang sama (menulis, menyimpan) menambah bahan, bukan bukti; satu-satunya langkah yang hilang tetap: menjalankan.",
        },
        feedback: {
          right: "Kerja keras menulis ulang memang menunjukkan usaha.",
          wrong: "Usaha diarahkan ke langkah yang sudah selesai (menulis), bukan ke langkah yang hilang (menjalankan).",
          why: "Analisis harus menemukan langkah yang HILANG, bukan menumpuk langkah yang sudah ada. Rantai verifikasi baru tertutup ketika interpreter dieksekusi dan keluarannya dibaca.",
          correctIs: "Pilihan A",
        },
      },
    ],
    reasonPrompt: "Kunci jawabanmu: alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "Syarat program teruji: dijalankan interpreter dan keluarannya sesuai harapan — tanpa itu, 'berhasil' hanya asumsi.",
        sound: true,
        note: "Tepat — inilah alur LKPD verifikasi instalasi pada modul.",
      },
      {
        id: "r2",
        text: "Kode yang terlihat benar pasti akan berjalan benar.",
        sound: false,
        note: "Interpreter justru ada untuk menemukan yang tak terlihat: ekstensi file salah, kutipan tersembunyi, ejaan meleset.",
      },
      {
        id: "r3",
        text: "Menulis ulang kode berkali-kali setara dengan menguji.",
        sound: false,
        note: "Tidak — menggandakan langkah yang sama tidak pernah menggantikan langkah yang hilang.",
      },
    ],
    conceptTags: ["Verifikasi", "Editor vs interpreter", "Bukti keluaran"],
    pembahasan:
      "Kartu ini mengambil pilihan C pada Contoh Dilema 3 modul (menulis di Notepad tanpa menjalankan) dan menjadikannya kasus analisis. Rantai verifikasi punya tiga mata rantai: tulis, jalankan, cocokkan. Kelompok Budi melewati mata rantai kedua — maka seluruh klaim runtuh tepat di situ. Jawaban terbaik tidak menambah penulisan, tidak menambah keyakinan; ia menambah satu hal yang hilang: eksekusi. Sikap psikomotor P3 pada modul menuntut 'program dijalankan dan menampilkan keluaran yang diharapkan' — bukan program yang ditulis rapi.",
  },
];
