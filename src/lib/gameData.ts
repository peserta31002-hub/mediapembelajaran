// ============================================================
// KARTU DILEMA DIGITAL: ALGORITHM QUEST
// Konten pembelajaran berbasis Modul Ajar X.AP.1
// (Notasi dan Penulisan Algoritma — Informatika, Fase E / Kelas X)
// Semua materi dibatasi pada: pengertian algoritma, urutan
// instruksi, notasi MULAI/SELESAI, INPUT, OUTPUT/DISPLAY, ←,
// IF/ELSE, REPEAT/UNTIL, input-process-output.
// ============================================================

export type AbilityKey =
  | "mengidentifikasi"
  | "membaca"
  | "menganalisis"
  | "mengevaluasi"
  | "menyusun";

export type Verdict = "optimal" | "suboptimal" | "broken";
export type SimKind = "step" | "ok" | "err" | "info" | "warn";

export interface SimLine {
  text: string;
  kind: SimKind;
}

export interface CardOption {
  id: "A" | "B" | "C";
  pseudo: string[];
  verdict: Verdict;
  log: SimLine[];
  outcome: { title: string; desc: string };
  feedback: { right: string; wrong: string; why: string; correctIs: string };
}

export interface ReasonOption {
  id: string;
  text: string;
  sound: boolean;
  note: string;
}

export interface DilemmaCard {
  id: string;
  level: number;
  slot: number;
  ability: AbilityKey;
  title: string;
  hook: string;
  scenario: string;
  mission: string;
  scenarioPseudo?: string[];
  notation: string[];
  options: CardOption[];
  reasonPrompt: string;
  reasons: ReasonOption[];
  conceptTags: string[];
  pembahasan: string;
}

export const ABILITY_META: Record<
  AbilityKey,
  { label: string; bloom: string; desc: string }
> = {
  mengidentifikasi: {
    label: "Mengidentifikasi",
    bloom: "C2–C3",
    desc: "Mengenali urutan langkah yang logis dan runtut",
  },
  membaca: {
    label: "Membaca",
    bloom: "C3",
    desc: "Menelusuri makna notasi pseudocode sederhana",
  },
  menganalisis: {
    label: "Menganalisis",
    bloom: "C4",
    desc: "Menemukan kesalahan, kekurangan, dan ambiguitas",
  },
  mengevaluasi: {
    label: "Mengevaluasi",
    bloom: "C5",
    desc: "Membandingkan alternatif dan membenarkan pilihan",
  },
  menyusun: {
    label: "Menyusun Algoritma",
    bloom: "P3",
    desc: "Memperbaiki dan merakit solusi algoritmik",
  },
};

export const LEVELS = [
  {
    id: 1,
    name: "Peta Urutan",
    subtitle: "Mengidentifikasi urutan langkah",
    ability: "mengidentifikasi" as AbilityKey,
  },
  {
    id: 2,
    name: "Baca Kode",
    subtitle: "Membaca notasi algoritma sederhana",
    ability: "membaca" as AbilityKey,
  },
  {
    id: 3,
    name: "Pemburu Cacat",
    subtitle: "Menemukan kesalahan & ambiguitas",
    ability: "menganalisis" as AbilityKey,
  },
  {
    id: 4,
    name: "Dua Jalur",
    subtitle: "Membandingkan dua algoritma",
    ability: "mengevaluasi" as AbilityKey,
  },
  {
    id: 5,
    name: "Tukang Rakit",
    subtitle: "Memperbaiki & menyusun algoritma",
    ability: "menyusun" as AbilityKey,
  },
];

export const MINI_REFLECTIONS = [
  "Konsekuensinya menunjukkan pola yang tidak kuduga",
  "Alasan awalku ternyata kurang kuat",
  "Kumenemukan letak masalahnya setelah simulasi",
  "Kutetapkan pilihan karena terbukti tepat",
];

export const NOTATION_BRIEF = [
  { notation: "MULAI / SELESAI", meaning: "Penanda awal dan akhir algoritma" },
  { notation: "INPUT", meaning: "Menerima masukan data dari pengguna" },
  { notation: "OUTPUT / DISPLAY", meaning: "Menampilkan hasil ke layar" },
  { notation: "←", meaning: "Menetapkan (mengisi) nilai ke variabel" },
  { notation: "IF / ELSE", meaning: "Memeriksa kondisi, memilih jalur" },
  { notation: "REPEAT ... UNTIL", meaning: "Mengulang langkah sampai kondisi terpenuhi" },
];

// ------------------------------------------------------------
// Mesin simulasi blok langkah (dipakai Tutorial, Lab, Final)
// ------------------------------------------------------------
export interface BlockDef {
  id: string;
  text: string;
  requires?: string[];
  before?: string[];
  run?: string;
  kind?: "normal" | "distractor";
}

export interface SimResult {
  ok: boolean;
  lines: SimLine[];
}

export function simulateBlocks(
  order: string[],
  defs: Record<string, BlockDef>
): SimResult {
  const done = new Set<string>();
  const lines: SimLine[] = [];
  let stepNo = 0;

  for (const id of order) {
    const def = defs[id];
    if (!def) continue;
    stepNo += 1;
    const missing = (def.requires ?? []).filter((r) => !done.has(r));
    if (missing.length) {
      const m = defs[missing[0]];
      lines.push({
        kind: "err",
        text: `GAGAL di langkah ${stepNo}: "${def.text}" — langkah "${m.text}" harus dijalankan lebih dulu.`,
      });
      return { ok: false, lines };
    }
    const violates = (def.before ?? []).filter((b) => done.has(b));
    if (violates.length) {
      const v = defs[violates[0]];
      lines.push({
        kind: "err",
        text: `GAGAL di langkah ${stepNo}: "${def.text}" — harus berada SEBELUM "${v.text}".`,
      });
      return { ok: false, lines };
    }
    if (def.kind === "distractor") {
      lines.push({
        kind: "err",
        text: `GAGAL di langkah ${stepNo}: "${def.text}" — blok ini tidak dibutuhkan untuk masalah ini. Hapus dari algoritma.`,
      });
      return { ok: false, lines };
    }
    lines.push({ kind: "step", text: `▶ ${def.text}` });
    if (def.run) lines.push({ kind: "ok", text: def.run });
    done.add(id);
  }

  const unused = Object.values(defs).filter(
    (d) => d.kind !== "distractor" && !done.has(d.id)
  );
  if (unused.length) {
    lines.push({
      kind: "err",
      text: `Algoritma belum lengkap — blok "${unused[0].text}" belum dipakai.`,
    });
    return { ok: false, lines };
  }

  lines.push({ kind: "ok", text: "Algoritma selesai dijalankan tanpa error." });
  return { ok: true, lines };
}

