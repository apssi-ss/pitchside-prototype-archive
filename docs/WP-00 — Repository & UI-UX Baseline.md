# APSSI – Bola ID
## WP-00 — Repository & UI/UX Baseline

**Status:** Audit awal selesai; verifikasi lokal dan persetujuan baseline masih diperlukan.  
**Repository:** `apssi-ss/pitchside-prototype-archive`  
**Branch:** `main`  
**Snapshot:** `a8ba5e0cda049fafcdd7225469d086e8f691aeac`

---

## 1. Keputusan produk

- Nama platform: **APSSI – Bola ID**.
- Identitas digital pemain: **Football ID**.
- Data prototype lama: dibuang, tidak dimigrasikan.
- Frontend: dipertahankan secara selektif setelah audit UI/UX.
- Backend: dibangun ulang pada proyek Supabase baru.
- IDE: VS Code.
- AI coding assistant: GitHub Copilot.
- Lovable: tidak lagi digunakan untuk memodifikasi repository.
- GitHub: sumber kebenaran source code.

## 2. Kondisi repository

Stack yang ditemukan:

- React 19 dan TypeScript.
- TanStack Start dan TanStack Router.
- Vite.
- Tailwind CSS 4.
- Radix UI dan komponen internal.
- TanStack Query.
- Supabase Auth dan PostgreSQL.
- Drizzle ORM dan Drizzle migrations.
- Zod dan React Hook Form.
- AI SDK dan Lovable AI Gateway.
- Vitest dan Testing Library.
- QR scanner menggunakan jsQR dan QR code generator.

Catatan:
1. `package.json` menggunakan script npm.
2. `bun.lock` dan `bunfig.toml` juga ada, sedangkan `package-lock.json` tidak ditemukan pada inspeksi sebelumnya.
3. Keputusan kerja sebelumnya adalah menggunakan npm. Jangan mengubah package manager atau lockfile tanpa rencana dan persetujuan.
4. Drizzle dan Supabase migration belum boleh berjalan sebagai dua sumber kebenaran. Rekomendasi arsitektur adalah Supabase CLI dan `supabase/migrations/` sebagai satu-satunya pemilik migration untuk backend baru.

## 3. UI/UX retention map

### Kandidat dipertahankan setelah verifikasi visual

| Domain | Kandidat UI |
|---|---|
| Public | Landing page, penjelasan ekosistem, pilihan peran |
| Player | Football ID, Passport, profil, perjalanan pemain |
| Parent | Dashboard anak, jadwal, tagihan, persetujuan |
| SSB | Dashboard, roster, tim, latihan, keuangan |
| Coach | Dashboard, penilaian, laporan perkembangan |
| Competition | Turnamen, jadwal, klasemen, hasil |
| Organizer | Pendaftaran, drawing, check-in, operasional |
| Referee | Penugasan, laporan pertandingan, profil |
| Scout | Pencarian pemain, watchlist, peluang |
| Association | Dashboard wilayah, verifikasi, statistik |

### Kriteria retensi

Sebuah layar atau komponen dapat dipertahankan jika:
- Alur pengguna masih sesuai dengan kebutuhan produk.
- Struktur visual dan hierarki informasi jelas.
- Responsif untuk desktop dan mobile.
- Komponen dapat dipisahkan dari backend lama.
- Tidak mengandung asumsi otorisasi yang tidak aman.
- Dapat menerima data dari API/backend baru.
- Memiliki state loading, empty, error, dan success yang layak.

Jangan melakukan redesign menyeluruh sebagai bagian dari integrasi backend. Perubahan visual harus memiliki alasan dan persetujuan tersendiri.

## 4. Feature maturity matrix

| Fitur | Kondisi awal | Arahan |
|---|---|---|
| Landing | Prototype | Pertahankan konsep, audit visual |
| Football ID / Passport | Parsial dan statis | Pertahankan konsep, bangun integrasi baru |
| Parent dashboard | Prototype | Audit alur dan state |
| Guardian consent | Mayoritas mock | Rancang ulang alur dan backend |
| Payments | Prototype | Integrasi pembayaran baru |
| Schedule | Prototype | Pertahankan konsep |
| Opportunities | Prototype | Rancang ulang data dan alur |
| SSB dashboard | Parsial | Audit dan integrasi ulang |
| Roster | Parsial | Rancang ulang domain membership |
| Training attendance | Parsial | Rancang ulang otorisasi dan persistence |
| Coach assessment | Parsial | Pertahankan kebutuhan fitur |
| AI development plan | Parsial | Bangun ulang server-side |
| Tournament operations | Prototype | Pertahankan kebutuhan operasional |
| Organizer check-in | Parsial, terhubung DB lama | Gunakan sebagai referensi perilaku |
| Referee | Prototype | Audit kebutuhan |
| Scout | Prototype | Audit izin dan privasi |
| Association | Prototype | Audit kebutuhan tata kelola |

## 5. Temuan teknis penting

### P0 — Security

- `.env` pernah terlacak di repository publik.
- `.gitignore` saat ini belum mengecualikan `.env`.
- Jangan mengambil atau menggunakan kembali nilai secret lama.
- Rotasi seluruh credential yang mungkin terpapar.
- Hapus `.env` dari tracking Git.
- Evaluasi pembersihan Git history setelah backup dan koordinasi.
- Buat `.env.example` yang hanya berisi nama variabel dan placeholder.

### P1 — Developer workflow

