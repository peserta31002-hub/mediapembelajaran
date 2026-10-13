// ============================================================
// BAGIAN 2 — KARTU DILEMA LEVEL 2: BACA SINYAL
// Membaca pesan error & layar installer (C3)
// ============================================================

import { DilemmaCard } from "../gameData";

export const CARDS_P2_L2: DilemmaCard[] = [
  {
    id: "p2-2-1",
    level: 2,
    slot: 1,
    ability: "membaca",
    title: "Pesan yang Tidak Dikenal",
    hook: "Terminal berbicara — tapi maksudnya apa?",
    scenario:
      "Setelah sesi instalasi, Dimas mengetik python --version di Command Prompt. Layar membalas: \"'python' is not recognized as an internal or external command, operable program or batch file.\" Dimas panik: apakah Python-nya gagal terpasang total, atau ada hal lain yang harus dibaca?",
    mission: "Baca pesan error itu dengan benar — langkah mana yang paling tepat dilakukan Dimas selanjutnya?",
    notation: ["Membaca pesan error", "PATH", "Troubleshooting"],
    options: [
      {
        id: "A",
        verdict: "optimal",
        pseudo: [
          "MULAI",
          "Baca pesan: 'python' is not recognized",
          "Simpulkan: perintah tidak dikenali sistem",
          "→ indikasi kuat PATH belum berisi lokasi Python",
          "Cek daftar aplikasi: Python 3.x terpasang?",
          "Jalankan ulang installer → Modify → aktifkan PATH",
          "Buka terminal baru, uji python --version",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Membaca ulang pesan error…" },
          { kind: "ok", text: "Kunci pesan: 'not recognized' — sistem TIDAK MENEMUKAN perintah, bukan 'Python rusak'." },
          { kind: "step", text: "Mengecek daftar aplikasi terpasang…" },
          { kind: "ok", text: "Python 3.12 tercatat terpasang — instalasi tidak gagal." },
          { kind: "step", text: "Menjalankan ulang installer, memilih Modify…" },
          { kind: "ok", text: "Opsi 'Add python.exe to PATH' diaktifkan." },
          { kind: "step", text: "Membuka terminal baru dan menguji…" },
          { kind: "ok", text: "Python 3.12.1 — masalah terverifikasi SELESAI ✓" },
        ],
        outcome: {
          title: "Diagnosis tepat, perbaikan minimal",
          desc: "Pesan dibaca sebagai data, bukan sebagai bencana. 'Not recognized' menunjuk satu hal: sistem tidak menemukan lokasi perintah python. Karena Python ternyata terpasang, perbaikannya pun kecil — konfigurasi PATH — dan hasilnya langsung terverifikasi.",
        },
        feedback: {
          right: "Membaca pesan → menemukan petunjuk → memperbaiki penyebab → menguji ulang.",
          wrong: "Tidak ada — jalur ini tepat.",
          why: "Pesan error punya struktur. Bagian 'is not recognized' adalah diagnosis dari sistem sendiri: perintah tidak ada di lokasi yang dikenali (PATH). Perbaikan yang baik selalu menyasar penyebab, bukan meledak seluruh instalasi.",
          correctIs: "—",
        },
      },
      {
        id: "B",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Baca pesan error → panik",
          "Simpulkan: Python gagal total",
          "Hapus Python dari laptop",
          "Unduh installer dari situs acak",
          "Instal ulang tanpa membaca layar",
          "Uji python --version",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Menafsirkan pesan sebagai kegagalan total…" },
          { kind: "warn", text: "Kesimpulan melompat: 'not recognized' ≠ gagal terpasang." },
          { kind: "step", text: "Menghapus Python yang sebenarnya sehat…" },
          { kind: "ok", text: "Python dihapus." },
          { kind: "step", text: "Mengunduh dari 'free-download-full.com'…" },
          { kind: "err", text: "Antivirus memblokir file — sumber tidak terverifikasi." },
          { kind: "step", text: "Menginstal ulang tanpa membaca opsi…" },
          { kind: "err", text: "PATH kembali tidak dikonfigurasi — pesan error yang sama muncul lagi." },
        ],
        outcome: {
          title: "Operasi besar, penyebab tak tersentuh",
          desc: "Instalasi yang sehat dihapus, file mencurigakan diunduh, dan instal ulang diulang tanpa membaca layar — lalu pesan yang sama muncul kembali, karena akar masalahnya (PATH) tidak pernah disentuh. Perbaikan buta sering menggandakan masalah.",
        },
        feedback: {
          right: "Bereaksi cepat atas masalah memang wajar.",
          wrong: "Penafsiran salah: 'not recognized' tidak berarti gagal terpasang. Akibatnya: uninstall tidak perlu, sumber tidak aman, dan penyebab asli tetap utuh.",
          why: "Mengulang tindakan yang sama tanpa mengubah penyebab menghasilkan kegagalan yang sama. Diagnosis dulu, baru operasi — bukan sebaliknya.",
          correctIs: "Pilihan A",
        },
      },
      {
        id: "C",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Abaikan isi pesan error",
          "Ketik python --version berulang kali",
          "Jika tetap sama: ganti keyboard",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Percobaan 1… " },
          { kind: "err", text: "'python' is not recognized." },
          { kind: "step", text: "Percobaan 2, 3, 4, 5…" },
          { kind: "err", text: "Pesan identik — tidak ada satu pun variabel yang berubah." },
          { kind: "step", text: "Mencabut dan memasang ulang keyboard…" },
          { kind: "warn", text: "Keyboard bekerja normal. Masalah sebenarnya (PATH) tidak pernah disentuh." },
        ],
        outcome: {
          title: "Mengulang tanpa mengubah apa pun",
          desc: "Lima percobaan identik memberi lima hasil identik. Pesan error yang dibaca sekali saja sudah cukup untuk menunjuk PATH — tetapi ia diabaikan, dan curiga salah arah ditujukan pada keyboard yang tidak bersalah.",
        },
        feedback: {
          right: "Tekun mencoba kembali memang sikap yang baik.",
          wrong: "Mengulangi perintah yang sama tanpa mengubah apa pun tidak pernah mengubah hasil — dan keyboard bukan bagian dari rantai perintah terminal.",
          why: "Troubleshooting bekerja dengan mengubah SATU variabel penyebab, lalu menguji ulang. Tanpa mengubah penyebab, pengulangan hanyalah kegigihan yang salah alamat.",
          correctIs: "Pilihan A",
        },
      },
    ],
    reasonPrompt: "Kunci jawabanmu: alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "'Not recognized' adalah petunjuk bahwa sistem tidak menemukan lokasi python — perbaikan yang tepat menyasar konfigurasi PATH, bukan instal ulang buta.",
        sound: true,
        note: "Tepat — membaca pesan = mendiagnosis; perbaikan mengikuti diagnosis.",
      },
      {
        id: "r2",
        text: "Pesan error adalah tanda bencana; cara terbaik adalah memasang ulang semuanya dari nol.",
        sound: false,
        note: "Terlalu jauh — pesan itu justru memberi informasi spesifik yang membuat operasi besar tidak perlu.",
      },
      {
        id: "r3",
        text: "Mengulangi perintah yang sama tanpa mengubah apa pun kadang-kadang berhasil.",
        sound: false,
        note: "Tidak — penyebab yang belum berubah selalu menghasilkan pesan yang sama.",
      },
    ],
    conceptTags: ["Membaca pesan error", "Konfigurasi PATH", "Troubleshooting"],
    pembahasan:
      "Pesan error adalah data diagnostik yang paling jujur. Frasa kuncinya — 'is not recognized' — berarti sistem mencari perintah python dan tidak menemukannya di lokasi yang dikenali (PATH), bukan bahwa instalasi gagal. Jalur terbaik memperlakukan pesan sebagai petunjuk: baca → simpulkan → cek asumsi (apakah Python memang terpasang?) → perbaiki penyebab → verifikasi ulang. B membaca panik lalu mengoperasi yang sehat; C tidak membaca sama sekali; A membaca dengan benar dan menyelesaikannya dengan perbaikan minimal.",
  },
  {
    id: "p2-2-2",
    level: 2,
    slot: 2,
    ability: "membaca",
    title: "Layar Installer",
    hook: "Tiga pilihan di layar pertama — masing-masing punya akibat.",
    scenario:
      "Installer Python terbuka dengan tampilan pertama: tombol 'Install Now', tombol 'Customize installation', dan kotak centang 'Add python.exe to PATH' yang belum dicentang. Rara punya dua tujuan: perintah python harus bisa dipanggil dari terminal, dan fitur bawaan (IDLE, pip) tetap lengkap.",
    mission: "Tindakan mana yang sesuai dengan KEDUA tujuan Rara — dan kenapa?",
    notation: ["Membaca layar instalasi", "Opsi installer", "PATH"],
    options: [
      {
        id: "A",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Buka installer",
          "Lewati semua teks di layar",
          "Klik Install Now langsung",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Membuka installer…" },
          { kind: "warn", text: "Kotak 'Add python.exe to PATH' TIDAK dicentang (tidak dibaca)." },
          { kind: "step", text: "Klik Install Now…" },
          { kind: "ok", text: "Instalasi berjalan dan selesai." },
          { kind: "step", text: "Uji di terminal: python --version…" },
          { kind: "err", text: "'python' is not recognized — tujuan 1 GAGAL." },
        ],
        outcome: {
          title: "Simpel, tapi mengorbankan tujuan",
          desc: "Instalasi selesai dan IDLE-pun ada — tetapi kotak PATH yang belum dicentang membuat terminal tidak mengenali perintah python. Tujuan pertama Rara runtuh hanya karena satu layar tidak dibaca.",
        },
        feedback: {
          right: "Instalasi berjalan cepat dan tanpa hambatan teknis.",
          wrong: "'Install Now' diklik tanpa membaca — kotak PATH yang menjadi syarat tujuan pertama dibiarkan kosong.",
          why: "Layar installer adalah antarmuka konfigurasi, bukan formalitas. Setiap kotak centang menentukan keadaan hasil instalasi; melewatinya berarti menyerahkan konfigurasi kepada kebetulan.",
          correctIs: "Pilihan B",
        },
      },
      {
        id: "B",
        verdict: "optimal",
        pseudo: [
          "MULAI",
          "Baca semua opsi di layar pertama",
          "Centang 'Add python.exe to PATH'",
          "Klik Install Now (fitur bawaan utuh)",
          "Buka terminal baru, uji python --version",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Membaca layar installer…" },
          { kind: "ok", text: "Ketemu: 'Add python.exe to PATH' — persis syarat tujuan 1." },
          { kind: "step", text: "Mencentang opsi PATH…" },
          { kind: "ok", text: "PATH akan dikonfigurasi otomatis." },
          { kind: "step", text: "Klik Install Now…" },
          { kind: "ok", text: "Instalasi selesai — IDLE dan pip terpasang (tujuan 2 ✓)." },
          { kind: "step", text: "Menguji di terminal baru…" },
          { kind: "ok", text: "Python 3.12.1 — kedua tujuan tercapai ✓" },
        ],
        outcome: {
          title: "Dua tujuan, satu layar",
          desc: "Membaca layar selama sepuluh detik menghemat satu jam diagnosis. PATH dicentang sehingga perintah python dikenali terminal, dan 'Install Now' dipertahankan agar IDLE serta pip tetap lengkap — kedua tujuan Rara tercapai sekaligus.",
        },
        feedback: {
          right: "Kotak PATH dicentang SEBELUM Install Now, dan fitur bawaan tidak disentuh.",
          wrong: "Tidak ada — jalur ini tepat.",
          why: "Urutan kecil bermakna besar: kotak centang harus diaktifkan sebelum tombol instal ditekan, karena setelahnya tidak ada lagi kesempatan (kecuali lewat Modify). Membaca layar = menentukan konfigurasi hasil.",
          correctIs: "—",
        },
      },
      {
        id: "C",
        verdict: "suboptimal",
        pseudo: [
          "MULAI",
          "Pilih Customize installation",
          "Hapus semua fitur tambahan (IDLE, pip, docs)",
          "Lanjutkan instalasi tanpa PATH",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Memilih Customize installation…" },
          { kind: "warn", text: "pip dinonaktifkan, IDLE dinonaktifkan." },
          { kind: "step", text: "Melanjutkan tanpa mengaktifkan PATH…" },
          { kind: "ok", text: "Instalasi selesai — hemat beberapa megabyte." },
          { kind: "step", text: "Uji terminal…" },
          { kind: "err", text: "'python' is not recognized — tujuan 1 GAGAL." },
          { kind: "step", text: "Coba pasang pustaka tambahan…" },
          { kind: "err", text: "pip tidak tersedia — tujuan 2 GAGAL." },
        ],
        outcome: {
          title: "Hemat kilobita, kehilangan alat",
          desc: "Ruang yang dihemat tidak seberapa, tetapi pip (pemasang pustaka) dan IDLE (editor bawaan) hilang. Dua tujuan Rara gagal sekaligus — padahal jalurnya terlihat 'lebih canggih' daripada sekadar Install Now.",
        },
        feedback: {
          right: "Customize bukan pilihan yang salah pada dasarnya.",
          wrong: "Menghapus fitur bawaan melanggar tujuan kedua, dan PATH tetap tak diaktifkan melanggar tujuan pertama.",
          why: "Keputusan konfigurasi harus ditimbang terhadap tujuan, bukan terhadap kesan 'hemat' atau 'canggih'. Untuk pemula, fitur bawaan adalah peralatan dasar — bukan beban.",
          correctIs: "Pilihan B",
        },
      },
    ],
    reasonPrompt: "Kunci jawabanmu: alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "Kotak 'Add python.exe to PATH' membuat perintah python dikenali terminal — karena itu ia harus dicentang sebelum Install Now, dan fitur bawaan dibiarkan utuh.",
        sound: true,
        note: "Tepat — dua tujuan Rara dipetakan tepat ke dua keputusan di layar.",
      },
      {
        id: "r2",
        text: "'Install Now' pasti pilihan terbaik karena tombolnya paling menonjol.",
        sound: false,
        note: "Ukuran tombol bukan alasan — tanpa PATH dicentang, Install Now justru menghasilkan instalasi yang tak bisa dipanggil dari terminal.",
      },
      {
        id: "r3",
        text: "Fitur tambahan tidak berguna untuk pemula, jadi aman dihapus semua saat Customize.",
        sound: false,
        note: "pip dan IDLE justru alat utama pemula — menghapusnya melanggar tujuan Rara sendiri.",
      },
    ],
    conceptTags: ["Opsi installer", "PATH", "Fitur bawaan Python"],
    pembahasan:
      "Layar installer adalah keputusan konfigurasi yang memakai bahasa visual: kotak centang dan tombol. Membacanya dengan memetakan setiap opsi ke tujuan (perintah python dikenali terminal → PATH; fitur lengkap → Install Now tanpa membuang komponen) adalah keterampilan 'membaca sinyal' yang inti dari TP C3. A membaca nol, C membaca salah arah, B membaca dengan kunci tujuan — dan hanya B yang lolos kedua pemeriksaan.",
  },
];