export function shuffleIds(ids: string[], seed: number): string[] {
  const arr = [...ids];
  let s = seed;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ------------------------------------------------------------
// TUTORIAL — "Membuat Teh Manis"
// ------------------------------------------------------------
export const TUTORIAL = {
  title: "Teh Manis yang Berantakan",
  scenario:
    "Sebelum misi dimulai, latihan dulu: Rara mau membuat teh manis, tetapi catatan langkahnya terserak dan tidak berurutan. Susun urutan yang benar, lalu UJI — lihat sendiri apa yang terjadi kalau urutannya salah.",
  blocks: {
    t1: {
      id: "t1",
      text: "Rebus air hingga mendidih",
      requires: [],
      run: "Air mendidih — sumber panas siap.",
    },
    t2: {
      id: "t2",
      text: "Masukkan kantong teh dan 2 sdt gula ke gelas",
      requires: [],
      run: "Gelas kini berisi teh dan gula.",
    },
    t3: {
      id: "t3",
      text: "Tuang air panas ke dalam gelas",
      requires: ["t1"],
      run: "Air panas menuang — teh mulai larut.",
    },
    t4: {
      id: "t4",
      text: "Aduk hingga gula larut",
      requires: ["t2", "t3"],
      run: "Gula larut sempurna.",
    },
    t5: {
      id: "t5",
      text: "Angkat kantong teh — teh manis siap",
      requires: ["t4"],
      run: "Teh manis jadi — mekanisme game dipahami.",
    },
  } as Record<string, BlockDef>,
  shuffled: ["t3", "t1", "t5", "t4", "t2"],
  hint:
    "Perhatikan: langkah yang satu tidak boleh ditukar dengan langkah yang saling bergantung padanya. Beberapa urutan yang berbeda bisa sama-sama benar — yang penting setiap langkah punya prasyaratnya dulu.",
  consoleTitle: "KONSOL SIMULASI — TEH MANIS",
  successTitle: "Algoritma teh manis berjalan sempurna",
};

// ------------------------------------------------------------
// KARTU DILEMA — LEVEL 1 & 2
// ------------------------------------------------------------
export const CARDS: DilemmaCard[] = [
  {
    id: "1-1",
    level: 1,
    slot: 1,
    ability: "mengidentifikasi",
    title: "Deadline 21.00",
    hook: "Mengumpulkan laporan sebelum aplikasi kelas menutup.",
    scenario:
      "Laporan praktikum Dinda harus terkumpul di aplikasi kelas paling lambat pukul 21.00. Wi-Fi sedang lambat dan dia hanya punya 10 menit. Di catatannya ada tiga versi algoritma — tinggal satu yang benar-benar aman dijalankan.",
    mission:
      "Algoritma mana yang mengumpulkan laporan Dinda dengan benar sampai benar-benar diterima guru?",
    notation: ["Urutan langkah", "MULAI / SELESAI"],
    options: [
      {
        id: "A",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Buka aplikasi kelas",
          "Pilih tugas \"Laporan Praktikum\"",
          "Tekan tombol \"Kumpulkan\"",
          "Lampirkan file laporan",
          "Cek status pengumpulan",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Membuka aplikasi kelas…" },
          { kind: "ok", text: "Aplikasi terbuka." },
          { kind: "step", text: "Memilih tugas 'Laporan Praktikum'…" },
          { kind: "ok", text: "Tugas ditemukan." },
          { kind: "step", text: "Menekan tombol 'Kumpulkan'…" },
          { kind: "warn", text: "Status berubah: TERKUMPUL — belum ada lampiran." },
          { kind: "step", text: "Menekan 'Lampirkan file'…" },
          { kind: "err", text: "DITOLAK: tugas sudah dikumpulkan. Lampiran tidak bisa ditambahkan." },
          { kind: "step", text: "Mengecek status…" },
          { kind: "err", text: "TERKUMPUL • Lampiran: TIDAK ADA" },
        ],
        outcome: {
          title: "Terkumpul… tapi kosong",
          desc: "Status 'Terkumpul' muncul sebelum file dilampirkan. Guru membuka tugas dan menemukan nol lampiran — laporan Dinda dinilai rendah padahal dia menulisnya semalaman.",
        },
        feedback: {
          right: "Langkah membuka aplikasi dan memilih tugas sudah tepat di awal.",
          wrong: "Tombol 'Kumpulkan' ditekan SEBELUM file dilampirkan, dan cek status menjadi sia-sia.",
          why: "'Kumpulkan' adalah langkah yang MENUTUP tugas. Setelah tertutup, langkah 'Lampirkan file' tidak bisa dijalankan lagi. Langkah yang menghasilkan kondisi akhir harus paling akhir — setelah semua persiapannya selesai.",
          correctIs: "Pilihan C",
        },
      },
      {
        id: "B",
        verdict: "broken",
        pseudo: [
          "Pilih tugas \"Laporan Praktikum\"",
          "Lampirkan file laporan",
          "Buka aplikasi kelas",
          "Tekan tombol \"Kumpulkan\"",
          "Cek status pengumpulan",
        ],
        log: [
          { kind: "step", text: "Memilih tugas 'Laporan Praktikum'…" },
          { kind: "err", text: "GAGAL: aplikasi belum dibuka. Tidak ada daftar tugas yang bisa dipilih." },
          { kind: "info", text: "Algoritma berhenti di langkah pertama." },
        ],
        outcome: {
          title: "Tersangkut di langkah pertama",
          desc: "Langkah pertama meminta memilih tugas padahal aplikasi belum dibuka. Tidak ada yang bisa dipilih — algoritma macet sebelum sempat bekerja.",
        },
        feedback: {
          right: "Urutan melampirkan sebelum mengumpulkan sudah benar.",
          wrong: "Langkah 'Buka aplikasi' diletakkan ketiga, padahal semua langkah lain bergantung padanya.",
          why: "Langkah pembuka adalah PRASYARAT bagi langkah-langkah setelahnya. Instruksi yang menjadi syarat harus selalu mendahului instruksi yang membutuhkannya — tidak boleh diselipkan di tengah.",
          correctIs: "Pilihan C",
        },
      },
      {
        id: "C",
        verdict: "optimal",
        pseudo: [
          "MULAI",
          "Buka aplikasi kelas",
          "Pilih tugas \"Laporan Praktikum\"",
          "Lampirkan file laporan",
          "Tekan tombol \"Kumpulkan\"",
          "Cek status pengumpulan",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Membuka aplikasi kelas…" },
          { kind: "ok", text: "Aplikasi terbuka." },
          { kind: "step", text: "Memilih tugas…" },
          { kind: "ok", text: "Tugas ditemukan." },
          { kind: "step", text: "Melampirkan file laporan…" },
          { kind: "ok", text: "Laporan_Praktikum.pdf terlampir (2,4 MB)." },
          { kind: "step", text: "Menekan 'Kumpulkan'…" },
          { kind: "ok", text: "Status: TERKUMPUL — lampiran lengkap." },
          { kind: "step", text: "Mengecek status…" },
          { kind: "ok", text: "TERKUMPUL ✓ • diterima pukul 20.53" },
        ],
        outcome: {
          title: "Terkumpul tepat waktu",
          desc: "Aplikasi terbuka, file terlampir, tugas dikumpulkan, status terverifikasi. Laporan diterima guru lengkap pada pukul 20.53 — tujuh menit sebelum deadline.",
        },
        feedback: {
          right: "Semua langkah runtut: prasyarat dulu, penutup di akhir, verifikasi sebagai langkah terakhir.",
          wrong: "Tidak ada — urutan ini aman.",
          why: "Ciri algoritma yang baik terlihat di sini: setiap langkah hanya berjalan jika langkah yang dibutuhkannya sudah selesai, dan diakhiri pengecekan hasil agar keberhasilan terkonfirmasi, bukan diasumsikan.",
          correctIs: "—",
        },
      },
    ],
    reasonPrompt: "Kunci jawabanmu: alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "Langkah yang menutup tugas (Kumpulkan) harus paling akhir, setelah lampiran selesai.",
        sound: true,
        note: "Tepat — langkah penutup selalu bergantung pada semua langkah persiapan.",
      },
      {
        id: "r2",
        text: "Urutan tidak penting, yang penting semua langkah dilakukan.",
        sound: false,
        note: "Justru penting: beberapa langkah mengubah kondisi yang membuat langkah lain tak bisa dijalankan lagi.",
      },
      {
        id: "r3",
        text: "Mengumpulkan duluan lebih cepat, file menyusul kalau sempat.",
        sound: false,
        note: "Sistem tidak menunggu: begitu dikumpulkan tanpa lampiran, kesempatan melampirkan hilang.",
      },
    ],
    conceptTags: ["Dependensi antarlangkah", "Langkah penutup", "Verifikasi hasil"],
    pembahasan:
      "Kunci kartu ini adalah dependensi (ketergantungan) antarlangkah. 'Kumpulkan' menutup tugas, sehingga semua langkah persiapan — membuka aplikasi, memilih tugas, melampirkan file — wajib mendahuluinya. 'Cek status' diletakkan terakhir sebagai verifikasi: algoritma yang baik tidak berasumsi berhasil, tetapi memeriksa hasilnya. A gagal karena menutup tugas terlalu dini; B gagal karena langkah prasyarat diselipkan di tengah; C menjaga urutan ketergantungan dengan benar.",
  },
  {
    id: "1-2",
    level: 1,
    slot: 2,
    ability: "mengidentifikasi",
    title: "Mie Instan Jam 3 Pagi",
    hook: "Resep mie instan dengan urutan yang berantakan.",
    scenario:
      "Belajar malam untuk ulangan Informatika, perut Rizky bunyi. Ia mau merebus mie instan, tetapi catatan resepnya berantakan — tiga urutan langkah, hanya satu yang menghasilkan mie matang berbumbu.",
    mission: "Urutan langkah mana yang menghasilkan mie instan yang matang dan berbumbu?",
    notation: ["Urutan langkah", "MULAI / SELESAI"],
    options: [
      {
        id: "A",
        verdict: "optimal",
        pseudo: [
          "MULAI",
          "Rebus air hingga mendidih",
          "Masukkan mie ke air mendidih",
          "Masak 3 menit",
          "Tiriskan mie",
          "Campur bumbu, aduk rata",
          "Sajikan",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Merebus air…" },
          { kind: "ok", text: "Air mendidih (100°C)." },
          { kind: "step", text: "Memasukkan mie…" },
          { kind: "ok", text: "Mie masuk ke air panas." },
          { kind: "step", text: "Memasak 3 menit…" },
          { kind: "ok", text: "Mie matang kenyal." },
          { kind: "step", text: "Meniriskan mie…" },
          { kind: "ok", text: "Air rebusan dibuang." },
          { kind: "step", text: "Mencampur bumbu…" },
          { kind: "ok", text: "Bumbu meresap merata. Mie siap disantap." },
        ],
        outcome: {
          title: "Mie matang, bumbu meresap",
          desc: "Air dulu, mie kemudian, masak, tiriskan, baru bumbu. Hasil: mie kenyal berbumbu merata — seleranya dijamin.",
        },
        feedback: {
          right: "Setiap langkah menyiapkan kondisi untuk langkah berikutnya.",
          wrong: "Tidak ada — urutan ini benar.",
          why: "'Merebus' butuh air mendidih, 'meniriskan' baru masuk akal setelah mie matang, dan 'campur bumbu' paling efektif saat mie sudah kering dari air rebusan. Algoritma yang runtut = hasil yang terjamin.",
          correctIs: "—",
        },
      },
      {
        id: "B",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Rebus air hingga mendidih",
          "Masukkan mie ke air mendidih",
          "Tiriskan mie",
          "Masak 3 menit",
          "Campur bumbu, aduk rata",
          "Sajikan",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Merebus air…" },
          { kind: "ok", text: "Air mendidih." },
          { kind: "step", text: "Memasukkan mie…" },
          { kind: "ok", text: "Mie masuk ke air panas." },
          { kind: "step", text: "Meniriskan mie…" },
          { kind: "err", text: "Mie ditiriskan dalam keadaan MENTAH — baru masuk 2 detik." },
          { kind: "step", text: "Memasak 3 menit…" },
          { kind: "err", text: "Panci hanya berisi mie tanpa air. Mie 'menggoreng dirinya sendiri'… dan gosong." },
        ],
        outcome: {
          title: "Mie mentah lalu gosong",
          desc: "Meniriskan dilakukan sebelum memasak. Mie mentah kehilangan airnya, lalu 'dimasak' di panci kering — panas langsung membuatnya gosong.",
        },
        feedback: {
          right: "Merebus air dan memasukkan mie masih di jalur yang benar.",
          wrong: "Tiriskan dipindah ke SEBELUM 'Masak 3 menit'.",
          why: "Meniriskan hanya bermakna jika ada yang matang untuk ditiriskan. Satu posisi ditukar, seluruh algoritma kehilangan makna — inilah akibat menukar langkah yang saling bergantung.",
          correctIs: "Pilihan A",
        },
      },
      {
        id: "C",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "Rebus air hingga mendidih",
          "Masukkan mie ke air mendidih",
          "Campur bumbu ke dalam air rebusan",
          "Tiriskan mie",
          "Sajikan",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Merebus air…" },
          { kind: "ok", text: "Air mendidih." },
          { kind: "step", text: "Memasukkan mie…" },
          { kind: "ok", text: "Mie masuk dan mulai matang." },
          { kind: "step", text: "Mencampur bumbu ke air rebusan…" },
          { kind: "ok", text: "Bumbu larut penuh di air." },
          { kind: "step", text: "Meniriskan mie…" },
          { kind: "err", text: "Air rebusan — berisi SELURUH bumbu — terbuang ke wastafel." },
          { kind: "err", text: "Hasil: mie matang tapi TAWAR. Bumbu ikut terbuang." },
        ],
        outcome: {
          title: "Mie matang tapi tawar",
          desc: "Semua langkah berjalan 'lancar' tanpa berhenti — tetapi bumbu dicampur ke air rebusan yang kemudian ditiriskan. Mienya matang, seluruh bumbunya mengalir ke wastafel.",
        },
        feedback: {
          right: "Merebus, memasak, dan meniriskan berurutan dengan benar.",
          wrong: "Bumbu dicampur ke air rebusan SEBELUM ditiriskan.",
          why: "Cek tujuan setiap langkah: bumbu harus menempel di mie, bukan larut di air yang akan dibuang. Algoritma bisa berjalan tanpa error dan tetap gagal jika hasil akhirnya tidak sesuai tujuan.",
          correctIs: "Pilihan A",
        },
      },
    ],
    reasonPrompt: "Alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "Meniriskan hanya masuk akal setelah mienya selesai dimasak.",
        sound: true,
        note: "Benar — langkah 'tiriskan' bergantung penuh pada langkah 'masak'.",
      },
      {
        id: "r2",
        text: "Bumbu boleh dicampur kapan saja karena akhirnya diaduk juga.",
        sound: false,
        note: "Waktu pencampuran menentukan ke mana bumbu berakhir: di mie, atau di air rebusan yang terbuang.",
      },
      {
        id: "r3",
        text: "Mie instan mudah, urutannya tidak berpengaruh besar.",
        sound: false,
        note: "Dua pilihan lain gagal justru karena satu langkah ditukar. Pada urutan langkah, detail adalah segalanya.",
      },
    ],
    conceptTags: ["Urutan instruksi", "Tujuan tiap langkah", "Hasil akhir"],
    pembahasan:
      "Kedua pilihan salah di kartu ini berjalan 'mulai sampai selesai' tanpa berhenti — tetapi hasilnya mie gosong dan mie tawar. Pesannya: algoritma tidak dinilai dari seberapa mulus langkahnya berjalan, melainkan dari apakah urutan langkah MENJAMIN hasil akhir yang dimaksud. Meniriskan sebelum masak melanggar dependensi antarlangkah; mencampur bumbu ke air rebusan melanggar tujuan langkah itu sendiri.",
  },
  {
    id: "2-1",
    level: 2,
    slot: 1,
    ability: "membaca",
    title: "Login yang Membingungkan",
    hook: "Kartu dilema asli dari Modul Ajar X.AP.1.",
    scenario:
      "Aplikasi perpustakaan sekolah sedang uji coba. Aturannya: passwordBenar = 'infoka2026'. Seorang siswa mengetik 'infoka123' — password salah. Tim programmer menulis tiga versi algoritma login, dan salah satunya harus dipasang malam ini.",
    mission: "Versi algoritma mana yang merespons password salah dengan TEPAT?",
    notation: ["INPUT", "IF / ELSE", "DISPLAY", "←"],
    options: [
      {
        id: "A",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "INPUT password",
          "DISPLAY \"Login berhasil\"",
          "IF password ≠ passwordBenar THEN",
          "  DISPLAY \"Password salah\"",
          "SELESAI",
        ],
        log: [
          { kind: "info", text: "Menjalankan algoritma dengan input 'infoka123'…" },
          { kind: "ok", text: "INPUT password → password = 'infoka123'" },
          { kind: "warn", text: "DISPLAY 'Login berhasil' → tampil di layar" },
          { kind: "step", text: "IF password ≠ passwordBenar → 'infoka123' ≠ 'infoka2026' → BENAR" },
          { kind: "ok", text: "DISPLAY 'Password salah' → juga tampil di layar" },
          { kind: "err", text: "Layar menampilkan DUA pesan sekaligus: 'Login berhasil' dan 'Password salah'." },
        ],
        outcome: {
          title: "Dua pesan kontradiktif",
          desc: "Layar menampilkan 'Login berhasil' lalu 'Password salah' — bersebelahan. Siswa bingung: masuk atau tidak? Log akses mencatat keberhasilan login yang tidak pernah terjadi.",
        },
        feedback: {
          right: "Struktur IF untuk memeriksa password sudah ada.",
          wrong: "'Login berhasil' ditampilkan sebelum pemeriksaan, tanpa syarat apa pun.",
          why: "DISPLAY di luar IF akan SELALU tampil, tak peduli password benar atau salah. Pesan hasil harus muncul SETELAH pemeriksaan, di dalam cabang yang sesuai.",
          correctIs: "Pilihan B",
        },
      },
      {
        id: "B",
        verdict: "optimal",
        pseudo: [
          "MULAI",
          "INPUT password",
          "IF password = passwordBenar THEN",
          "  DISPLAY \"Login berhasil\"",
          "ELSE",
          "  DISPLAY \"Password salah\"",
          "SELESAI",
        ],
        log: [
          { kind: "info", text: "Menjalankan algoritma dengan input 'infoka123'…" },
          { kind: "ok", text: "INPUT password → password = 'infoka123'" },
          { kind: "step", text: "IF password = passwordBenar → 'infoka123' = 'infoka2026' → SALAH" },
          { kind: "ok", text: "Cabang ELSE berjalan: DISPLAY 'Password salah'" },
          { kind: "ok", text: "Layar: 'Password salah'. Siswa diminta mencoba lagi." },
        ],
        outcome: {
          title: "Respons tepat",
          desc: "Password salah → satu pesan yang benar: 'Password salah'. Password benar → 'Login berhasil'. Tidak ada pesan palsu.",
        },
        feedback: {
          right: "INPUT dulu, lalu pemeriksaan, lalu pesan di cabang yang sesuai.",
          wrong: "Tidak ada — ini pola login yang benar.",
          why: "Urutannya: data masuk (INPUT) → diperiksa (IF) → hasil sesuai cabang (DISPLAY). Setiap kemungkinan kondisi punya respons masing-masing — tidak ada kondisi terlupakan.",
          correctIs: "—",
        },
      },
      {
        id: "C",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "IF password = passwordBenar THEN",
          "  DISPLAY \"Login berhasil\"",
          "ELSE",
          "  DISPLAY \"Password salah\"",
          "INPUT password",
          "SELESAI",
        ],
        log: [
          { kind: "info", text: "Menjalankan algoritma dengan input 'infoka123'…" },
          { kind: "step", text: "IF password = passwordBenar → mengambil nilai password…" },
          { kind: "err", text: "ERROR: variabel 'password' belum memiliki nilai — INPUT belum dijalankan." },
          { kind: "info", text: "Program berhenti dengan error." },
        ],
        outcome: {
          title: "Error: data belum ada",
          desc: "Algoritma membandingkan password SEBELUM memintanya. Variabel 'password' masih kosong — pembandingan tidak bisa dijalankan dan program berhenti.",
        },
        feedback: {
          right: "Struktur IF/ELSE dengan dua cabang respons sudah lengkap.",
          wrong: "INPUT password diletakkan SETELAH pembandingan.",
          why: "IF membutuhkan isi variabel 'password' di baris pertamanya. Data harus di-INPUT sebelum dipakai: tidak ada pemeriksaan terhadap sesuatu yang belum ada.",
          correctIs: "Pilihan B",
        },
      },
    ],
    reasonPrompt: "Alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "Password harus dibaca dengan INPUT sebelum bisa dibandingkan.",
        sound: true,
        note: "Benar — pemeriksaan membutuhkan data yang sudah ada.",
      },
      {
        id: "r2",
        text: "Pesan 'berhasil/salah' harus muncul di dalam cabang IF/ELSE, bukan di luar.",
        sound: true,
        note: "Tepat — hanya cabang yang sesuai kondisi yang boleh berbicara.",
      },
      {
        id: "r3",
        text: "'Login berhasil' boleh ditampilkan duluan supaya aplikasi terasa cepat.",
        sound: false,
        note: "Kecepatan bukan alasan menampilkan informasi palsu; urutan logika tidak bisa ditukar demi kesan.",
      },
    ],
    conceptTags: ["Urutan INPUT → IF → OUTPUT", "Cabang IF/ELSE", "Variabel belum berisi"],
    pembahasan:
      "Kartu ini diambil langsung dari Modul Ajar X.AP.1. Pola yang benar: INPUT dulu, pemeriksaan kemudian, pesan di dalam cabang. A menampilkan pesan sukses tanpa syarat — DISPLAY di luar IF selalu tampil. C memeriksa variabel sebelum di-INPUT — error karena membandingkan data yang belum ada. Kegagalan login tidak selalu karena logika kondisinya salah; sering kali karena posisi INPUT dan OUTPUT-nya.",
  },
  {
    id: "2-2",
    level: 2,
    slot: 2,
    ability: "membaca",
    title: "Diskon Kantin Digital",
    hook: "Dua transaksi uji, satu algoritma yang selalu benar.",
    scenario:
      "Kantin digital sekolah memberi potongan Rp3.000 untuk belanja minimal Rp20.000. Petugas menguji setiap algoritma dengan dua transaksi: total belanja Rp15.000 dan Rp25.000. Hanya satu versi yang harus menghitung 'bayar' dengan benar untuk keduanya.",
    mission: "Algoritma mana yang menghitung nilai bayar dengan benar untuk KEDUA transaksi?",
    notation: ["←", "IF / ELSE", "OUTPUT"],
    options: [
      {
        id: "A",
        verdict: "broken",
        pseudo: [
          "total ← 25000",
          "bayar ← total",
          "IF total ≥ 20000 THEN",
          "  total ← total − 3000",
          "OUTPUT bayar",
        ],
        log: [
          { kind: "info", text: "Uji 1: total = 15000" },
          { kind: "step", text: "bayar ← 15000; IF 15000 ≥ 20000 → salah, dilewati" },
          { kind: "ok", text: "OUTPUT bayar → 15000 ✓" },
          { kind: "info", text: "Uji 2: total = 25000" },
          { kind: "step", text: "bayar ← 25000; IF 25000 ≥ 20000 → benar" },
          { kind: "warn", text: "total ← total − 3000 → total jadi 22000… tetapi yang ditampilkan adalah bayar" },
          { kind: "err", text: "OUTPUT bayar → 25000 ✗ (seharusnya 22000 — diskon lenyap)" },
        ],
        outcome: {
          title: "Diskon hilang diam-diam",
          desc: "Untuk belanja Rp25.000, potongan dihitung pada variabel 'total' — tetapi yang ditampilkan 'bayar' yang tidak pernah berubah. Kasir menagih Rp25.000; diskon Rp3.000 lenyap tanpa pesan error.",
        },
        feedback: {
          right: "Ada pengecekan syarat diskon dan nilai awal bayar.",
          wrong: "IF mengubah 'total', padahal variabel yang ditampilkan adalah 'bayar'.",
          why: "Cermati variabel mana yang DIMODIFIKASI dan mana yang DITAMPILKAN. Mengubah total tidak otomatis mengubah bayar — dua variabel berbeda menampung nilai berbeda.",
          correctIs: "Pilihan C",
        },
      },
      {
        id: "B",
        verdict: "broken",
        pseudo: [
          "total ← 25000",
          "IF total ≥ 20000 THEN",
          "  bayar ← total − 3000",
          "OUTPUT bayar",
        ],
        log: [
          { kind: "info", text: "Uji 1: total = 25000" },
          { kind: "step", text: "IF 25000 ≥ 20000 → benar → bayar ← 22000" },
          { kind: "ok", text: "OUTPUT bayar → 22000 ✓" },
          { kind: "info", text: "Uji 2: total = 15000" },
          { kind: "step", text: "IF 15000 ≥ 20000 → salah → cabang IF dilewati" },
          { kind: "err", text: "OUTPUT bayar → bayar TIDAK PERNAH DIISI. Layar menampilkan kosong (error)." },
        ],
        outcome: {
          title: "Kosong untuk belanja kecil",
          desc: "Berhasil saat diuji dengan Rp25.000 — tetapi pada Rp15.000 tidak ada ELSE yang mengisi 'bayar'. Layar kasir menampilkan kosong dan transaksi macet.",
        },
        feedback: {
          right: "Perhitungan potongan benar dan diterapkan ke variabel yang tepat.",
          wrong: "IF tanpa ELSE: kondisi 'tidak diskon' tidak punya penanganan.",
          why: "IF harus menutup SEMUA kemungkinan. Tanpa ELSE, 'bayar' hanya terisi bila syarat terpenuhi — belanja di bawah Rp20.000 membuat algoritma buntu. Menguji satu kasus saja tidak cukup untuk memastikan algoritma benar.",
          correctIs: "Pilihan C",
        },
      },
      {
        id: "C",
        verdict: "optimal",
        pseudo: [
          "total ← 25000",
          "IF total ≥ 20000 THEN",
          "  bayar ← total − 3000",
          "ELSE",
          "  bayar ← total",
          "OUTPUT bayar",
        ],
        log: [
          { kind: "info", text: "Uji 1: total = 15000 → IF salah → ELSE: bayar ← 15000" },
          { kind: "ok", text: "OUTPUT bayar → 15000 ✓" },
          { kind: "info", text: "Uji 2: total = 25000 → IF benar → bayar ← 22000" },
          { kind: "ok", text: "OUTPUT bayar → 22000 ✓" },
          { kind: "ok", text: "Kedua transaksi terhitung benar." },
        ],
        outcome: {
          title: "Selalu benar",
          desc: "Cabang IF menangani belanja besar, ELSE menangani belanja kecil. Semua kemungkinan nilai total menghasilkan 'bayar' yang benar.",
        },
        feedback: {
          right: "IF dan ELSE menutup semua kemungkinan; variabel yang diubah sama dengan yang ditampilkan.",
          wrong: "Tidak ada — lengkap dan konsisten.",
          why: "Algoritma yang benar tidak cukup diuji dengan satu kasus yang berhasil. Ia harus benar untuk SEMUA kemungkinan masukan — dan pasangan IF/ELSE memastikan tidak ada jalur yang menggantung.",
          correctIs: "—",
        },
      },
    ],
    reasonPrompt: "Alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "IF harus punya ELSE agar semua kemungkinan total menghasilkan bayar.",
        sound: true,
        note: "Tepat — setiap jalur kondisi wajib mengisi hasil.",
      },
      {
        id: "r2",
        text: "Kalau uji dengan total 25000 sudah benar, algoritmanya pasti benar.",
        sound: false,
        note: "Satu kasus berhasil tidak membuktikan apa-apa: pilihan B lolos di 25000 lalu gagal di 15000.",
      },
      {
        id: "r3",
        text: "Yang berkurang harusnya bayar, bukan total — perhatikan variabel yang ditampilkan.",
        sound: true,
        note: "Benar — modifikasi dan tampilan harus pada variabel yang sama.",
      },
    ],
    conceptTags: ["Kelengkapan IF/ELSE", "Konsistensi variabel", "Menguji banyak kasus"],
    pembahasan:
      "Dua jebakan klasik dalam satu kartu: (1) mengubah variabel yang salah — total diubah sementara bayar yang ditampilkan; (2) IF tanpa ELSE — nilai hanya terisi di satu jalur. Keduanya lolos bila hanya diuji sekali. Modul X.AP.1 menekankan pseudocode sederhana yang logis dan tidak ambigu: setiap kemungkinan masukan harus punya jalur menuju keluaran, dan variabel dipakai konsisten dari awal sampai OUTPUT.",
  },
  {
    id: "3-1",
    level: 3,
    slot: 1,
    ability: "menganalisis",
    title: "Tantangan Push Up 10 Hari",
    hook: "Pengulangan yang berhenti… atau tidak.",
    scenario:
      "Kelas 10-B menantang diri sendiri: pada hari ke-n lakukan n push up — hari 1: 1 push up, hari 10: 10 push up. Tiga versi algoritma latihan beredar di grup kelas. Hanya satu yang benar-benar menyelesaikan tantangan.",
    mission: "Algoritma mana yang menyelesaikan tantangan 10 hari dengan tepat?",
    notation: ["←", "REPEAT ... UNTIL"],
    options: [
      {
        id: "A",
        verdict: "optimal",
        pseudo: [
          "hari ← 1",
          "REPEAT UNTIL hari > 10",
          "  push up sebanyak hari",
          "  hari ← hari + 1",
          "END REPEAT",
        ],
        log: [
          { kind: "ok", text: "Hari 1: 1 push up" },
          { kind: "ok", text: "Hari 2: 2 push up" },
          { kind: "warn", text: "… (8 hari berikutnya terlewati) …" },
          { kind: "ok", text: "Hari 10: 10 push up" },
          { kind: "step", text: "hari = 11 → kondisi 'hari > 10' terpenuhi → pengulangan berhenti" },
          { kind: "ok", text: "Tantangan selesai: 10 hari, total 55 push up." },
        ],
        outcome: {
          title: "Tantangan tuntas",
          desc: "Nilai awal, langkah yang diulang, dan pembaruan hari berjalan lengkap. Berhenti tepat setelah hari ke-10 — total 55 push up.",
        },
        feedback: {
          right: "Ada nilai awal (hari ← 1), ada pembaruan (hari ← hari + 1), berhenti setelah hari 10.",
          wrong: "Tidak ada — ini pola pengulangan yang lengkap.",
          why: "REPEAT UNTIL butuh tiga komponen: nilai awal penghitung, langkah yang diulang, dan pembaruan yang pada akhirnya mengubah kondisi berhenti. 'hari ← hari + 1' inilah yang membuat pengulangan berhenti tepat waktu.",
          correctIs: "—",
        },
      },
      {
        id: "B",
        verdict: "broken",
        pseudo: [
          "hari ← 1",
          "REPEAT UNTIL hari > 10",
          "  push up sebanyak hari",
          "END REPEAT",
        ],
        log: [
          { kind: "ok", text: "Hari 1: 1 push up" },
          { kind: "step", text: "Cek kondisi: hari = 1, apakah 1 > 10? Tidak → ulangi" },
          { kind: "ok", text: "Hari 1: 1 push up" },
          { kind: "ok", text: "Hari 1: 1 push up" },
          { kind: "ok", text: "Hari 1: 1 push up" },
          { kind: "err", text: "… Pengulangan TIDAK PERNAH BERHENTI. hari selamanya bernilai 1 — tidak ada langkah yang mengubahnya." },
        ],
        outcome: {
          title: "Terjebak hari pertama",
          desc: "Tanpa 'hari ← hari + 1', nilai hari tidak pernah berubah. Kondisi 'hari > 10' tak akan terpenuhi — program mengulang hari pertama selamanya (infinite loop).",
        },
        feedback: {
          right: "Nilai awal dan langkah yang diulang sudah ada.",
          wrong: "Tidak ada langkah pembaruan di dalam REPEAT.",
          why: "Pengulangan berhenti hanya jika kondisi UNTIL berubah. Satu-satunya yang bisa mengubahnya adalah langkah di dalam badan pengulangan — hilangkan, dan algoritma berputar tanpa akhir.",
          correctIs: "Pilihan A",
        },
      },
      {
        id: "C",
        verdict: "broken",
        pseudo: [
          "hari ← 0",
          "REPEAT UNTIL hari = 10",
          "  push up sebanyak hari",
          "  hari ← hari + 1",
          "END REPEAT",
        ],
        log: [
          { kind: "ok", text: "Hari 1: 0 push up (tubuh belum bergerak)" },
          { kind: "ok", text: "Hari 2: 1 push up" },
          { kind: "warn", text: "… …" },
          { kind: "ok", text: "Hari 10: 9 push up" },
          { kind: "step", text: "hari = 10 → kondisi 'hari = 10' terpenuhi → berhenti" },
          { kind: "err", text: "Tantangan gagal: hari terakhir hanya 9 push up. Target 10 push up tidak pernah terjadi." },
        ],
        outcome: {
          title: "Meleset satu angka",
          desc: "Mulai dari 0 membuat seluruh jadwal bergeser: hari pertama 0 push up, dan saat penghitung berhenti, tantangan 10 push up tak pernah terjadi.",
        },
        feedback: {
          right: "Struktur pengulangan lengkap — ada pembaruan dan kondisi berhenti.",
          wrong: "Nilai awal hari ← 0, padahal tantangan dimulai dari hari 1.",
          why: "Nilai awal menentukan isi setiap iterasi dan kapan berhenti. Salah satu angka saja di awal, seluruh hasil bergeser — inilah pentingnya memeriksa batas awal dan akhir pengulangan.",
          correctIs: "Pilihan A",
        },
      },
    ],
    reasonPrompt: "Alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "Di dalam REPEAT harus ada langkah yang mengubah kondisi, misalnya menambah hari.",
        sound: true,
        note: "Benar — tanpa pembaruan, kondisi berhenti tak pernah tercapai.",
      },
      {
        id: "r2",
        text: "REPEAT otomatis berhenti setelah 10 kali.",
        sound: false,
        note: "REPEAT UNTIL berhenti karena KONDISI terpenuhi, bukan karena penghitungan otomatis.",
      },
      {
        id: "r3",
        text: "Mulai dari 0 atau 1 sama saja, toh sama-sama berulang.",
        sound: false,
        note: "Nilai awal menentukan berapa kali dan dengan nilai apa pengulangan berjalan.",
      },
    ],
    conceptTags: ["Nilai awal", "Kondisi berhenti", "Langkah pembaruan"],
    pembahasan:
      "Pengulangan (REPEAT) dalam X.AP.1 punya tiga komponen wajib: nilai awal, langkah yang diulang, dan pembaruan yang menggerakkan kondisi berhenti. B kehilangan pembaruan → infinite loop. C salah nilai awal → hasil bergeser satu. A benar karena ketiganya konsisten: mulai 1, bertambah tiap putaran, berhenti setelah melewati 10.",
  },
  {
    id: "3-2",
    level: 3,
    slot: 2,
    ability: "menganalisis",
    title: "QR Absensi yang Terlalu Baik",
    hook: "ELSE yang menangkap segalanya — termasuk sampah.",
    scenario:
      "Sistem absensi QR kelas menghitung jumlah hadir dan izin. Kode valid hanya dua: 'hadir' dan 'izin'. Masalahnya, kadang QR rusak sehingga terbaca acak — misalnya 'H4D1R' atau 'x#9k'. Tiga versi algoritma dicoba ke kelas.",
    mission: "Algoritma mana yang mencatat absen dengan benar — termasuk saat QR-nya rusak?",
    notation: ["IF / ELSE", "←", "DISPLAY"],
    options: [
      {
        id: "A",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "INPUT kode",
          "IF kode = \"hadir\" THEN",
          "  jumlahHadir ← jumlahHadir + 1",
          "ELSE",
          "  jumlahIzin ← jumlahIzin + 1",
          "SELESAI",
        ],
        log: [
          { kind: "info", text: "Uji 1: kode = 'hadir' → jumlahHadir + 1 ✓" },
          { kind: "info", text: "Uji 2: kode = 'izin' → jumlahIzin + 1 ✓" },
          { kind: "info", text: "Uji 3: kode = 'x#9k' (QR rusak)" },
          { kind: "step", text: "IF 'x#9k' = 'hadir' → salah → masuk ELSE" },
          { kind: "err", text: "jumlahIzin + 1 → siswa yang HADIR tercatat IZIN. Rekap: Hadir 14, Izin 4 — padahal semua hadir." },
        ],
        outcome: {
          title: "Hadir dihitung izin",
          desc: "ELSE menangkap SEMUA kode yang bukan 'hadir' — termasuk QR rusak. Rekap kacau: siswa hadir dicatat izin, wali kelas mulai menelepon orang tua.",
        },
        feedback: {
          right: "Penghitungan jumlahHadir untuk kode 'hadir' benar.",
          wrong: "ELSE dipakai sebagai penampung 'izin', padahal isi ELSE adalah SEMUA kode selain 'hadir'.",
          why: "ELSE berarti 'selainnya' — bukan 'izin'. Ketika ada lebih dari dua kemungkinan, setiap kategori butuh pemeriksaan sendiri, plus penanganan khusus untuk kode tak dikenal.",
          correctIs: "Pilihan B",
        },
      },
      {
        id: "B",
        verdict: "optimal",
        pseudo: [
          "MULAI",
          "INPUT kode",
          "IF kode = \"hadir\" THEN",
          "  jumlahHadir ← jumlahHadir + 1",
          "ELSE IF kode = \"izin\" THEN",
          "  jumlahIzin ← jumlahIzin + 1",
          "ELSE",
          "  DISPLAY \"QR tidak dikenal, mohon tap ulang\"",
          "SELESAI",
        ],
        log: [
          { kind: "info", text: "Uji 1: 'hadir' → jumlahHadir + 1 ✓" },
          { kind: "info", text: "Uji 2: 'izin' → jumlahIzin + 1 ✓" },
          { kind: "info", text: "Uji 3: 'x#9k' (QR rusak)" },
          { kind: "step", text: "Bukan 'hadir', bukan 'izin' → cabang ELSE terakhir" },
          { kind: "ok", text: "DISPLAY 'QR tidak dikenal, mohon tap ulang' → siswa men-tap ulang dan tercatat benar." },
        ],
        outcome: {
          title: "Semua kasus tertangani",
          desc: "Hadir, izin, dan QR rusak masing-masing punya jalur. Rekap absensi tetap bersih dan bisa dipercaya.",
        },
        feedback: {
          right: "Tiga cabang: hadir, izin, dan penanganan kode tak dikenal.",
          wrong: "Tidak ada — ini penanganan kondisi yang lengkap.",
          why: "Ketika kemungkinan lebih dari dua, gunakan pemeriksaan bertingkat dan selalu sediakan cabang terakhir untuk 'selainnya'. Penanganan kasus tak terduga (QR rusak) adalah bagian dari algoritma yang baik.",
          correctIs: "—",
        },
      },
      {
        id: "C",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "INPUT kode",
          "IF kode = \"hadir\" THEN",
          "  DISPLAY \"Hadir tercatat\"",
          "IF kode = \"izin\" THEN",
          "  DISPLAY \"Izin tercatat\"",
          "SELESAI",
        ],
        log: [
          { kind: "info", text: "Uji 1: 'hadir' → DISPLAY 'Hadir tercatat' ✓ (terasa berhasil)" },
          { kind: "info", text: "Uji 2: 'izin' → DISPLAY 'Izin tercatat' ✓ (terasa berhasil)" },
          { kind: "step", text: "Guru membuka rekap harian…" },
          { kind: "err", text: "jumlahHadir = 0, jumlahIzin = 0. Tidak ada satu pun absen yang dihitung." },
        ],
        outcome: {
          title: "Terasa berhasil, rekap kosong",
          desc: "Pesan 'tercatat' muncul di layar — tetapi tidak ada satu pun penghitungan yang dijalankan. Layar ramai, data nihil.",
        },
        feedback: {
          right: "Kedua kode valid diperiksa masing-masing.",
          wrong: "Yang dijalankan hanya DISPLAY — tidak ada perintah menambah jumlahHadir / jumlahIzin.",
          why: "Pesan di layar bukan bukti data tersimpan. Bandingkan tujuan (menghitung absen) dengan yang sebenarnya dilakukan langkah (menampilkan teks): algoritma harus benar-benar memproses, bukan sekadar terlihat bekerja.",
          correctIs: "Pilihan B",
        },
      },
    ],
    reasonPrompt: "Alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "ELSE menangkap semua kode selain 'hadir' — termasuk yang rusak.",
        sound: true,
        note: "Benar — makna ELSE harus dibaca harfiah: 'selainnya'.",
      },
      {
        id: "r2",
        text: "Selama pesan 'tercatat' muncul, absen pasti tersimpan.",
        sound: false,
        note: "Tampilan pesan ≠ pemrosesan data. Periksa langkah yang benar-benar mengubah data.",
      },
      {
        id: "r3",
        text: "Setiap kemungkinan kode butuh pemeriksaannya sendiri, plus jalur untuk kode tak dikenal.",
        sound: true,
        note: "Benar — pemeriksaan bertingkat menutup semua kasus.",
      },
    ],
    conceptTags: ["Makna ELSE", "Kondisi bertingkat", "Tampilan vs pemrosesan"],
    pembahasan:
      "Kartu ini melatih membaca makna ELSE secara harfiah: 'selain kondisi di atas'. Bila kemungkinan data lebih dari dua kategori, ELSE yang dipakai sembarangan akan menangkap sampah — QR rusak ikut dihitung sebagai izin. Versi C mengajarkan pelajaran berbeda: jangan percaya pesan di layar; periksa langkah yang benar-benar mengubah data.",
  },
  {
    id: "4-1",
    level: 4,
    slot: 1,
    ability: "mengevaluasi",
    title: "Catatan Jajan Mingguan",
    hook: "Dua algoritma sama-sama benar — pilih yang paling tepat.",
    scenario:
      "Vino mencatat pengeluaran jajan tujuh hari: 8000, 12000, 5000, 10000, 7000, 15000, 6000 — totalnya seharusnya Rp63.000. Ia menemukan tiga algoritma penjumlahan dan bingung memilih yang paling tepat.",
    mission: "Algoritma mana yang paling tepat menampilkan total pengeluaran mingguan?",
    notation: ["←", "REPEAT", "OUTPUT"],
    options: [
      {
        id: "A",
        verdict: "broken",
        pseudo: [
          "total ← 0",
          "REPEAT 7 KALI",
          "  INPUT pengeluaran",
          "  total ← pengeluaran",
          "END REPEAT",
          "OUTPUT total",
        ],
        log: [
          { kind: "ok", text: "Hari 1: masuk 8000 → total ← 8000" },
          { kind: "ok", text: "Hari 2: masuk 12000 → total ← 12000 (nilai sebelumnya DIGANTI)" },
          { kind: "warn", text: "… hari 3–6 ikut menimpa …" },
          { kind: "ok", text: "Hari 7: masuk 6000 → total ← 6000" },
          { kind: "err", text: "OUTPUT total → 6000. Seharusnya 63000 — enam hari data hilang." },
        ],
        outcome: {
          title: "Hanya hari terakhir yang tersisa",
          desc: "← menetapkan (menimpa), bukan menambah. Setiap hari isi total ditimpa pengeluaran terbaru — enam hari sebelumnya lenyap.",
        },
        feedback: {
          right: "Struktur pengulangan dan INPUT sudah tepat.",
          wrong: "total ← pengeluaran menimpa isi total, bukan menambahkannya.",
          why: "Tanda ← berarti 'isi variabel dengan nilai baru'. Untuk menjumlah, isi lama harus ikut dihitung: total ← total + pengeluaran. Satu tanda tambah (+) yang hilang mengubah makna seluruh algoritma.",
          correctIs: "Pilihan C",
        },
      },
      {
        id: "B",
        verdict: "suboptimal",
        pseudo: [
          "INPUT hari1, hari2, hari3, hari4, hari5, hari6, hari7",
          "total ← hari1 + hari2 + hari3 + hari4 + hari5 + hari6 + hari7",
          "OUTPUT total",
        ],
        log: [
          { kind: "ok", text: "Menampung 7 nilai… menjumlahkan semuanya…" },
          { kind: "ok", text: "OUTPUT total → 63000 ✓ hasilnya benar!" },
          { kind: "warn", text: "Tapi… bagaimana kalau catatannya 30 hari? 90 hari?" },
        ],
        outcome: {
          title: "Benar — tapi kaku",
          desc: "Hasilnya benar untuk 7 hari. Masalahnya bukan kebenaran, melainkan bentuk: setiap penambahan hari memaksa algoritma ditulis ulang dan variabelnya bertambah terus.",
        },
        feedback: {
          right: "Hasil perhitungan benar — tidak ada kesalahan logika.",
          wrong: "Tidak fleksibel: tiap perubahan jumlah hari memaksa penulisan ulang dan rentan salah ketik satu variabel.",
          why: "Ada dua algoritma yang sama-sama benar — pilih yang lebih mudah diperiksa dan diperluas. Modul X.AP.1 menekankan algoritma yang jelas dan tidak ambigu: pola berulang dalam pengulangan lebih mudah dicek daripada rangkaian panjang.",
          correctIs: "Pilihan C",
        },
      },
      {
        id: "C",
        verdict: "optimal",
        pseudo: [
          "total ← 0",
          "REPEAT 7 KALI",
          "  INPUT pengeluaran",
          "  total ← total + pengeluaran",
          "END REPEAT",
          "OUTPUT total",
        ],
        log: [
          { kind: "ok", text: "Hari 1: total ← 0 + 8000 = 8000" },
          { kind: "ok", text: "Hari 2: total ← 8000 + 12000 = 20000" },
          { kind: "warn", text: "… terus bertambah …" },
          { kind: "ok", text: "Hari 7: total ← 57000 + 6000 = 63000" },
          { kind: "ok", text: "OUTPUT total → 63000 ✓" },
        ],
        outcome: {
          title: "Total akurat & ringkas",
          desc: "Pola akumulator: satu variabel total terus menampung penjumlahan. Ringkas, mudah diperiksa, dan tinggal ganti 7 menjadi 30 atau 90 hari.",
        },
        feedback: {
          right: "total ← total + pengeluaran menjumlahkan dengan benar; pola akumulator mudah diperluas.",
          wrong: "Tidak ada — ini bentuk paling tepat.",
          why: "Algoritma yang baik memenuhi tujuan DAN bersih bentuknya. Pengulangan dengan akumulator meminimalkan kesempatan salah ketik dan tetap benar saat data bertambah.",
          correctIs: "—",
        },
      },
    ],
    reasonPrompt: "Alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "← menimpa nilai lama, jadi menjumlah butuh total ← total + pengeluaran.",
        sound: true,
        note: "Benar — inilah beda 'menetapkan' dengan 'menambah'.",
      },
      {
        id: "r2",
        text: "Yang penting hasilnya benar — bentuk penulisan tidak penting.",
        sound: false,
        note: "Bentuk menentukan kemudahan memeriksa dan memperluas; kesalahan sembunyi di tulisan yang panjang.",
      },
      {
        id: "r3",
        text: "Dua algoritma yang benar hasilnya sama — pilih yang polanya lebih sederhana dan mudah diperiksa.",
        sound: true,
        note: "Tepat — inilah pertimbangan evaluasi, bukan sekadar benar/salah.",
      },
    ],
    conceptTags: ["Makna ←", "Pola akumulator", "Kejelasan & keterluasan"],
    pembahasan:
      "Kartu level evaluasi: bukan sekadar mencari yang 'salah', melainkan menimbang yang 'paling tepat'. A gagal karena salah membaca makna ←. B dan C sama-sama menghasilkan 63.000 — tetapi C (pola akumulator) lebih ringkas dan tetap benar untuk 30 hari. Ketika dua algoritma sama benar, kriteria penentuannya: kejelasan, kemudahan pemeriksaan, dan keterluasan.",
  },
  {
    id: "4-2",
    level: 4,
    slot: 2,
    ability: "mengevaluasi",
    title: "Siapa Nilai Tertinggi?",
    hook: "Pola rekor: pembanding harus mengarah ke pemegang rekor.",
    scenario:
      "Wali kelas mengolah tiga nilai ulangan: 90, 70, 80. Ia butuh algoritma pencari nilai tertinggi — nantinya dipakai untuk 30 nilai sekaligus. Tiga versi sampai ke mejanya.",
    mission: "Algoritma mana yang menampilkan nilai TERTINGGI dan tetap bisa dipercaya untuk data yang lebih banyak?",
    notation: ["←", "IF"],
    options: [
      {
        id: "A",
        verdict: "optimal",
        pseudo: [
          "INPUT n1, n2, n3",
          "maks ← n1",
          "IF n2 > maks THEN maks ← n2",
          "IF n3 > maks THEN maks ← n3",
          "OUTPUT maks",
        ],
        log: [
          { kind: "ok", text: "maks ← n1 → 90 (pemegang rekor sementara)" },
          { kind: "step", text: "IF n2 > maks → 70 > 90? Tidak → maks tetap 90" },
          { kind: "step", text: "IF n3 > maks → 80 > 90? Tidak → maks tetap 90" },
          { kind: "ok", text: "OUTPUT maks → 90 ✓" },
        ],
        outcome: {
          title: "Rekor dijaga dengan benar",
          desc: "maks berperan sebagai pemegang rekor: mulai dari nilai pertama, digantikan hanya jika ada yang lebih besar. Hasil: 90 — dan pola ini tinggal disalin untuk 30 nilai.",
        },
        feedback: {
          right: "Pembanding selalu maks — pemegang rekor terkini; pola mudah diperluas.",
          wrong: "Tidak ada.",
          why: "Pola 'maks ← nilai pertama, lalu bandingkan satu per satu' adalah pola pencarian maksimum yang standar. Setiap pembandingan selalu terhadap pemegang rekor terbaru, bukan terhadap nilai tetap.",
          correctIs: "—",
        },
      },
      {
        id: "B",
        verdict: "broken",
        pseudo: [
          "INPUT n1, n2, n3",
          "maks ← n1",
          "IF n2 > maks THEN maks ← n2",
          "IF n3 > n2 THEN maks ← n3",
          "OUTPUT maks",
        ],
        log: [
          { kind: "ok", text: "maks ← n1 → 90" },
          { kind: "step", text: "IF 70 > 90? Tidak → maks tetap 90" },
          { kind: "step", text: "IF n3 > n2 → 80 > 70? YA → maks ← 80" },
          { kind: "err", text: "OUTPUT maks → 80 ✗ (80 memang lebih besar dari 70, tapi bukan yang terbesar)" },
        ],
        outcome: {
          title: "Rekor dikalahkan peserta kedua",
          desc: "Pembanding terakhir menyasar n2 (nilai tetap 70), bukan maks. Nilai 80 'menang' hanya karena mengalahkan 70 — padahal 90 masih memegang rekor.",
        },
        feedback: {
          right: "Ide awal sama dengan pola yang benar.",
          wrong: "IF terakhir membandingkan n3 dengan n2, bukan dengan maks.",
          why: "Setiap pembandingan harus terhadap pemegang rekor terkini. Menyasar nilai tetap membuat keputusan diambil dari informasi basi — satu kata yang keliru (n2 vs maks) merusak seluruh hasil.",
          correctIs: "Pilihan A",
        },
      },
      {
        id: "C",
        verdict: "broken",
        pseudo: [
          "INPUT n1, n2, n3",
          "maks ← n1",
          "IF n2 < maks THEN maks ← n2",
          "IF n3 < maks THEN maks ← n3",
          "OUTPUT maks",
        ],
        log: [
          { kind: "ok", text: "maks ← n1 → 90" },
          { kind: "step", text: "IF n2 < maks → 70 < 90? YA → maks ← 70" },
          { kind: "step", text: "IF n3 < maks → 80 < 70? Tidak → maks tetap 70" },
          { kind: "err", text: "OUTPUT maks → 70 ✗ — itu nilai TERENDAH, bukan tertinggi." },
        ],
        outcome: {
          title: "Mencari yang terendah",
          desc: "Tanda pembandingnya terbalik (< alih-alih >): algoritma mengganti rekor setiap menemukan nilai yang LEBIH KECIL. Hasilnya 70 — nilai terendah.",
        },
        feedback: {
          right: "Struktur pola rekor sudah berjalan.",
          wrong: "Arah pembanding terbalik: < mencari nilai terkecil.",
          why: "Cek tujuan: mencari tertinggi berarti mengganti rekor hanya jika nilai baru LEBIH BESAR. Tanda > dan < terlihat sepele, tetapi menentukan arah seluruh algoritma.",
          correctIs: "Pilihan A",
        },
      },
    ],
    reasonPrompt: "Alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "Pembanding harus selalu mengarah ke maks — pemegang rekor terkini.",
        sound: true,
        note: "Benar — itulah inti pola maksimum.",
      },
      {
        id: "r2",
        text: "Mencari tertinggi berarti tanda pembandingnya harus > (lebih besar), bukan <.",
        sound: true,
        note: "Benar — arah pembanding mengikuti tujuan.",
      },
      {
        id: "r3",
        text: "maks ← n1 di awal tidak perlu; cukup ganti dengan maks ← 0.",
        sound: false,
        note: "Untuk nilai 0–100 memang berhasil, tetapi kebiasaan itu gagal saat data bisa negatif. Mengambil nilai pertama sebagai rekor awal selalu aman.",
      },
    ],
    conceptTags: ["Pola maksimum", "Pembanding rekor", "Arah pembanding"],
    pembahasan:
      "Pola mencari maksimum: simpan nilai pertama sebagai rekor, lalu bandingkan seluruh nilai terhadap rekor — bukan terhadap nilai tetap. B keliru menyasar n2; C salah arah pembanding. Kartu ini menyiapkan pola berpikir untuk data banyak: algoritma 3 nilai dengan pola yang tepat tetap benar untuk 30 nilai.",
  },
  {
    id: "5-1",
    level: 5,
    slot: 1,
    ability: "menyusun",
    title: "Parkir Sekolah yang Mangkir",
    hook: "Perbaiki algoritma yang punya dua cacat sekaligus.",
    scenario:
      "Aturan parkir sekolah: 2 jam pertama Rp2.000; setiap jam berikutnya Rp1.000. Algoritma petugas ternyata bermasalah. Guru mengusulkan tiga versi perbaikan — pilih yang benar-benar menutup semua masalah.",
    mission: "Perbaikan mana yang membuat algoritma parkir berjalan benar untuk DURASI BERAPA PUN?",
    scenarioPseudo: [
      "MULAI",
      "IF durasi > 2 THEN",
      "  biaya ← 2000 + (durasi − 2) × 1000",
      "OUTPUT biaya",
      "SELESAI",
    ],
    notation: ["INPUT", "IF / ELSE", "←", "OUTPUT"],
    options: [
      {
        id: "A",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "INPUT durasi",
          "IF durasi > 2 THEN",
          "  biaya ← 2000 + (durasi − 2) × 1000",
          "OUTPUT biaya",
          "SELESAI",
        ],
        log: [
          { kind: "info", text: "Uji 1: durasi = 4 → IF benar → biaya ← 2000 + 2×1000 = 4000 → OUTPUT 4000 ✓" },
          { kind: "info", text: "Uji 2: durasi = 1 → IF salah → dilewati" },
          { kind: "err", text: "OUTPUT biaya → biaya tidak pernah diisi (kosong). Motor 1 jam tidak bisa keluar gerbang." },
        ],
        outcome: {
          title: "Celahnya masih ada",
          desc: "INPUT berhasil ditambahkan — tetapi durasi ≤ 2 jam masih tanpa jalur pengisian biaya. Gerbang tetap macet untuk mayoritas kendaraan.",
        },
        feedback: {
          right: "Sumber data diperbaiki: INPUT durasi ditambahkan.",
          wrong: "Masalah kedua dibiarkan: tidak ada ELSE untuk durasi ≤ 2 jam.",
          why: "Perbaikan harus menutup SEMUA kekurangan. Menutup satu dari dua cacat hanya memindahkan titik gagal — dari durasi panjang ke durasi pendek.",
          correctIs: "Pilihan B",
        },
      },
      {
        id: "B",
        verdict: "optimal",
        pseudo: [
          "MULAI",
          "INPUT durasi",
          "IF durasi > 2 THEN",
          "  biaya ← 2000 + (durasi − 2) × 1000",
          "ELSE",
          "  biaya ← 2000",
          "OUTPUT biaya",
          "SELESAI",
        ],
        log: [
          { kind: "info", text: "Uji 1: durasi = 4 → biaya ← 2000 + 2×1000 = 4000 ✓" },
          { kind: "info", text: "Uji 2: durasi = 1 → ELSE → biaya ← 2000 ✓" },
          { kind: "ok", text: "Semua durasi menghasilkan biaya. Gerbang lancar." },
        ],
        outcome: {
          title: "Semua durasi terlayani",
          desc: "Dua cacat ditutup sekaligus: data masuk tersedia dan kedua jalur kondisi mengisi biaya. Algoritma siap dipasang di gerbang.",
        },
        feedback: {
          right: "INPUT durasi menutup cacat data; ELSE biaya ← 2000 menutup jalur durasi pendek.",
          wrong: "Tidak ada — perbaikan lengkap.",
          why: "Sebelum memperbaiki, daftarkan semua cacat: (1) tidak ada INPUT, (2) tidak ada ELSE. Perbaikan yang baik menyasar semuanya — bukan hanya yang paling terlihat.",
          correctIs: "—",
        },
      },
      {
        id: "C",
        verdict: "broken",
        pseudo: [
          "MULAI",
          "INPUT biaya",
          "IF durasi > 2 THEN",
          "  biaya ← 2000 + (durasi − 2) × 1000",
          "ELSE",
          "  biaya ← 2000",
          "OUTPUT biaya",
          "SELESAI",
        ],
        log: [
          { kind: "step", text: "Meminta input… pengguna mengetik angka yang diketahui." },
          { kind: "ok", text: "INPUT biaya terisi." },
          { kind: "step", text: "IF durasi > 2 → mengambil nilai durasi…" },
          { kind: "err", text: "ERROR: variabel 'durasi' tidak pernah di-INPUT. Pemeriksaan tidak bisa dijalankan." },
        ],
        outcome: {
          title: "Variabel tertukar",
          desc: "Yang di-INPUT justru 'biaya' — variabel yang seharusnya menjadi keluaran. 'durasi', yang dibutuhkan pemeriksaan, tidak pernah terisi.",
        },
        feedback: {
          right: "Struktur IF/ELSE lengkap.",
          wrong: "INPUT biaya seharusnya INPUT durasi — variabel masukan dan keluaran tertukar.",
          why: "Pisahkan dengan jelas: data MASUK (durasi kendaraan) dan data KELUARAN (biaya yang dihitung). Meng-INPUT yang seharusnya dihitung membuat algoritma berputar di tempat.",
          correctIs: "Pilihan B",
        },
      },
    ],
    reasonPrompt: "Alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "Perbaikan harus menutup semua cacat: sumber data dan seluruh cabang kondisi.",
        sound: true,
        note: "Benar — inventarisasi cacat dulu, baru menambal.",
      },
      {
        id: "r2",
        text: "INPUT durasi adalah yang paling penting; sisanya bisa menyusul.",
        sound: false,
        note: "Algoritma dengan INPUT lengkap tetap gagal jika ada jalur kondisi yang tidak mengisi hasil.",
      },
      {
        id: "r3",
        text: "Yang perlu di-INPUT adalah biaya, karena itu yang dicari.",
        sound: false,
        note: "Biaya adalah KELUARAN (dihitung dari durasi); yang diminta dari pengguna adalah durasi.",
      },
    ],
    conceptTags: ["Kelengkapan INPUT", "Seluruh cabang mengisi hasil", "Masukan vs keluaran"],
    pembahasan:
      "Algoritma awal punya dua cacat sekaligus: tidak meminta data (INPUT durasi) dan tidak menutup jalur kondisi (tanpa ELSE). Perbaikan B menutup keduanya. A hanya menutup satu — kegagalan tetap terjadi, hanya di kasus lain. C menunjukkan pentingnya membedakan variabel masukan dan keluaran. Perbaikan yang baik dimulai dari daftar cacat, bukan menambal yang paling mencolok.",
  },
  {
    id: "5-2",
    level: 5,
    slot: 2,
    ability: "menyusun",
    title: "Target Sepatu Rp600.000",
    hook: "Benar hari ini — dan benar untuk target berapa pun?",
    scenario:
      "Raka menabung Rp5.000 setiap hari. Targetnya Rp600.000. Ia ingin tahu berapa hari lagi. Tiga algoritma diusulkan — semuanya terlihat meyakinkan. Catatan penting: target menabung berikutnya bisa berupa angka berapa pun, bukan hanya kelipatan 5.000.",
    mission: "Algoritma mana yang menghitung jumlah hari dengan benar — dan tetap benar untuk target berapa pun?",
    notation: ["←", "REPEAT ... UNTIL", "OUTPUT"],
    options: [
      {
        id: "A",
        verdict: "optimal",
        pseudo: [
          "hari ← 0",
          "total ← 0",
          "REPEAT UNTIL total ≥ target",
          "  total ← total + 5000",
          "  hari ← hari + 1",
          "END REPEAT",
          "OUTPUT hari",
        ],
        log: [
          { kind: "info", text: "Uji: target = 600000" },
          { kind: "warn", text: "… pengulangan berjalan …" },
          { kind: "ok", text: "Putaran ke-120: total = 600000 → kondisi terpenuhi → berhenti" },
          { kind: "ok", text: "OUTPUT hari → 120 ✓" },
          { kind: "info", text: "Uji lagi: target = 602500 → berhenti di total = 605000 → hari = 121 ✓ (putaran terakhir menutup kekurangan)" },
        ],
        outcome: {
          title: "Selalu benar",
          desc: "Pengulangan menirukan proses nabung yang sebenarnya. Untuk target 600.000 hasilnya 120 hari — dan untuk target apa pun tetap benar.",
        },
        feedback: {
          right: "Kondisi ≥ menutup kekurangan di putaran terakhir; algoritma tetap benar untuk target apa pun.",
          wrong: "Tidak ada.",
          why: "Algoritma yang baik tetap benar untuk masalah serupa — bukan hanya satu kasus. Dengan REPEAT, proses menabung ditirukan apa adanya: setiap hari menambah 5000 hingga target tercapai.",
          correctIs: "—",
        },
      },
      {
        id: "B",
        verdict: "suboptimal",
        pseudo: ["hari ← 600000 / 5000", "OUTPUT hari"],
        log: [
          { kind: "step", text: "hari ← 600000 / 5000" },
          { kind: "ok", text: "OUTPUT hari → 120 ✓ (untuk target ini)" },
          { kind: "info", text: "Uji lagi: target = 602500 → hari ← 602500 / 5000 = 120.5" },
          { kind: "err", text: "OUTPUT → 120.5 hari. Orang tidak bisa menabung setengah hari — seharusnya 121." },
        ],
        outcome: {
          title: "Benar kebetulan",
          desc: "Untuk target Rp600.000 hasilnya tepat 120. Tetapi rumus ini hanya benar bila target kelipatan 5.000 — target 602.500 menghasilkan '120,5 hari' yang tidak bermakna.",
        },
        feedback: {
          right: "Untuk kasus 600.000, hasilnya benar dan bentuknya paling ringkas.",
          wrong: "Rumus rusak saat target bukan kelipatan 5000 — tidak ada penanganan kekurangan.",
          why: "Menguji dengan SATU kasus lalu langsung yakin adalah jebakan umum. Algoritma harus tetap benar untuk kemungkinan masukan lain — 'benar kebetulan' bukan kebenaran algoritma.",
          correctIs: "Pilihan A",
        },
      },
      {
        id: "C",
        verdict: "broken",
        pseudo: [
          "hari ← 0",
          "total ← 0",
          "REPEAT UNTIL total > target",
          "  total ← total + 5000",
          "  hari ← hari + 1",
          "END REPEAT",
          "OUTPUT hari",
        ],
        log: [
          { kind: "info", text: "Uji: target = 600000" },
          { kind: "ok", text: "Putaran ke-120: total = 600000" },
          { kind: "step", text: "Cek kondisi: apakah 600000 > 600000? TIDAK → pengulangan berlanjut" },
          { kind: "ok", text: "Putaran ke-121: total = 605000 → kondisi terpenuhi → berhenti" },
          { kind: "err", text: "OUTPUT hari → 121 ✗ (Raka sebenarnya sudah cukup menabung di hari ke-120)" },
        ],
        outcome: {
          title: "Lebih satu hari",
          desc: "Tanda > membuat pengulangan 'tidak percaya' target yang sudah tercapai pas — hari ke-121 terhitung padahal totalnya lebih dari cukup.",
        },
        feedback: {
          right: "Struktur pengulangan lengkap dan berhenti.",
          wrong: "Kondisi UNTIL total > target meleset satu batas: total yang pas dengan target dianggap belum cukup.",
          why: "Batas kondisi pengulangan harus sesuai maknanya: 'cukup' berarti ≥, bukan >. Satu tanda perbandingan mengubah hasil akhir.",
          correctIs: "Pilihan A",
        },
      },
    ],
    reasonPrompt: "Alasan apa yang paling mewakili pilihanmu?",
    reasons: [
      {
        id: "r1",
        text: "Algoritma yang baik tetap benar untuk target berapa pun, bukan hanya kelipatan 5000.",
        sound: true,
        note: "Benar — itulah ukuran kebenaran algoritma yang sejati.",
      },
      {
        id: "r2",
        text: "Kalau hasil untuk 600000 sudah benar, algoritmanya sudah terbukti.",
        sound: false,
        note: "Dua algoritma lain lolos di 600000 tapi gagal di target lain. Satu kasus bukan bukti.",
      },
      {
        id: "r3",
        text: "'Cukup' berarti ≥ — total yang pas dengan target tidak boleh dianggap kurang.",
        sound: true,
        note: "Benar — batas kondisi menentukan hasil.",
      },
    ],
    conceptTags: ["Uji dengan banyak kasus", "Batas kondisi UNTIL", "Generalisasi algoritma"],
    pembahasan:
      "Kartu penutup: ketiga algoritma menghasilkan 120 untuk target Rp600.000 — tetapi hanya A yang benar untuk target apa pun. B rapuh karena rumus langsung tanpa penanganan kekurangan; C meleset karena batas kondisi > alih-alih ≥. Pelajaran terbesar level ini: kebenaran algoritma diukur pada SELURUH kemungkinan masukan, bukan pada satu contoh yang berhasil.",
  },
];

