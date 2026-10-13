// ============================================================
// BAGIAN 2 — KARTU DILEMA LEVEL 1: LANGKAH PASANG
// Mengidentifikasi urutan langkah instalasi & program pertama
// ============================================================

import { DilemmaCard } from "../gameData";

export const CARDS_P2_L1: DilemmaCard[] = [
  {
    id: "p2-1-1",
    level: 1,
    slot: 1,
    ability: "mengidentifikasi",
    title: "Unduhan Pertama",
    hook: "Laptop baru, Python belum ada — langkah mana duluan?",
    scenario:
      "Zahra mendapat tugas memasang Python 3 di laptop Windows keluarga yang masih polos. Ia menuliskan rencana langkah di buku catatan, tetapi sebagian urutannya masih kacau. Kakaknya mengingatkan: \"Jangan asal klik — periksa urutannya dulu.\"",
    mission:
      "Rencana langkah mana yang memasang Python dengan urutan yang benar — dari persiapan sampai hasilnya terverifikasi?",
    notation: ["Urutan langkah", "Prasyarat", "Verifikasi versi"],
    options: [
      {
        id: "A",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Ketik python --version di terminal",
          "Unduh installer dari python.org",
          "Jalankan installer Python",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Membuka terminal…" },
          { kind: "ok", text: "Terminal siap." },
          { kind: "step", text: "Mengetik python --version…" },
          { kind: "err", text: "'python' is not recognized as an internal or external command." },
          { kind: "info", text: "Algoritma berhenti — Python memang belum terpasang di laptop ini." },
        ],
        outcome: {
          title: "Memeriksa yang belum ada",
          desc: "Langkah pertama memeriksa versi Python padahal interpreter-nya belum terpasang. Pesan 'not recognized' muncul bukan karena laptop rusak, tetapi karena urutannya dibalik: pemeriksaan diletakkan sebelum pemasangan yang menjadi prasyaratnya.",
        },
        feedback: {
          right: "Langkah unduh dan pasang installer sudah masuk daftar.",
          wrong: "Pengecekan versi diletakkan PALING AWAL, padahal hanya bermakna setelah Python terpasang dan PATH-nya dikonfigurasi.",
          why: "Setiap langkah punya prasyarat. 'python --version' hanya bisa dijawab oleh interpreter yang sudah terpasang — jadi langkah ini wajib berada setelah instalasi, sebagai penutup yang memverifikasi.",
          correctIs: "Pilihan B",
        },
      },
      {
        id: "B",
        verdict: "optimal",
        pseudo: [
          "MULAI",
          "Cek versi & tipe OS laptop (64/32-bit)",
          "Unduh installer dari python.org sesuai OS",
          "Jalankan installer",
          "Centang 'Add python.exe to PATH'",
          "Klik Install Now",
          "Buka terminal, ketik python --version",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Mengecek sistem operasi…" },
          { kind: "ok", text: "Windows 11 64-bit — target installer jelas." },
          { kind: "step", text: "Mengunduh dari python.org…" },
          { kind: "ok", text: "Installer asli terunduh (sesuai 64-bit)." },
          { kind: "step", text: "Menjalankan installer…" },
          { kind: "ok", text: "Layar pertama terbuka." },
          { kind: "step", text: "Mencentang 'Add python.exe to PATH'…" },
          { kind: "ok", text: "PATH akan dikonfigurasi otomatis." },
          { kind: "step", text: "Klik Install Now…" },
          { kind: "ok", text: "Instalasi selesai — fitur bawaan lengkap." },
          { kind: "step", text: "Menguji di terminal: python --version…" },
          { kind: "ok", text: "Python 3.12.1 — instalasi TERVERIFIKASI ✓" },
        ],
        outcome: {
          title: "Terpasang dan terbukti",
          desc: "Urutan berjalan runtut: sistem dicek dulu, installer diunduh dari sumber resmi, PATH dikonfigurasi, dan pengecekan versi menjadi langkah penutup. Keberhasilannya terkonfirmasi — bukan diasumsikan.",
        },
        feedback: {
          right: "Semua prasyarat didahulukan: kenali OS → unduh yang cocok → pasang dengan PATH → baru verifikasi.",
          wrong: "Tidak ada — urutan ini aman.",
          why: "Algoritma instalasi yang baik bekerja seperti algoritma apa pun: langkah pembuka menyiapkan kondisi, langkah inti mengubahnya, dan langkah terakhir memverifikasi hasil agar keberhasilan terlihat nyata.",
          correctIs: "—",
        },
      },
      {
        id: "C",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Unduh 'Python full version' dari situs iklan teratas",
          "Klik Next sampai selesai",
          "Tutup installer — selesai!",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Mengunduh dari 'software-gratis-lengkap.com'…" },
          { kind: "warn", text: "Browser memperingatkan: file bukan dari sumber terverifikasi." },
          { kind: "step", text: "Mengabaikan peringatan, menjalankan installer…" },
          { kind: "warn", text: "Antivirus mendeteksi perilaku mencurigakan pada file." },
          { kind: "step", text: "Selesai — langsung menutup tanpa verifikasi…" },
          { kind: "err", text: "python --version TIDAK PERNAH diuji. Status: tidak terverifikasi." },
        ],
        outcome: {
          title: "Terpasang? Siapa yang tahu",
          desc: "File diunduh dari sumber tak jelas (Python itu gratis — 'versi crack' hanyalah umpan), opsi PATH dilewatkan begitu saja, dan tidak ada satu pun pemeriksaan di akhir. Kalau perintah python nanti gagal, tidak ada petunjuk dari mana masalahnya berasal.",
        },
        feedback: {
          right: "Langkah unduh dan instal memang ada.",
          wrong: "Tiga masalah sekaligus: sumber tidak resmi, PATH tidak dikonfigurasi, dan tidak ada verifikasi di akhir.",
          why: "Sumber resmi menjamin keaslian file; PATH menentukan apakah perintah python dikenali terminal; dan verifikasi menutup algoritma. Menghilangkan salah satu saja sudah membuat hasilnya diragukan — apalagi tiga-tiganya.",
          correctIs: "Pilihan B",
        },
      },
    ],
    reasonPrompt: "Kunci jawabanmu: alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "Pengecekan python --version harus jadi langkah TERAKHIR, setelah Python terpasang dan PATH-nya dikonfigurasi.",
        sound: true,
        note: "Tepat — langkah verifikasi bergantung pada seluruh prasyarat di depannya.",
      },
      {
        id: "r2",
        text: "Yang penting Python terpasang; urutan unduh dan verifikasi boleh dibalik.",
        sound: false,
        note: "Tidak bisa — perintah verifikasi tidak bermakna sebelum interpreter ada. Langkah yang punya prasyarat tidak boleh dipindah ke depan.",
      },
      {
        id: "r3",
        text: "Sumber unduhan tidak penting, karena installer Python di semua situs isinya sama.",
        sound: false,
        note: "Berbahaya — file dari sumber tak jelas bisa dimodifikasi. Situs resmi python.org adalah jaminan keaslian.",
      },
    ],
    conceptTags: ["Prasyarat langkah", "Sumber resmi", "Verifikasi versi"],
    pembahasan:
      "Kunci kartu ini sama dengan kunci algoritma pada umumnya: urutan mengikuti ketergantungan. Pengecekan versi hanya bisa dijalankan oleh interpreter yang sudah terpasang dan dikenali sistem (PATH) — karenanya ia selalu menjadi langkah penutup. Sumber unduhan menentukan keaslian file (Python gratis, jadi 'crack' jelas jebakan), dan melewatkan verifikasi membuat keberhasilan hanya sebatas asumsi. A gagal karena memeriksa yang belum ada; C gagal karena melanggar tiga prinsip sekaligus; B menjaga seluruh rantai prasyarat dengan benar.",
  },
  {
    id: "p2-1-2",
    level: 1,
    slot: 2,
    ability: "mengidentifikasi",
    title: "Halo, Dunia!",
    hook: "Program pertama: satu baris kode, empat langkah, satu bukti.",
    scenario:
      "LKPD meminta kelompok menulis print(\"Halo, Dunia!\") lalu menjalankannya. Empat kelompok mencatat langkah kerja yang berbeda-beda di lembar respons — dan semuanya yakin catatan mereka yang benar.",
    mission:
      "Urutan langkah mana yang benar-benar membuktikan program berjalan — sampai keluarannya terlihat?",
    notation: ["Urutan langkah", "Program pertama", "Verifikasi keluaran"],
    options: [
      {
        id: "A",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Jalankan program halo.py",
          "Tulis print(\"Halo, Dunia!\") di editor",
          "Simpan file",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Meminta interpreter menjalankan halo.py…" },
          { kind: "err", text: "GAGAL: file halo.py tidak ditemukan — kode belum pernah ditulis atau disimpan." },
          { kind: "info", text: "Algoritma berhenti di langkah pertama." },
        ],
        outcome: {
          title: "Menjalankan yang belum ditulis",
          desc: "Interpreter tidak bisa menjalankan file yang belum ada. Langkah 'jalankan program' adalah langkah paling akhir secara alamiah — ia membutuhkan kode yang sudah ditulis dan tersimpan sebagai prasyarat.",
        },
        feedback: {
          right: "Semua langkah yang dibutuhkan memang tercatat.",
          wrong: "Langkah 'Jalankan program' diletakkan paling depan, padahal seluruh langkah lain menjadi prasyaratnya.",
          why: "Menjalankan program adalah langkah yang mengonsumsi hasil semua langkah sebelumnya. Meletakkannya di awal sama seperti menekan tombol 'Kumpulkan' sebelum menulis laporan — tidak ada yang bisa dijalankan.",
          correctIs: "Pilihan C",
        },
      },
      {
        id: "B",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Tulis print(\"Halo, Dunia!\") di editor",
          "Simpan sebagai halo.py",
          "Laporkan: program berhasil dibuat",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Menulis kode di editor…" },
          { kind: "ok", text: "Kode tertulis tanpa pesan kesalahan." },
          { kind: "step", text: "Menyimpan halo.py…" },
          { kind: "ok", text: "File tersimpan." },
          { kind: "step", text: "Mencari keluaran di shell…" },
          { kind: "warn", text: "Shell kosong — program tidak pernah dijalankan." },
          { kind: "err", text: "Laporan 'berhasil' tidak didukung bukti keluaran apa pun." },
        ],
        outcome: {
          title: "File tersimpan, bukti tidak ada",
          desc: "Kode tertulis rapi dan file tersimpan — tetapi interpreter tidak pernah dipanggil. 'Program berhasil' pada laporan itu hanyalah kesan, bukan hasil pengamatan. LKPD verifikasi menuntut kolom 'Hasil Saya' diisi keluaran nyata, bukan asumsi.",
        },
        feedback: {
          right: "Menulis dan menyimpan dilakukan dengan benar dan berurutan.",
          wrong: "Langkah 'Jalankan program' hilang — laporan langsung melompat ke kesimpulan.",
          why: "Menyimpan file hanyalah menyiapkan bahan. Bukti bahwa program bekerja datang dari satu tempat saja: interpreter yang dijalankan dan keluarannya dibaca. Tanpa itu, verifikasi belum terjadi.",
          correctIs: "Pilihan C",
        },
      },
      {
        id: "C",
        verdict: "optimal",
        pseudo: [
          "MULAI",
          "Tulis print(\"Halo, Dunia!\") di editor",
          "Simpan sebagai halo.py",
          "Jalankan program (Run)",
          "Baca keluaran shell: Halo, Dunia!",
          "Cocokkan dengan harapan LKPD",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Menulis kode di editor…" },
          { kind: "ok", text: "print(\"Halo, Dunia!\") lengkap dengan kutip pembuka-penutup." },
          { kind: "step", text: "Menyimpan halo.py…" },
          { kind: "ok", text: "File tersimpan di folder latihan." },
          { kind: "step", text: "Menjalankan program…" },
          { kind: "ok", text: "Interpreter membaca kode baris demi baris." },
          { kind: "step", text: "Membaca shell…" },
          { kind: "ok", text: "Keluaran: Halo, Dunia! — SESUAI HARAPAN ✓" },
        ],
        outcome: {
          title: "Terbukti di layar",
          desc: "Tulis → simpan → jalankan → cocokkan. Rantai ini memenuhi syarat program teruji: dijalankan oleh interpreter dan keluarannya sesuai harapan. Inilah alur LKPD verifikasi instalasi dari awal sampai akhir.",
        },
        feedback: {
          right: "Empat langkah runtut dan diakhiri pencocokan keluaran — verifikasi tuntas.",
          wrong: "Tidak ada — urutan ini aman.",
          why: "Lingkungan pemrograman punya dua peran berbeda: editor untuk menulis dan menyimpan, interpreter untuk menjalankan. Keduanya harus terlibat, dan bukti keberhasilan hanya datang dari keluaran yang benar-benar dibaca.",
          correctIs: "—",
        },
      },
    ],
    reasonPrompt: "Kunci jawabanmu: alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "Program terbukti bekerja hanya setelah dijalankan interpreter dan keluarannya dicocokkan dengan harapan.",
        sound: true,
        note: "Tepat — itulah definisi 'teruji' pada LKPD verifikasi.",
      },
      {
        id: "r2",
        text: "Menyimpan file sudah cukup sebagai bukti program benar.",
        sound: false,
        note: "Tidak — file tersimpan belum pernah dieksekusi; kesalahan kecil pun tak akan terdeteksi.",
      },
      {
        id: "r3",
        text: "Menjalankan program boleh dilewati kalau kodenya terlihat sudah benar.",
        sound: false,
        note: "Interpreter justru ada untuk menemukan yang tak terlihat mata: kutipan hilang, ejaan salah, file salah simpan.",
      },
    ],
    conceptTags: ["Editor vs interpreter", "Verifikasi keluaran", "LKPD verifikasi"],
    pembahasan:
      "Kartu ini melatih pemisahan dua peran lingkungan pemrograman: editor (menulis, menyimpan) dan interpreter (menjalankan). Klaim 'program berhasil' hanya sah bila ada keluaran nyata dari interpreter yang dicocokkan dengan harapan. A menaruh langkah paling bergantung di depan; B berhenti sebelum bukti diambil; C menuntaskan seluruh rantai tulis–simpan–jalankan–cocokkan. Pola yang sama akan dipakai di seluruh Bagian 2: setiap klaim keberhasilan instalasi harus ditutup dengan verifikasi.",
  },
];
