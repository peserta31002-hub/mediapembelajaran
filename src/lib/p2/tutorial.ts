// ============================================================
// BAGIAN 2 — X.AP.2 INSTALASI LINGKUNGAN PEMROGRAMAN
// Tutorial pra-misi + metadata 5 level
// Sumber: Modul Ajar X.AP.2 (Instalasi Lingkungan Pemrograman —
// Informatika, Fase E / Kelas X, lanjutan X.AP.1)
// ============================================================

import { BlockDef } from "../gameData";

export interface LevelMeta {
  id: number;
  name: string;
  subtitle: string;
  ability: "mengidentifikasi" | "membaca" | "menganalisis" | "mengevaluasi" | "menyusun";
}

export const TUTORIAL_P2 = {
  title: "Program Pertama: Halo, Dunia!",
  scenario:
    "Sebelum misi dimulai, latihan dulu: Bima baru saja selesai memasang Python di laptopnya, lalu gurunya memberi tantangan klasik — tampilkan teks \"Halo, Dunia!\" di layar. Catatan langkahnya terserak dan tidak berurutan. Susun urutan yang benar, lalu UJI — lihat sendiri apa yang terjadi kalau urutannya salah.",
  blocks: {
    p1: {
      id: "p1",
      text: "Buka editor (IDLE atau Thonny)",
      requires: [],
      run: "Editor terbuka — area penulisan kode siap.",
    },
    p2: {
      id: "p2",
      text: "Tulis perintah print(\"Halo, Dunia!\")",
      requires: ["p1"],
      run: "Satu baris kode tertulis lengkap dengan kutip pembuka dan penutup.",
    },
    p3: {
      id: "p3",
      text: "Simpan file sebagai halo.py",
      requires: ["p2"],
      run: "File halo.py tersimpan di folder latihan.",
    },
    p4: {
      id: "p4",
      text: "Jalankan program (Run)",
      requires: ["p3"],
      run: "Interpreter membaca dan menjalankan kode baris demi baris.",
    },
    p5: {
      id: "p5",
      text: "Periksa keluaran di shell: Halo, Dunia!",
      requires: ["p4"],
      run: "Keluaran sesuai harapan — program pertama sukses!",
    },
  } as Record<string, BlockDef>,
  shuffled: ["p4", "p1", "p3", "p5", "p2"],
  hint:
    "Perhatikan: menjalankan program sebelum menyimpannya membuat editor protes, dan memeriksa keluaran hanya bermakna setelah program benar-benar dijalankan. Setiap langkah punya prasyaratnya sendiri.",
  consoleTitle: "KONSOL SIMULASI — PROGRAM PERTAMA",
  successTitle: "Algoritma program pertama berjalan sempurna",
};

export const LEVELS_P2: LevelMeta[] = [
  {
    id: 1,
    name: "Langkah Pasang",
    subtitle: "Mengidentifikasi urutan instalasi & program pertama",
    ability: "mengidentifikasi",
  },
  {
    id: 2,
    name: "Baca Sinyal",
    subtitle: "Membaca pesan error & layar installer",
    ability: "membaca",
  },
  {
    id: 3,
    name: "Detektif Kendala",
    subtitle: "Menganalisis penyebab kendala instalasi",
    ability: "menganalisis",
  },
  {
    id: 4,
    name: "Timbang Pilihan",
    subtitle: "Mengevaluasi sumber unduhan & alat kerja",
    ability: "mengevaluasi",
  },
  {
    id: 5,
    name: "Tukang Perbaiki",
    subtitle: "Memperbaiki panduan & program yang keliru",
    ability: "menyusun",
  },
];
