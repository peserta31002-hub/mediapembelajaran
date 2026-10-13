// ============================================================
// BAGIAN 2 — KARTU DILEMA LEVEL 4: TIMBANG PILIHAN
// Mengevaluasi sumber unduhan & alat kerja (C4–C5)
// ============================================================

import { DilemmaCard } from "../gameData";

export const CARDS_P2_L4: DilemmaCard[] = [
  {
    id: "p2-4-1",
    level: 4,
    slot: 1,
    ability: "mengevaluasi",
    title: "Sumber Unduhan yang Menggoda",
    hook: "Tiga jalan mendapatkan Python — satu di antaranya jebakan.",
    scenario:
      "Rani ingin memasang Python di laptopnya. Hasil pencarian teratas menampilkan situs yang menawarkan \"Python versi lengkap + crack, unduh lebih cepat\". Di bawahnya ada situs resmi python.org. Sementara itu, seorang teman menawarkan mengirim installer lewat aplikasi pesan — \"biar nggak perlu unduh ulang\".",
    mission: "Evaluasi ketiga tawaran itu — pilihan mana yang paling aman dan tepat?",
    notation: ["Sumber resmi", "Keamanan perangkat", "Sikap digital"],
    options: [
      {
        id: "A",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Klik tautan teratas: 'Python full + crack'",
          "Alasan: teratas = paling dipercaya",
          "Jalankan installer hasil unduhan",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Mengunduh dari 'python-lengkap-gratis.com'…" },
          { kind: "warn", text: "Browser memperingatkan: sumber tidak terverifikasi." },
          { kind: "step", text: "Menjalankan installer…" },
          { kind: "err", text: "Antivirus mendeteksi PUA: perilaku mencurigakan pada file." },
          { kind: "warn", text: "Risiko terbuka: malware atau file yang telah dimodifikasi." },
          { kind: "info", text: "Fakta: Python SUDAH gratis — 'crack' selalu jebakan." },
        ],
        outcome: {
          title: "Umpan yang jelas-jelas jebakan",
          desc: "Python adalah perangkat lunak gratis resmi — tidak ada versi 'berbayar' yang perlu di-crack. Tautan teratas bukan jaminan keaslian; iklan bisa dibeli siapa saja. File yang dimodifikasi dapat membawa malware yang membaca data di laptop.",
        },
        feedback: {
          right: "Jalur unduh tercepat dan terlihat paling 'lengkap'.",
          wrong: "Sumber tak jelas + klaim 'crack' pada perangkat lunak gratis = dua tanda bahaya sekaligus.",
          why: "Keaslian file hanya terjamin dari sumber resmi. Situs pencarian menampilkan tautan berdasarkan peringkat dan iklan — bukan berdasarkan keamanan. Untuk perangkat lunak gratis, tawaran 'crack' selalu berarti file yang telah dimanipulasi.",
          correctIs: "Pilihan B",
        },
      },
      {
        id: "B",
        verdict: "optimal",
        pseudo: [
          "MULAI",
          "Cek versi & tipe OS laptop",
          "Unduh installer dari python.org",
          "Pastikan versi terbaru sesuai OS",
          "Jalankan installer",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Membuka python.org…" },
          { kind: "ok", text: "Situs resmi — versi terbaru tersedia." },
          { kind: "step", text: "Memilih installer sesuai sistem operasi…" },
          { kind: "ok", text: "File asli terunduh (keaslian terjamin)." },
          { kind: "step", text: "Menjalankan installer…" },
          { kind: "ok", text: "Instalasi berjalan normal — tanpa peringatan apa pun." },
        ],
        outcome: {
          title: "Sumber resmi, hati tenang",
          desc: "Installer asli dari pengembang resmi: versi terbaru, cocok dengan sistem operasi, dan tanpa bungkusan tersembunyi. Waktu unduh bergantung pada koneksi — satu-satunya 'biaya' yang dibayar, dan itu murah dibanding risiko.",
        },
        feedback: {
          right: "Resmi, terbaru, sesuai OS — semua kotak risiko tercentang aman.",
          wrong: "Tidak ada — jalur ini tepat.",
          why: "Evaluasi sumber memakai tiga kriteria: resmi atau bukan, versi terbaru atau usang, cocok dengan sistem operasi atau tidak. python.org lolos ketiganya; dua tawaran lain gagal di kriteria pertama.",
          correctIs: "—",
        },
      },
      {
        id: "C",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Terima installer dari teman via aplikasi pesan",
          "Langsung jalankan tanpa memeriksa",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Menerima file installer_python(1).exe…" },
          { kind: "warn", text: "Nama file berakhiran (1) — hasil terunduh ulang berulang." },
          { kind: "step", text: "Memeriksa versi…" },
          { kind: "err", text: "Python 3.6 (2016) — usang 8 tahun dari versi terkini." },
          { kind: "warn", text: "Keaslian file tidak dapat dipastikan." },
          { kind: "info", text: "Niat baik teman ≠ jaminan file aman dan mutakhir." },
        ],
        outcome: {
          title: "Temannya baik, filenya kuno",
          desc: "Tidak ada niat jahat di sini — tetapi versi installer dari teman bisa usang, tidak cocok dengan sistem operasi, dan keasliannya tak terverifikasi. Untuk kebutuhan sesederhana mengunduh dari situs resmi, risiko ini tidak layak diambil.",
        },
        feedback: {
          right: "Menghemat kuota dan waktu unduh dengan berbagi file.",
          wrong: "Versi bisa usang, kecocokan OS tak terjamin, dan keaslian file tak bisa dicek.",
          why: "Kepercayaan pada teman adalah soal sosial; keaslian file adalah soal teknis. Keduanya tidak saling menjamin — file terverifikasi hanya bisa datang dari sumber resmi.",
          correctIs: "Pilihan B",
        },
      },
    ],
    reasonPrompt: "Kunci jawabanmu: alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "Sumber resmi menjamin file asli dan versi terbaru yang sesuai sistem operasi — dan karena Python gratis, mencari 'versi crack' jelas tidak logis.",
        sound: true,
        note: "Tepat — tiga kriteria evaluasi terpenuhi sekaligus.",
      },
      {
        id: "r2",
        text: "Yang penting cepat dapat Python-nya; sumber unduhannya tak masalah.",
        sound: false,
        note: "Sumber menentukan segalanya: keaslian, versi, kecocokan OS, dan keamanan data di laptop.",
      },
      {
        id: "r3",
        text: "File dari teman pasti aman karena dia teman sendiri.",
        sound: false,
        note: "Niat baik tidak menjamin keaslian dan versi — file tetap harus berasal dari sumber yang dapat diverifikasi.",
      },
    ],
    conceptTags: ["Sumber resmi", "Keamanan perangkat", "Sikap digital"],
    pembahasan:
      "Kartu ini adalah Contoh Dilema 1 pada modul X.AP.2. Evaluasi kelayakan sumber memakai tiga kriteria: keaslian (resmi/tidak), kemutakhiran (versi), dan kecocokan (sistem operasi). A gagal kritis: klaim 'crack' pada perangkat lunak gratis adalah tanda bahaya klasik, dan 'teratas di pencarian' bukan indikator keamanan. C layak secara sosial tetapi rapuh secara teknis. B — unduh dari python.org setelah mengecek OS — satu-satunya yang lolos ketiga kriteria. Sikap afektif A3 modul terlatih di sini: menggunakan perangkat lunak dari sumber yang sah.",
  },
  {
    id: "p2-4-2",
    level: 4,
    slot: 2,
    ability: "mengevaluasi",
    title: "Editor untuk Laptop Sekolah",
    hook: "RAM terbatas, akun terkunci, waktu 20 menit — tetap bisa praktik?",
    scenario:
      "Lab sekolah hari ini: laptop berspesifikasi rendah, akun siswa tidak diizinkan memasang aplikasi baru, dan waktu praktik tinggal 20 menit. Tiga rencana dilirik: memaksa memasang editor besar, menulis di Notepad tanpa menjalankan, atau membuka editor online berbasis peramban.",
    mission:
      "Pilih strategi yang membuat praktik tetap terjadi HARI INI — dan tindak lanjutnya jelas ke pertemuan berikutnya.",
    notation: ["Evaluasi alternatif", "Kendala perangkat", "Rencana dua langkah"],
    options: [
      {
        id: "A",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Unduh editor besar (ratusan MB)",
          "Jalankan installer",
          "→ SISTEM MENOLAK: akun tanpa izin pemasangan",
          "Unduh ulang, coba lagi, lagi…",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Mengunduh editor besar…" },
          { kind: "warn", text: "RAM laptop menjerit — kipas mengaum." },
          { kind: "step", text: "Menjalankan installer…" },
          { kind: "err", text: "DITOLAK SISTEM: akun siswa tidak memiliki izin pemasangan." },
          { kind: "step", text: "Mencoba ulang… 2x… 3x…" },
          { kind: "err", text: "Hasil sama. Waktu praktik: habis. Program yang diuji: nol." },
        ],
        outcome: {
          title: "Gigih di jalur yang ditutup",
          desc: "Izin sistem bukan rintangan teknis yang bisa ditaklukkan dengan kegigihan. Tiga percobaan yang ditolak menghabiskan 20 menit penuh — dan praktik hari ini berakhir tanpa satu pun program yang dijalankan.",
        },
        feedback: {
          right: "Tekad memasang alat yang tepat untuk jangka panjang patut dihargai.",
          wrong: "Mengulang tindakan yang ditolak sistem di tengah waktu terbatas — kesempatan praktik terbakar percuma.",
          why: "Evaluasi harus mempertimbangkan kendala nyata: izin akun, kapasitas RAM, dan sisa waktu. Ketika jalur permanen tertutup hari ini, tujuan inti (menjalankan dan menguji program) harus dipertahankan lewat jalur lain.",
          correctIs: "Pilihan C",
        },
      },
      {
        id: "B",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Buka Notepad",
          "Tulis print(\"Halo, Dunia!\")",
          "Simpan sebagai halo.py",
          "Klaim: 'program sudah teruji'",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Menulis kode di Notepad…" },
          { kind: "ok", text: "Kode tertulis dan tersimpan." },
          { kind: "step", text: "Mencari bukti eksekusi…" },
          { kind: "err", text: "Tidak ada — program tidak pernah dijalankan." },
          { kind: "warn", text: "Klaim 'teruji' tanpa interpreter = klaim tanpa bukti." },
        ],
        outcome: {
          title: "Teruji? Belum pernah diuji",
          desc: "Notepad menyelesaikan separuh pekerjaan (menulis dan menyimpan) dengan canggung, lalu melewatkan separuh yang menentukan: menjalankan. Tanpa interpreter yang dieksekusi, klaim 'program teruji' tidak berdiri di atas apa pun.",
        },
        feedback: {
          right: "Tidak membutuhkan izin apa pun dan berjalan mulus di laptop lambat.",
          wrong: "Verifikasi tidak pernah terjadi — kode tak pernah dijalankan, tujuan praktik (menguji program) tak tercapai.",
          why: "Praktik pemrograman didefinisikan oleh eksekusi dan pengamatan keluaran, bukan oleh penulisan semata. Solusi yang 'jalan' tapi membuang tujuan inti bukanlah solusi.",
          correctIs: "Pilihan C",
        },
      },
      {
        id: "C",
        verdict: "optimal",
        pseudo: [
          "MULAI",
          "Buka editor online berbasis peramban",
          "Tulis & jalankan print(\"Halo, Dunia!\")",
          "→ keluaran muncul: PRAKTIK BERJALAN ✓",
          "Catat kendala di LKPD",
          "Ajukan izin pemasangan lokal ke guru/admin",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Membuka editor online…" },
          { kind: "ok", text: "Jalan di peramban — tanpa izin pemasangan." },
          { kind: "step", text: "Menulis dan menjalankan program…" },
          { kind: "ok", text: "Keluaran: Halo, Dunia! — tujuan inti tercapai." },
          { kind: "step", text: "Mencatat kendala & solusi di LKPD…" },
          { kind: "ok", text: "Kendala (izin, RAM) + rencana tindak lanjut tertulis." },
          { kind: "step", text: "Mengajukan izin pemasangan untuk pertemuan berikutnya…" },
          { kind: "ok", text: "Rencana dua langkah lengkap: hari ini + nanti ✓" },
        ],
        outcome: {
          title: "Praktik tetap hidup, permanen menyusul",
          desc: "Editor online menjalankan dua tugas sekaligus: menuntaskan praktik hari ini (program dijalankan dan diuji) dan menyiapkan jalan pulih ke solusi permanen (izin diajukan, kendala tercatat). Batasannya pun jujur: butuh koneksi dan fiturnya lebih terbatas.",
        },
        feedback: {
          right: "Tujuan inti dipertahankan, kendala didokumentasikan, tindak lanjut jelas.",
          wrong: "Tidak ada — jalur ini tepat.",
          why: "Solusi sementara layak dipilih bila dua syarat terpenuhi: tujuan inti tetap tercapai, dan solusi permanen ditindaklanjuti terpisah. Editor online memenuhi keduanya — Notepad gagal yang pertama, paksaan installer gagal total.",
          correctIs: "—",
        },
      },
    ],
    reasonPrompt: "Kunci jawabanmu: alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "Solusi sementara layak jika tujuan inti (menjalankan & menguji program) tetap tercapai, dan solusi permanen ditindaklanjuti terpisah.",
        sound: true,
        note: "Tepat — dua syarat kelayakan solusi sementara terpenuhi.",
      },
      {
        id: "r2",
        text: "Mengulang percobaan pemasangan yang ditolak sistem adalah usaha yang patut dihargai dan kadang berhasil.",
        sound: false,
        note: "Izin akun bukan soal kegigihan — tiga penolakan dalam 20 menit berarti praktik nol.",
      },
      {
        id: "r3",
        text: "Program yang tidak pernah dijalankan tetap boleh disebut teruji asal kodenya benar.",
        sound: false,
        note: "Teruji didefinisikan oleh eksekusi dan keluaran — bukan oleh penulisan yang rapi.",
      },
    ],
    conceptTags: ["Kendala perangkat", "Editor online", "Rencana dua langkah"],
    pembahasan:
      "Kartu ini adalah Contoh Dilema 3 modul, diperluas dengan pertimbangan diferensiasi (laptop rendah, izin akun, waktu terbatas). Evaluasi yang baik menimbang alternatif terhadap tujuan inti dan kendala nyata — bukan terhadap kesan 'paling serius' (editor besar) atau 'paling gampang' (Notepad). C memenuhi dua syarat kelayakan solusi sementara: program tetap dijalankan dan diuji, plus tindak lanjut permanen yang jelas. Catatan penting untuk kelas mahir: membandingkan Thonny vs VS Code juga evaluasi yang sah — keduanya benar bila sesuai kondisi; yang dinilai adalah kualitas alasan, bukan nama alatnya.",
  },
];
