// ============================================================
// BAGIAN 2 — KARTU DILEMA LEVEL 5: TUKANG PERBAIKI
// Memperbaiki panduan & program yang keliru (C5, P3)
// ============================================================

import { DilemmaCard } from "../gameData";

export const CARDS_P2_L5: DilemmaCard[] = [
  {
    id: "p2-5-1",
    level: 5,
    slot: 1,
    ability: "menyusun",
    title: "Panduan Teman yang Keliru",
    hook: "Panduan tiga langkah yang terasa mudah — dan penuh jebakan.",
    scenario:
      "Seorang teman membagikan panduan instalasi Python versinya: \"1) Unduh Python dari situs mana saja. 2) Klik Next sampai selesai. 3) Langsung tutup — selesai!\" Panduan itu terasa mudah diikuti, tetapi kamu tahu ada beberapa hal berbahaya di dalamnya.",
    mission:
      "Susun versi perbaikan panduan itu — urutan langkah yang aman, terkonfigurasi, dan terverifikasi.",
    notation: ["Menyusun panduan", "Sumber–konfigurasi–verifikasi", "Argumentasi"],
    options: [
      {
        id: "A",
        verdict: "optimal",
        pseudo: [
          "MULAI",
          "1 Unduh installer dari python.org (sesuai versi OS)",
          "2 Jalankan installer → centang 'Add python.exe to PATH'",
          "3 Klik Install Now — fitur bawaan dibiarkan utuh",
          "4 Buka terminal baru → python --version",
          "5 Tulis print(\"Halo, Dunia!\") → simpan → jalankan",
          "6 Cek keluaran: Halo, Dunia!",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Membedah panduan teman: 3 kelemahan ditemukan…" },
          { kind: "warn", text: "① sumber bebas ② tanpa konfigurasi ③ tanpa verifikasi." },
          { kind: "step", text: "Menyusun ulang langkah per langkah…" },
          { kind: "ok", text: "Sumber: python.org — keaslian terjamin." },
          { kind: "ok", text: "Konfigurasi: PATH dicentang sebelum instalasi." },
          { kind: "ok", text: "Verifikasi: versi + program pertama sebagai penutup." },
          { kind: "step", text: "Menguji panduan baru dari nol…" },
          { kind: "ok", text: "Python 3.12.1 muncul, lalu Halo, Dunia! — panduan TERBUKTI ✓" },
        ],
        outcome: {
          title: "Panduan yang bisa dipinjam orang lain",
          desc: "Versi perbaikan menyentuh ketiga kelemahan sekaligus — sumber, konfigurasi, verifikasi — dan mengujinya sampai langkah terakhir. Panduan yang baik kini bisa diikuti siapa pun tanpa bantuan, dan keberhasilannya tidak bergantung keberuntungan.",
        },
        feedback: {
          right: "Tiga kelemahan diperbaiki, urutan runtut, dan hasilnya diuji sendiri.",
          wrong: "Tidak ada — jalur ini tepat.",
          why: "Menyusun perbaikan berarti bekerja dari diagnosis: kelemahan dipetakan (sumber, konfigurasi, verifikasi), lalu langkah pengganti dirakit berurutan, dan bukti ditutup dengan pengujian ulang. Panduan yang benar terbukti oleh keluaran, bukan oleh keyakinan penulisnya.",
          correctIs: "—",
        },
      },
      {
        id: "B",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Perbaiki langkah 1 saja: unduh dari python.org",
          "Klik Next sampai selesai (seperti semula)",
          "Langsung tutup",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Memperbaiki sumber unduhan…" },
          { kind: "ok", text: "Installer asli — satu kelemahan tertambal." },
          { kind: "step", text: "Next-next sampai selesai…" },
          { kind: "warn", text: "Kotak 'Add python.exe to PATH' terlewat lagi." },
          { kind: "step", text: "Menutup tanpa verifikasi…" },
          { kind: "err", text: "python --version tidak pernah diuji — dua kelemahan tetap utuh." },
        ],
        outcome: {
          title: "Sepertiga perbaikan",
          desc: "Sumber sudah resmi — kemajuan nyata. Tetapi panduan itu masih melewatkan konfigurasi PATH dan masih berhenti tanpa verifikasi. Siapa pun yang mengikutinya akan kembali bertanya: kenapa 'python' tidak dikenali?",
        },
        feedback: {
          right: "Kelemahan pertama (sumber) sudah benar diperbaiki.",
          wrong: "Dua kelemahan lain tak tersentuh: tanpa PATH perintah tidak dikenali, tanpa verifikasi keberhasilan hanya asumsi.",
          why: "Memperbaiki panduan bukan memilih kelemahan yang paling gampang. Ketiganya membentuk rantai: sumber menjaga keaslian, konfigurasi menjaga kegunaan, verifikasi menjaga kepastian — patah satu, rantai bermasalah.",
          correctIs: "Pilihan A",
        },
      },
      {
        id: "C",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Tambah langkah: instal ulang tiga kali",
          "Berulang dari awal setiap selesai",
          "Asumsi: sering diulang = pasti berhasil",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Instalasi ke-1…" },
          { kind: "warn", text: "Sumber bebas & PATH terlewat — sama seperti semula." },
          { kind: "step", text: "Instalasi ke-2…" },
          { kind: "warn", text: "Kondisi awal selalu identik." },
          { kind: "step", text: "Instalasi ke-3…" },
          { kind: "err", text: "Tiga kali mengulang, nol kelemahan diperbaiki." },
        ],
        outcome: {
          title: "Menggandakan masalah, bukan memperbaikinya",
          desc: "Pengulangan menambah durasi, bukan kualitas. Ketika kelemahan ada di isi langkah (sumber, konfigurasi, verifikasi), mengulang seluruh proses tiga kali hanya memproduksi tiga instalasi yang sama bermasalahnya.",
        },
        feedback: {
          right: "Menambah langkah memang membuat panduan terlihat lebih serius.",
          wrong: "Jumlah langkah naik, kualitas tetap nol — kelemahan di isi tidak pernah disentuh.",
          why: "Perbaikan diukur dari perubahan isi, bukan dari panjang daftar. Langkah pengganti harus mengganti elemen yang bermasalah; langkah tambahan yang tidak menyentuh akar hanya noise.",
          correctIs: "Pilihan A",
        },
      },
    ],
    reasonPrompt: "Kunci jawabanmu: alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "Perbaikan panduan harus menyentuh tiga kelemahannya sekaligus: sumber (python.org), konfigurasi (PATH), dan verifikasi (versi + program pertama).",
        sound: true,
        note: "Tepat — diagnosis penuh, solusi lengkap, diuji sampai tuntas.",
      },
      {
        id: "r2",
        text: "Sumber resmi sudah menyelesaikan 90% masalah instalasi.",
        sound: false,
        note: "Dua kelemahan lain tetap menghasilkan instalasi yang tak bisa dipanggil dan tak terbukti.",
      },
      {
        id: "r3",
        text: "Menginstal ulang berulang membuat instalasi lebih pasti berhasil.",
        sound: false,
        note: "Pengulangan tanpa perubahan isi hanya menggandakan hasil yang sama.",
      },
    ],
    conceptTags: ["Menyusun panduan", "Sumber–konfigurasi–verifikasi", "Argumentasi"],
    pembahasan:
      "Kartu ini mengangkat soal C5 pada asesmen modul (mengevaluasi panduan teman yang keliru dan menyusun versi perbaikannya). Kerangka perbaikannya berlaku universal: sumber sah → konfigurasi benar → verifikasi sebagai penutup. B menunjukkan jebakan 'perbaikan parsial' — satu kelemahan dibereskan bukan alasan merayakan; C menunjukkan jebakan 'perbaikan kuantitas' — panjang panduan bukan kualitas panduan. A merakit ulang isi langkahnya, menguji panduan barunya sendiri, dan menghasilkan panduan yang bisa dipakai orang lain tanpa bantuan.",
  },
  {
    id: "p2-5-2",
    level: 5,
    slot: 2,
    ability: "menyusun",
    title: "Kutipan yang Bocor",
    hook: "Exit ticket: satu baris kode yang menolak jalan.",
    scenario:
      "Sebagai exit ticket, guru membagikan program yang sengaja dibuat keliru: print(\"Halo, Dunia! — tanda kutip penutupnya hilang. Terminal memuntahkan pesan: SyntaxError: unterminated string literal. Tugasnya dua lapis: perbaiki programnya, DAN buktikan perbaikan itu.",
    mission: "Rencana perbaikan mana yang menyelesaikan masalah DAN membuktikan perbaikannya?",
    notation: ["SyntaxError", "Perbaikan berbasis pesan", "Verifikasi ulang"],
    options: [
      {
        id: "A",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Baca: 'unterminated string literal'…",
          "Solusi: hapus SEMUA tanda kutip",
          "print(Halo, Dunia!)",
          "Simpan — klaim selesai",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Menghapus kutip pembuka dan penutup…" },
          { kind: "step", text: "Menjalankan ulang…" },
          { kind: "err", text: "SyntaxError baru: 'Halo' tidak dikenal — tanpa kutip, interpreter menganggapnya nama variabel." },
          { kind: "warn", text: "Satu error ditukar dengan error lain — masalah belum selesai." },
        ],
        outcome: {
          title: "Menyembuhkan demam dengan mencabut termometer",
          desc: "Tanda kutip bukan penyakit — ia penanda teks. Tanpa kutip, interpreter membaca Halo dan Dunia sebagai nama variabel yang tidak pernah dibuat. Error lama hanya berganti wajah, dan klaim 'selesai' dibuat tanpa menguji hasilnya.",
        },
        feedback: {
          right: "Menghapus elemen yang terlibat dalam pesan error memang terdengar logis.",
          wrong: "Tanda kutip adalah bagian sintaks yang SAH — yang rusak adalah ketidaktutupannya. Menghapus keduanya menciptakan error baru.",
          why: "Pesan 'unterminated string literal' menunjuk pada string yang TAK TERTUTUP — perbaikan minimalnya menambahkan kutip penutup, bukan mencabut semuanya. Dan setiap perbaikan wajib ditutup dengan pengujian ulang.",
          correctIs: "Pilihan B",
        },
      },
      {
        id: "B",
        verdict: "optimal",
        pseudo: [
          "MULAI",
          "Baca pesan: SyntaxError: unterminated string literal",
          "Temukan penyebab: kutip penutup hilang",
          "Perbaiki minimal: print(\"Halo, Dunia!\")",
          "Simpan ulang halo.py",
          "Jalankan → baca shell",
          "Keluaran: Halo, Dunia! — sesuai harapan",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Membaca pesan error sebagai petunjuk…" },
          { kind: "ok", text: "'unterminated string literal' → string tak tertutup → kutip penutup hilang." },
          { kind: "step", text: "Menambahkan tanda kutip penutup…" },
          { kind: "ok", text: "print(\"Halo, Dunia!\") — sintaks utuh." },
          { kind: "step", text: "Menyimpan dan menjalankan ulang…" },
          { kind: "ok", text: "Shell menampilkan: Halo, Dunia!" },
          { kind: "step", text: "Mencocokkan dengan harapan…" },
          { kind: "ok", text: "SESUAI — perbaikan TERVERIFIKASI ✓" },
        ],
        outcome: {
          title: "Perbaikan terkecil yang benar, bukti penuh",
          desc: "Satu tanda kutip ditambahkan — persis yang ditunjuk pesan error — lalu file disimpan, dijalankan, dan keluarannya dicocokkan. Siklus penuh baca–temukan–perbaiki–uji selesai dalam hitungan detik, dengan bukti yang bisa ditunjukkan ke guru.",
        },
        feedback: {
          right: "Perbaikan menyasar penyebab persis, dan ditutup dengan verifikasi keluaran.",
          wrong: "Tidak ada — jalur ini tepat.",
          why: "Exit ticket melatih siklus kerja programmer sesungguhnya: pesan error adalah petunjuk arah, perbaikan terkecil yang benar adalah target, dan pengujian ulang adalah bukti. Tanpa langkah terakhir, 'sudah diperbaiki' tetap berstatus asumsi.",
          correctIs: "—",
        },
      },
      {
        id: "C",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Cari kode mirip di internet",
          "Salin-tempel baris pertama yang ketemu",
          "Jalankan sekali — jalan!",
          "Laporkan tanpa memahami penyebab",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Mencari 'cara memperbaiki print python'…" },
          { kind: "ok", text: "Baris kode ditemukan dan ditempel — program berjalan." },
          { kind: "step", text: "Menanyakan pemahaman: kenapa semula error?" },
          { kind: "err", text: "Tidak ada yang bisa menjelaskan — kutipan tak tertutup tak pernah dipahami." },
          { kind: "warn", text: "Program jalan, pemahaman nol — pada kasus berikutnya, error yang sama akan jebakan lagi." },
        ],
        outcome: {
          title: "Jalan hari ini, tersandung lagi besok",
          desc: "Program memang berjalan — tetapi tanpa pemahaman penyebab, keterampilan diagnosis tidak pernah terbentuk. Pada error berikutnya yang serupa, salin-tempel lagi akan jadi satu-satunya senjata — dan tidak semua kasus selesai dengan satu baris tempelan.",
        },
        feedback: {
          right: "Program berhasil dijalankan — hasil akhirnya memang tampil.",
          wrong: "Pemahaman penyebab dikesampingkan; keterampilan yang seharusnya dilatih exit ticket tidak terbentuk.",
          why: "Tujuan exit ticket bukan sekadar membuat program jalan, melainkan melatih siklus diagnosis. Menempel jawaban yang 'jalan' melampaui ujian hari ini tetapi kalah pada besok.",
          correctIs: "Pilihan B",
        },
      },
    ],
    reasonPrompt: "Kunci jawabanmu: alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "Pesan 'unterminated string literal' menunjuk persis ke kutipan tak tertutup — perbaikan minimal plus verifikasi keluaran adalah jalur terpendek yang benar.",
        sound: true,
        note: "Tepat — baca pesan → perbaiki penyebab → bukti dengan eksekusi.",
      },
      {
        id: "r2",
        text: "Cukup hilangkan semua tanda kutip supaya tidak ada yang bisa 'tak tertutup'.",
        sound: false,
        note: "Kutip menandai teks; tanpa kutip, Halo dan Dunia dibaca sebagai variabel — error baru muncul.",
      },
      {
        id: "r3",
        text: "Asal program jalan, tidak penting memahami penyebab errornya.",
        sound: false,
        note: "Exit ticket melatih keterampilan diagnosis — program yang jalan tanpa pemahaman tidak menumbuhkan keterampilan itu.",
      },
    ],
    conceptTags: ["SyntaxError", "Perbaikan berbasis pesan", "Verifikasi ulang"],
    pembahasan:
      "Kartu penutup Bagian 2 mengambil aktivitas exit ticket pada penutup modul (memperbaiki print(\"Halo, Dunia!\" yang dibuat keliru). Siklus yang dilatih: baca pesan error → temukan penyebab persis → perbaiki minimal → jalankan → cocokkan keluaran. A menukar error dengan error; C menukar pemahaman dengan tempelan; B menempuh jalur terkecil yang benar dan menutupnya dengan bukti. Pola inilah yang menghubungkan seluruh Bagian 2: lingkungan pemrograman dipasang dari sumber sah, dikonfigurasi dengan benar, dan diverifikasi sebelum dipakai — sama seperti program diperbaiki: didiagnosis, dibetulkan, dibuktikan.",
  },
];