- `README.md` masih berorientasi Lovable.
- `AGENTS.md` masih mengandung aturan pengelolaan database dan AI khusus Lovable.
- `vite.config.ts` menggunakan paket konfigurasi Lovable.
- Dependensi Lovable harus dievaluasi sebelum diganti; jangan menghapus paket tanpa memeriksa fungsi yang masih digunakan.

### P1 — Backend legacy

- Supabase project ID lama berada dalam `supabase/config.toml`.
- Legacy auth, schema, RLS, RPC, dan integrasi bukan sumber kebenaran untuk backend baru.
- Ada potensi otorisasi berbasis role global yang tidak membatasi organisasi dan relasi resource.
- Ada ketidaksesuaian antara akses yang dijelaskan UI absensi latihan dan role yang diperiksa.
- Struktur pemain lama belum cukup untuk mendukung riwayat afiliasi multi-organisasi.

### P1 — Fixture dan demo state

- `src/lib/mock-data.ts` adalah fixture untuk layar prototype.
- `src/lib/roles.tsx` memiliki role switcher dan menyimpan pilihan role di localStorage.
- Penyimpanan pilihan role hanya boleh diperlakukan sebagai state tampilan, tidak pernah sebagai bukti hak akses.
- Data fixture tidak boleh dimasukkan ke database produksi.

## 6. Domain invariants untuk semua pekerjaan berikutnya

1. Football ID melekat pada pemain, bukan organisasi.
2. Pemain dapat memiliki beberapa afiliasi organisasi.
3. Afiliasi memiliki status dan riwayat.
4. Satu akun dapat memiliki lebih dari satu peran.
5. Hubungan wali dan pemain harus diverifikasi.
6. Persetujuan data anak harus memiliki tujuan, cakupan, dan status yang dapat dicabut.
7. Data anak dilindungi dengan default private.
8. Kompetisi dan perkembangan pemain harus dapat ditelusuri.
9. Hak akses mempertimbangkan role, membership, relasi resource, dan tujuan akses.
10. Frontend state tidak pernah menjadi sumber otorisasi.
11. Backend menggunakan prinsip default deny.
12. Integrasi AI dilakukan di server dan hanya mengirim data minimum yang diperlukan.

## 7. Knowledge base GitHub Copilot yang diusulkan

```text
.github/
  copilot-instructions.md
  instructions/
    frontend.instructions.md
    backend.instructions.md
    database.instructions.md
    security.instructions.md
    testing.instructions.md
  prompts/
    analyze-feature.prompt.md
    implement-feature.prompt.md
    fix-bug.prompt.md
    review-code.prompt.md
    database-change.prompt.md
    write-tests.prompt.md

docs/
  product/
  architecture/
    ADR/
  development/

AGENTS.md
```

Aturan wajib Copilot:

- Pahami business flow sebelum mengubah kode.
- Jangan mengarang requirement.
- Periksa domain model, migration, dan seluruh pemanggil sebelum mengubah schema.
- Jangan mengedit file generated secara manual.
- Jangan menggunakan localStorage sebagai sumber otorisasi.
- Jangan pernah mengekspos service-role key di browser.
- Jaga perubahan tetap fokus.
- Jangan melakukan refactor besar tanpa persetujuan.
- Perubahan business logic wajib disertai test.
- Perubahan data anak wajib mempertimbangkan consent, privasi, dan authorization.
- Sebelum implementasi, tampilkan analisis, rencana, file terdampak, dan risiko.
- Perubahan schema, security, dan architecture memerlukan persetujuan.
- Pertahankan UI/UX yang sudah disetujui.
- Perlakukan backend prototype sebagai referensi, bukan sumber kebenaran.
- Jangan menggunakan Lovable untuk memodifikasi repository.

## 8. Urutan pekerjaan WP-00

1. Verifikasi dan mitigasi risiko `.env`.
2. Audit seluruh route dan komponen frontend.
3. Buat screenshot baseline untuk desktop dan mobile.
4. Tandai fixture, mock state, dan integrasi backend lama.
5. Audit dependency dan konfigurasi build.
6. Rekonsiliasi `README.md` dan `AGENTS.md`.
7. Siapkan instruksi Copilot global dan scoped.
8. Siapkan prompt templates untuk analisis, implementasi, bug fixing, review, database, dan testing.
9. Jalankan install, lint, test, dan build pada lingkungan lokal.
10. Buat laporan baseline dan minta persetujuan sebelum WP-01.

## 9. Definition of Done WP-00

WP-00 dinyatakan selesai jika:

- [ ] Semua route dan halaman terinventarisasi.
- [ ] Semua layar memiliki status keep, revise, rebuild, atau retire.
- [ ] Screenshot desktop dan mobile tersedia.
- [ ] Semua mock data dan legacy integration teridentifikasi.
- [ ] Risiko `.env` telah ditangani dan diverifikasi.
- [ ] README dan AGENTS tidak lagi memberi instruksi operasional Lovable.
- [ ] Copilot instructions dan prompt templates tersedia.
- [ ] Hasil lint, test, dan build tercatat.
- [ ] Tidak ada perubahan UI besar tanpa persetujuan.
- [ ] Baseline disetujui pemilik produk.

## 10. Batasan audit saat ini

Dokumen ini berdasarkan inspeksi source code GitHub. Aplikasi belum dijalankan di mesin lokal, belum dilakukan screenshot browser, dan belum dilakukan verifikasi build/test. Oleh karena itu, kondisi visual, runtime, dan kualitas build masih harus diverifikasi.

Belum ada perubahan file, migration, atau database yang dilakukan dalam audit ini.
