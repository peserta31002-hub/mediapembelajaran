// ============================================================
// RUANG MATERI — konten bahasan dua modul
// X.AP.1 Notasi dan Penulisan Algoritma
// X.AP.2 Instalasi Lingkungan Pemrograman
// Disarikan dari kedua Modul Ajar (Fase E / Kelas X)
// ============================================================

export interface MateriSection {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  table?: { head: string[]; rows: string[][] };
  pseudo?: string[];
  note?: string;
  missionLink?: string;
}

export interface MateriModule {
  id: "xap1" | "xap2";
  code: string;
  title: string;
  tagline: string;
  intro: string;
  outline: string[];
  sections: MateriSection[];
  missionLink?: string;
}

export const MATERI_MODULES: MateriModule[] = [
  {
    id: "xap1",
    code: "X.AP.1",
    title: "Notasi dan Penulisan Algoritma",
    tagline: "Bahasa untuk menuliskan langkah penyelesaian masalah secara logis, runtut, dan tidak ambigu.",
    intro:
      "Sebelum komputer bisa membantu menyelesaikan masalah, langkah penyelesaiannya harus dituliskan lebih dulu dengan jelas. Di sinilah algoritma dan notasinya bekerja: menyusun urutan langkah yang logis dan sistematis, lalu menuliskannya dengan simbol yang maknanya pasti — MULAI, INPUT, OUTPUT, ←, IF/ELSE, dan REPEAT. Materi ini adalah fondasi seluruh misi Bagian 1.",
    outline: [
      "Pengertian algoritma",
      "Ciri algoritma yang baik",
      "Enam notasi dasar",
      "Contoh pseudocode lengkap",
      "Pola input–proses–output",
      "Kesalahan umum penulisan",
    ],
    sections: [
      {
        heading: "Apa itu Algoritma?",
        paragraphs: [
          "Algoritma adalah urutan langkah yang logis dan sistematis untuk menyelesaikan suatu masalah. Bukan hanya milik komputer: resep memasak, arah rute perjalanan, dan langkah login ke aplikasi kelas semuanya adalah algoritma. Yang membedakan algoritma untuk komputer adalah kepastiannya — setiap langkah harus tertulis dengan jelas sehingga tidak menyerahkan tafsir pada pelaksananya.",
          "Di dalam media ini kamu sudah merasakannya: ketika tombol 'Kumpulkan' ditekan sebelum file dilampirkan, urutan yang keliru menghasilkan konsekuensi nyata. Itulah inti materi X.AP.1 — algoritma yang benar bukan sekadar berisi langkah yang benar, melainkan langkah yang ditulis dalam URUTAN yang benar.",
        ],
        bullets: [
          "Algoritma = urutan langkah logis dan sistematis untuk menyelesaikan masalah.",
          "Setiap langkah berubah menjadi instruksi yang jelas, runtut, dan tidak ambigu.",
          "Contoh sehari-hari: resep teh manis, arah rute, langkah presensi online.",
        ],
      },
      {
        heading: "Ciri Algoritma yang Baik",
        paragraphs: [
          "Algoritma yang baik memiliki beberapa ciri yang dapat diperiksa. Ketika sebuah algoritma gagal dalam simulasi, hampir selalu salah satunya dilanggar — dan inilah lensa yang kamu pakai di setiap Kartu Dilema.",
        ],
        bullets: [
          "Logis — setiap langkah masuk akal untuk mencapai tujuan.",
          "Runtut — langkah yang menjadi syarat selalu mendahului langkah yang membutuhkannya.",
          "Jelas — instruksi tidak bermakna ganda; satu langkah, satu tindakan.",
          "Tuntas — punya titik awal (MULAI) dan titik akhir (SELESAI) yang jelas.",
          "Teruji — keberhasilan diverifikasi, bukan diasumsikan.",
        ],
      },
      {
        heading: "Enam Notasi Dasar",
        paragraphs: [
          "Notasi adalah simbol penulisan algoritma. Fokusnya pada makna, bukan sintaks bahasa pemrograman tertentu. Enam notasi berikut cukup untuk menuliskan seluruh algoritma pada materi ini — dan seluruh kartu dilema memakainya.",
        ],
        table: {
          head: ["Notasi", "Makna"],
          rows: [
            ["MULAI / SELESAI", "Penanda awal dan akhir algoritma"],
            ["INPUT", "Menerima masukan data dari pengguna"],
            ["OUTPUT / DISPLAY", "Menampilkan hasil ke layar"],
            ["←", "Menetapkan (mengisi) nilai ke variabel"],
            ["IF / ELSE", "Memeriksa kondisi, memilih jalur"],
            ["REPEAT ... UNTIL", "Mengulang langkah sampai kondisi terpenuhi"],
          ],
        },
        note: "Tanda ← mengisi nilai ke variabel: harga ← 3000 berarti variabel 'harga' kini bernilai 3000. IF/ELSE selalu berpasangan: kondisi benar dijalankan di cabang IF, sisanya di ELSE.",
      },
      {
        heading: "Contoh Pseudocode Lengkap",
        paragraphs: [
          "Pseudocode adalah penulisan algoritma yang menyerupai kode program tetapi bebas dari aturan bahasa tertentu. Contoh berikut menggabungkan semua notasi: presensi suara di kelas.",
        ],
        pseudo: [
          "MULAI",
          "INPUT suara",
          "IF suara = \"ya\" THEN",
          "  OUTPUT \"Presensi tercatat\"",
          "ELSE",
          "  DISPLAY \"Coba bicara lebih jelas\"",
          "SELESAI",
        ],
        note: "Baca dari atas ke bawah: data masuk lewat INPUT, kondisi diperiksa lewat IF, dan setiap cabang punya keluaran masing-masing. Pola yang sama dipakai pada Final Challenge Bagian 1 — mesin air mineral dengan dua kasus uji.",
      },
      {
        heading: "Pola Input–Proses–Output",
        paragraphs: [
          "Hampir semua program sederhana mengikuti satu pola besar: menerima data (input), mengolahnya (proses), lalu menampilkan hasil (output). Mesin air mineral menerima uang, memeriksa kecukupan, lalu menampilkan air dan kembalian. Mengenali pola ini membantu memecah masalah besar menjadi tiga bagian yang lebih mudah disusun.",
          "Ketika sebuah algoritma terasa sulit dirakit, tanyakan tiga hal: data apa yang masuk, proses apa yang mengubahnya, dan keluaran apa yang diharapkan. Jawaban ketiganya menjadi kerangka pseudocode-mu.",
        ],
      },
      {
        heading: "Kesalahan Umum Penulisan Algoritma",
        paragraphs: [
          "Sepuluh kartu dilema Bagian 1 mengumpulkan kesalahan-kesalahan yang paling sering muncul. Kenali polanya agar tidak terulang:",
        ],
        bullets: [
          "Langkah penutup diletakkan sebelum persiapan selesai (mengumpulkan sebelum melampirkan).",
          "Langkah prasyarat diselipkan di tengah (memilih tugas sebelum aplikasi dibuka).",
          "Cabang IF/ELSE tidak lengkap — satu jalur terlupakan.",
          "Verifikasi hasil dilewati, keberhasilan hanya diasumsikan.",
          "Notasi dipakai sembarangan — OUTPUT untuk menampung data padahal seharusnya ←.",
        ],
        missionLink:
          "Ruang materi ini adalah 'buku pegangan' misi Bagian 1: 10 kartu dilema, Algorithm Lab, dan Final Challenge semuanya melatih keenam notasi dan lima ciri algoritma di atas.",
      },
    ],
  },
  {
    id: "xap2",
    code: "X.AP.2",
    title: "Instalasi Lingkungan Pemrograman",
    tagline: "Menyiapkan perangkat agar algoritma tidak hanya tertulis, tetapi benar-benar dijalankan.",
    intro:
      "Algoritma yang ditulis dengan rapi di X.AP.1 belum bisa berjalan sendiri — ia butuh perangkat: bahasa pemrograman dan lingkungan untuk menulis serta menjalankannya. Materi ini menghubungkan keduanya: memasang lingkungan pemrograman Python dari sumber resmi, mengonfigurasinya dengan benar, memverifikasinya, dan menjalankan program pertama. Materi ini adalah fondasi seluruh misi Bagian 2.",
    outline: [
      "Dari algoritma ke program",
      "Komponen lingkungan pemrograman",
      "Alur instalasi lima langkah",
      "Verifikasi instalasi",
      "Memilih editor",
      "Kendala umum & troubleshooting",
      "Etika & keamanan perangkat lunak",
    ],
    sections: [
      {
        heading: "Dari Algoritma ke Program",
        paragraphs: [
          "Pada X.AP.1 algoritma ditulis dalam notasi bebas bahasa komputer. Agar dapat dijalankan, algoritma itu perlu dituliskan dalam bahasa pemrograman — dan di materi ini yang dipakai adalah Python 3, salah satu bahasa prosedural yang paling ramah pemula.",
          "Tetapi sebelum baris pertama program ditulis, ada pekerjaan yang mendahului: menyiapkan lingkungan pemrograman. Analoginya seperti memasak — resep (algoritma) sudah di tangan, tetapi dapur dan perkakasnya (lingkungan pemrograman) harus terpasang dulu. Perkakas yang belum siap atau salah pasang membuat resep terbaik pun tidak bisa dimasak.",
        ],
      },
      {
        heading: "Komponen Lingkungan Pemrograman",
        paragraphs: [
          "Lingkungan pemrograman adalah perangkat perangkat lunak untuk menulis, menjalankan, dan menguji program. Tiga komponen utamanya punya peran berbeda — dan membedakan ketiganya adalah tujuan pembelajaran pertama X.AP.2 (C2).",
        ],
        table: {
          head: ["Komponen", "Peran", "Contoh"],
          rows: [
            ["Editor", "Menulis dan menyimpan kode program", "IDLE, Thonny, VS Code, editor online"],
            ["Interpreter", "Membaca, menerjemahkan, dan menjalankan kode", "Python 3 (python.exe / python3)"],
            ["Terminal / Konsol", "Memberi perintah langsung ke sistem dan melihat keluaran", "Command Prompt (Windows), Terminal (macOS/Linux)"],
          ],
        },
        note: "Kesalahan klasik: menganggap 'sudah ditulis di editor' berarti 'sudah teruji'. Editor hanya menyimpan teks — hanya interpreter yang bisa membuktikan program bekerja. Itulah kenapa kartu 'Skrip yang Tak Pernah Jalan' ada.",
      },
      {
        heading: "Alur Instalasi Lima Langkah",
        paragraphs: [
          "Instalasi yang benar mengikuti urutan langkah yang sama dengan algoritma: setiap langkah menyiapkan kondisi untuk langkah berikutnya. Alur inilah yang dirakit ulang di Algorithm Lab dan Final Challenge Bagian 2.",
        ],
        table: {
          head: ["Langkah", "Apa yang dilakukan", "Kenapa penting"],
          rows: [
            ["1. Kenali perangkat", "Cek versi dan tipe sistem operasi (64/32-bit)", "Menentukan installer yang cocok"],
            ["2. Unduh dari sumber resmi", "Installer Python 3 dari python.org", "Keaslian dan kemutakhiran file terjamin"],
            ["3. Pasang dengan konfigurasi benar", "Centang 'Add python.exe to PATH' saat instalasi", "Perintah python dikenali terminal"],
            ["4. Verifikasi", "python --version di terminal", "Keberhasilan terkonfirmasi, bukan diasumsikan"],
            ["5. Program pertama", "Tulis & jalankan print(\"Halo, Dunia!\")", "Editor dan interpreter terbukti bekerja bersama"],
          ],
        },
        pseudo: [
          "MULAI",
          "Buka Command Prompt (Windows) / Terminal (macOS-Linux)",
          "Ketik python --version   (macOS/Linux: python3 --version)",
          "→ muncul nomor versi, mis. Python 3.12.x",
          "Tulis print(\"Halo, Dunia!\") di editor",
          "Simpan sebagai halo.py, lalu jalankan (Run)",
          "→ keluaran: Halo, Dunia!",
          "SELESAI",
        ],
      },
      {
        heading: "Verifikasi Instalasi (LKPD)",
        paragraphs: [
          "Verifikasi adalah bukti, bukan formalitas. Tabel berikut menyusun kembali lembar kerja (LKPD) modul — gunakan kolom 'Hasil Saya' hanya dengan keluaran nyata dari layar, bukan kesan bahwa 'seharusnya sudah benar'.",
        ],
        table: {
          head: ["Langkah / Perintah", "Hasil yang diharapkan"],
          rows: [
            ["Buka Command Prompt / Terminal", "Jendela terminal terbuka"],
            ["Ketik python --version (macOS/Linux: python3 --version)", "Muncul nomor versi, mis. Python 3.x.x"],
            ["Buka editor, tulis print(\"Halo, Dunia!\")", "Kode tertulis tanpa pesan kesalahan"],
            ["Simpan sebagai halo.py, lalu jalankan (Run)", "Keluaran: Halo, Dunia!"],
            ["Catat kendala yang muncul dan cara mengatasinya", "Kendala dan solusi tertulis"],
          ],
        },
      },
      {
        heading: "Memilih Editor",
        paragraphs: [
          "Tidak ada editor yang benar secara mutlak — pilihan dinilai dari kesesuaiannya dengan kebutuhan dan kondisi perangkat. Kartu 'Editor untuk Laptop Sekolah' melatih penilaian ini.",
        ],
        table: {
          head: ["Pilihan", "Kelebihan", "Batasan"],
          rows: [
            ["IDLE", "Bawaan Python, terpasang otomatis, ringan", "Fitur sederhana"],
            ["Thonny", "Ringan, ramah pemula, versi Python menyatu", "Fitur menengah"],
            ["VS Code", "Fitur lengkap, populer, ekstensi banyak", "Lebih berat untuk laptop berspesifikasi rendah"],
            ["Editor online", "Tanpa pemasangan, cocok untuk akun terbatas", "Butuh koneksi internet, fitur lebih terbatas"],
          ],
        },
        note: "Untuk laptop berspesifikasi rendah, IDLE atau Thonny biasanya lebih pas. Editor online adalah solusi sementara yang layak saat pemasangan tidak diizinkan — asalkan program tetap dijalankan dan diuji, dan pemasangan lokal ditindaklanjuti ke guru/admin.",
      },
      {
        heading: "Kendala Umum & Troubleshooting",
        paragraphs: [
          "Kendala instalasi bukan tanda kegagalan — ia bagian dari proses, dan pesan error-nya adalah petunjuk paling jujur. Kendala yang paling sering muncul:",
        ],
        bullets: [
          "'python' is not recognized — PATH belum dikonfigurasi (kotak centang terlewat). Perbaikan: jalankan ulang installer → Modify → aktifkan Add python.exe to PATH, lalu uji di terminal BARU.",
          "SyntaxError: unterminated string literal — tanda kutip tidak tertutup pada print(\"Halo, Dunia!. Perbaikan: tambahkan kutip penutup, simpan, jalankan ulang.",
          "pip tidak tersedia — fitur tambahan ikut dihapus saat Customize installation. Perbaikan: Modify dan aktifkan kembali pip.",
          "File installer mencurigakan — diunduh dari sumber tak jelas. Perbaikan: batalkan, unduh ulang dari python.org.",
        ],
        note: "Pola perbaikannya selalu sama: baca pesan → temukan penyebab persis → perbaiki minimal → uji ulang. Mengulang tindakan tanpa mengubah penyebab hanya menghasilkan kesalahan yang sama.",
      },
      {
        heading: "Etika & Keamanan Perangkat Lunak",
        paragraphs: [
          "Materi instalasi juga melatih sikap digital. Python bersifat gratis resmi — tidak ada versi 'berbayar' yang perlu di-crack, sehingga setiap tawaran 'full version + crack' pasti jebakan yang membawa risiko malware. Sumber yang sah satu-satunya untuk installer adalah situs resmi (python.org) atau salinan offline resmi yang disediakan sekolah.",
        ],
        bullets: [
          "Unduh hanya dari sumber resmi — situs pencarian teratas bukan jaminan keamanan.",
          "File dari aplikasi pesan bisa usang atau tidak cocok dengan sistem operasi; keasliannya tak terverifikasi.",
          "Perangkat lunak yang tersedia gratis tidak perlu dicari versi crack.",
          "Uji coba instalasi pada satu perangkat percontohan sebelum digulirkan ke seluruh kelas.",
        ],
        missionLink:
          "Ruang materi ini adalah 'buku pegangan' misi Bagian 2: 10 kartu dilema, Algorithm Lab (verifikasi & perbaikan PATH), dan Final Challenge (menyiapkan lab Python) semuanya melatih alur sumber → konfigurasi → verifikasi di atas.",
      },
    ],
  },
];