// ------------------------------------------------------------
// ALGORITHM LAB — halaman 5
// ------------------------------------------------------------
export interface LabTask {
  id: string;
  title: string;
  subtitle: string;
  mode: "steps" | "pseudocode";
  scenario: string;
  defs: Record<string, BlockDef>;
  correctOrder: string[];
  shuffled: string[];
  tests?: { label: string; input: string; expected: string[] }[];
}

export const LAB_TASKS: LabTask[] = [
  {
    id: "lab1",
    title: "Task 1 — Menyalakan Komputer Lab",
    subtitle: "Susun langkah natural: urutkan agar komputer siap dipakai.",
    mode: "steps",
    scenario:
      "Kamu masuk paling pagi ke lab komputer. Semua mesin mati. Susun urutan langkah menyalakan komputer sampai aplikasi tugas terbuka. Perhatikan: langkah yang saling bergantung tidak boleh ditukar.",
    defs: {
      s1: { id: "s1", text: "Pastikan kabel power tercolok ke stopkontak", requires: [], run: "Listrik tersambung." },
      s2: { id: "s2", text: "Tekan tombol power pada CPU", requires: ["s1"], run: "CPU menyala — indikator hijau." },
      s3: { id: "s3", text: "Tekan tombol power pada monitor", requires: ["s1"], run: "Monitor menyala." },
      s4: { id: "s4", text: "Login dengan akun sekolah", requires: ["s2", "s3"], run: "Desktop siap digunakan." },
      s5: { id: "s5", text: "Buka aplikasi tugas yang dijadwalkan", requires: ["s4"], run: "Aplikasi terbuka — tugas bisa dikerjakan." },
    },
    correctOrder: ["s1", "s2", "s3", "s4", "s5"],
    shuffled: ["s4", "s2", "s5", "s1", "s3"],
  },
  {
    id: "lab2",
    title: "Task 2 — Cek Saldo Kartu Kantin",
    subtitle: "Susun notasi pseudocode dengan IF/ELSE lengkap.",
    mode: "pseudocode",
    scenario:
      "Kantin digital mengecek saldo kartu sebelum transaksi: saldo minimal Rp5.000 boleh makan, di bawah itu diminta top up. Rakit notasi pseudocode-nya dari blok yang tersedia, lalu UJI dengan dua nilai saldo berbeda.",
    defs: {
      b1: { id: "b1", text: "MULAI", requires: [] },
      b2: { id: "b2", text: "INPUT saldo", requires: ["b1"] },
      b3: { id: "b3", text: "IF saldo ≥ 5000 THEN", requires: ["b2"] },
      b4: { id: "b4", text: 'DISPLAY "Saldo cukup, silakan makan"', requires: ["b3"], before: ["b5"] },
      b5: { id: "b5", text: "ELSE", requires: ["b3", "b4"] },
      b6: { id: "b6", text: 'DISPLAY "Saldo kurang, lakukan top up"', requires: ["b5"], before: ["b7"] },
      b7: { id: "b7", text: "SELESAI", requires: ["b5", "b6"] },
    },
    correctOrder: ["b1", "b2", "b3", "b4", "b5", "b6", "b7"],
    shuffled: ["b4", "b7", "b2", "b5", "b1", "b6", "b3"],
    tests: [
      { label: "Uji 1", input: "saldo = 7000", expected: ["Saldo cukup, silakan makan"] },
      { label: "Uji 2", input: "saldo = 4000", expected: ["Saldo kurang, lakukan top up"] },
    ],
  },
];

