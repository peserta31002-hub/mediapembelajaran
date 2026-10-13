// ============================================================
// BAGIAN 2 — ALGORITHM LAB (2 task) + FINAL CHALLENGE
// Instalasi & verifikasi lingkungan pemrograman Python
// ============================================================

import { BlockDef, LabTask } from "../gameData";

export const LAB_TASKS_P2: LabTask[] = [
  {
    id: "p2lab1",
    title: "Task 1 — Verifikasi Instalasi Python",
    subtitle: "Susun langkah natural: jalur verifikasi LKPD dari terminal sampai program pertama.",
    mode: "steps",
    scenario:
      "Kamu baru saja selesai memasang Python dan sebuah editor di laptop. Guru membagikan LKPD Verifikasi Instalasi: buktikan bahwa interpreter dan editor benar-benar bekerja. Susun urutan langkah verifikasinya — langkah yang saling bergantung tidak boleh ditukar.",
    defs: {
      v1: { id: "v1", text: "Buka Command Prompt / Terminal", requires: [], run: "Jendela terminal terbuka dan siap menerima perintah." },
      v2: { id: "v2", text: "Ketik python --version", requires: ["v1"], run: "Terminal membaca perintah dan memanggil interpreter." },
      v3: { id: "v3", text: "Catat versi yang muncul (mis. Python 3.12.x)", requires: ["v2"], run: "Versi tercatat di LKPD — interpreter TERVERIFIKASI." },
      v4: { id: "v4", text: "Buka editor dan tulis print(\"Halo, Dunia!\")", requires: [], run: "Kode tertulis lengkap di editor." },
      v5: { id: "v5", text: "Simpan sebagai halo.py lalu jalankan (Run)", requires: ["v4"], run: "Interpreter membaca dan menjalankan halo.py." },
      v6: { id: "v6", text: "Cek keluaran shell: Halo, Dunia! muncul", requires: ["v5"], run: "Keluaran sesuai harapan — editor + interpreter TERVERIFIKASI." },
    },
    correctOrder: ["v1", "v2", "v3", "v4", "v5", "v6"],
    shuffled: ["v4", "v2", "v6", "v1", "v5", "v3"],
  },
  {
    id: "p2lab2",
    title: "Task 2 — Perbaikan PATH yang Terlewat",
    subtitle: "Susun langkah troubleshooting: dari pesan error sampai verifikasi ulang.",
    mode: "steps",
    scenario:
      "Sesaat setelah instalasi, perintah python --version membalas: \"'python' is not recognized as an internal or external command.\" Python sebenarnya sudah terpasang — yang bermasalah adalah konfigurasi PATH. Susun urutan perbaikan yang runtut sampai masalahnya terbukti selesai.",
    defs: {
      q1: { id: "q1", text: "Jalankan python --version di terminal (rekam pesan error)", requires: [], run: "Pesan tercatat: 'python' is not recognized." },
      q2: { id: "q2", text: "Baca pesan → diagnosis: PATH belum berisi lokasi Python", requires: ["q1"], run: "Diagnosis: instalasi sehat, konfigurasi PATH yang kurang." },
      q3: { id: "q3", text: "Jalankan ulang installer → pilih Modify", requires: ["q2"], run: "Installer terbuka pada mode perbaikan." },
      q4: { id: "q4", text: "Aktifkan 'Add python.exe to PATH' lalu lanjutkan", requires: ["q3"], run: "Konfigurasi PATH diperbarui — tanpa menghapus apa pun." },
      q5: { id: "q5", text: "Buka terminal BARU (agar PATH terbaca ulang)", requires: ["q4"], run: "Terminal baru memuat daftar lokasi terbaru." },
      q6: { id: "q6", text: "Uji ulang: python --version", requires: ["q5"], run: "Python 3.12.x muncul — perbaikan TERVERIFIKASI!" },
    },
    correctOrder: ["q1", "q2", "q3", "q4", "q5", "q6"],
    shuffled: ["q5", "q3", "q1", "q6", "q2", "q4"],
  },
];

export const FINAL_MISSION_P2 = {
  title: "Misi Terakhir: Menyiapkan Lab Python Kelas",
  scenario:
    "Semester baru dimulai dan lab sekolah hendak memasang Python di satu laptop percontohan sebelum digulirkan ke seluruh kelas. Kamu ditunjuk menyusun algoritma persiapannya: dari sumber unduhan sampai program pertama terbukti berjalan. Tidak ada urutan yang diberikan — rakit sendiri dari blok yang tersedia. Awas: ada blok pengecoh yang tidak dibutuhkan!",
  mission:
    "Rakit algoritma persiapan lengkap sehingga laptop lolos dua pemeriksaan: python --version menampilkan nomor versi, dan program halo.py menampilkan Halo, Dunia!.",
  defs: {
    g1: { id: "g1", text: "Cek versi & tipe sistem operasi laptop", requires: [], run: "Windows 11 64-bit — target installer jelas." },
    g2: { id: "g2", text: "Unduh installer Python 3 dari python.org sesuai OS", requires: ["g1"], run: "Installer asli terunduh — keaslian terjamin." },
    g3: { id: "g3", text: "Jalankan installer", requires: ["g2"], run: "Layar pertama installer terbuka." },
    g4: { id: "g4", text: "Centang 'Add python.exe to PATH'", requires: ["g3"], run: "PATH akan dikonfigurasi otomatis." },
    g5: { id: "g5", text: "Klik Install Now (fitur bawaan utuh)", requires: ["g4"], run: "Instalasi selesai — IDLE dan pip terpasang." },
    g6: { id: "g6", text: "Buka terminal baru", requires: ["g5"], run: "Terminal memuat PATH terbaru." },
    g7: { id: "g7", text: "Ketik python --version", requires: ["g6"], run: "Python 3.12.x — interpreter siap." },
    g8: { id: "g8", text: "Tulis print(\"Halo, Dunia!\") di editor", requires: ["g5"], run: "Kode tertulis di IDLE." },
    g9: { id: "g9", text: "Simpan sebagai halo.py", requires: ["g8"], run: "File halo.py tersimpan." },
    g10: { id: "g10", text: "Jalankan halo.py (Run)", requires: ["g9"], run: "Interpreter membaca dan menjalankan program." },
    g11: { id: "g11", text: "Cek keluaran shell: Halo, Dunia!", requires: ["g10"], run: "Keluaran sesuai harapan — lab SIAP DIPAKAI." },
    h1: { id: "h1", text: "Unduh installer dari situs 'Python full crack gratis'", kind: "distractor" as const },
    h2: { id: "h2", text: "Hapus semua fitur tambahan agar hemat ruang", kind: "distractor" as const },
    h3: { id: "h3", text: "Tulis program di Notepad lalu laporkan selesai", kind: "distractor" as const },
    h4: { id: "h4", text: "Instal ulang tiga kali untuk jaga-jaga", kind: "distractor" as const },
  } as Record<string, BlockDef>,
  correctOrder: ["g1", "g2", "g3", "g4", "g5", "g6", "g7", "g8", "g9", "g10", "g11"],
  shuffled: ["g6", "h1", "g2", "g10", "g11", "g4", "h3", "g7", "g1", "g9", "h2", "g3", "g5", "h4", "g8"],
  tests: [
    {
      label: "Pemeriksaan 1",
      input: "python --version",
      expected: ["Python 3.12.x"],
    },
    {
      label: "Pemeriksaan 2",
      input: "python halo.py",
      expected: ["Halo, Dunia!"],
    },
  ],
  pembahasan:
    "Algoritma persiapan lab menggabungkan seluruh materi X.AP.2: kenali dulu perangkat (cek versi & tipe OS), dapatkan installer dari sumber resmi yang sesuai, konfigurasi PATH sebelum tombol instal ditekan, lalu tutup dengan verifikasi ganda — perintah versi di terminal DAN program pertama yang benar-benar dijalankan hingga keluarannya terbaca. Urutan mengikuti ketergantungan: tidak ada verifikasi sebelum instalasi, tidak ada instalasi sebelum installer resmi ada. Blok pengecoh (crack, buang fitur, Notepad tanpa jalankan, instal ulang berulang) adalah persis kesalahan-kesalahan yang kita buru di 10 kartu dilema.",
  consoleTitle: "UJI MISI — PERSIAPAN LAB PYTHON",
  successText: "Laptop percontohan siap — lingkungan pemrograman terpasang dan terverifikasi.",
};