// ------------------------------------------------------------
// FINAL CHALLENGE — halaman 6
// ------------------------------------------------------------
export const FINAL_MISSION = {
  title: "Misi Terakhir: Mesin Air Mineral Cerdas",
  scenario:
    "Kantin sekolah memasang mesin air mineral. Harganya Rp3.000. Mesin menerima uang dari pengguna: jika uangnya cukup, mesin memberi air dan menampilkan kembalian; jika kurang, mesin menampilkan kekurangan uang. Tidak ada algoritma lengkap yang diberikan — rakit sendiri solusi algoritmikmu dari blok yang tersedia. Awas: ada blok pengecoh yang tidak dibutuhkan!",
  mission:
    "Rakit algoritma lengkap sehingga mesin benar untuk dua kasus: uang Rp5.000 (kasus cukup) dan uang Rp2.000 (kasus kurang).",
  defs: {
    f1: { id: "f1", text: "MULAI", requires: [] },
    f2: { id: "f2", text: "INPUT uang", requires: ["f1"] },
    f3: { id: "f3", text: "harga ← 3000", requires: ["f1"] },
    f4: { id: "f4", text: "IF uang ≥ harga THEN", requires: ["f2", "f3"] },
    f5: { id: "f5", text: "kembalian ← uang − harga", requires: ["f4"], before: ["f8"] },
    f6: { id: "f6", text: 'DISPLAY "Silakan ambil air mineral Anda"', requires: ["f4"], before: ["f8"] },
    f7: { id: "f7", text: 'DISPLAY "Kembalian: Rp", kembalian', requires: ["f5"], before: ["f8"] },
    f8: { id: "f8", text: "ELSE", requires: ["f4", "f5", "f6", "f7"] },
    f9: { id: "f9", text: "kekurangan ← harga − uang", requires: ["f8"], before: ["f11"] },
    f10: { id: "f10", text: 'DISPLAY "Uang kurang Rp", kekurangan', requires: ["f9"], before: ["f11"] },
    f11: { id: "f11", text: "SELESAI", requires: ["f8", "f9", "f10"] },
    d1: { id: "d1", text: 'DISPLAY "Login berhasil"', kind: "distractor" as const },
    d2: { id: "d2", text: "INPUT password", kind: "distractor" as const },
    d3: { id: "d3", text: "total ← total + pengeluaran", kind: "distractor" as const },
    d4: { id: "d4", text: "REPEAT 3 KALI", kind: "distractor" as const },
  } as Record<string, BlockDef>,
  correctOrder: ["f1", "f2", "f3", "f4", "f5", "f6", "f7", "f8", "f9", "f10", "f11"],
  shuffled: ["f6", "d1", "f2", "f9", "f11", "f4", "d3", "f7", "f1", "f10", "d2", "f3", "f5", "d4", "f8"],
  tests: [
    {
      label: "Uji Kasus 1",
      input: "uang = 5000 (cukup)",
      expected: ["Silakan ambil air mineral Anda", "Kembalian: Rp 2000"],
    },
    {
      label: "Uji Kasus 2",
      input: "uang = 2000 (kurang)",
      expected: ["Uang kurang Rp 1000"],
    },
  ],
  pembahasan:
    "Solusi mesin air mineral menggabungkan seluruh materi X.AP.1: INPUT menerima data (uang), ← menyimpan nilai (harga, kembalian, kekurangan), IF/ELSE memilih dua jalur sesuai kondisi, dan DISPLAY menampilkan hasil yang benar di cabang yang tepat. Urutan kuncinya: data masuk dulu (INPUT uang, harga ← 3000), baru kondisi diperiksa, isi cabang dituliskan sebelum ELSE, dan penanganan kasus 'kurang' berada di ELSE. Blok pengecoh (login, password, pengeluaran, pengulangan) tidak berhubungan dengan masalah ini.",
  consoleTitle: "UJI MISI — MESIN AIR MINERAL",
  successText: "Algoritma mesin air mineralmu bekerja sempurna.",
};

