DOKUMEN BASELINE PENGEMBANGAN PROYEK BOLAID
Versi: 1.0 (Audit Fase Transisi Prototype ke Platform Terpadu)

Status Target: Standar Arsitektur Produksi & Keamanan Data Pembinaan Usia Dini

1. Ringkasan Eksekutif & Kondisi Codebase Saat Ini
Proyek ini dibangun di atas arsitektur modern TanStack Start v1 (React 19, SSR-ready, Vite 7, Tailwind CSS v4) dengan backend Lovable Cloud (PostgreSQL + RLS + Auth).
Saat ini aplikasi berada pada fase transisi hibrida:
Komponen Terverifikasi & Terintegrasi Database (Production-Ready Slice):

Autentikasi Cloud & Profil: Pengguna dapat mendaftar/login melalui Email/Password, Google, dan Lovable Auth (/auth, /account).


Check-in Pertandingan QR Passport (/organizer/checkin): Sistem check-in berbasis security-definer function (check_in_player), validasi hak akses panitia (has_role), token QR acak (BOLAID:P:<token>), verifikasi roster tim, dan pencegahan duplikasi kehadiran.


Absensi Latihan SSB QR Passport (/ssb/attendance): Terhubung ke tabel training_sessions dan training_attendance dengan validasi kepesertaan tim dan pencegahan absen ganda.


Prinsip Privasi Passport QR: Kode QR hanya membawa token kriptografis acak tanpa memuat data pribadi anak (PII) secara langsung di dalam gambar QR.


Unit Tests: 9 tes otomatis di src/test/ lulus penuh (routing, role navigation, validasi passport, pencegahan duplikasi, proteksi role).









Komponen Mock/Prototipe (17 Route Masih Menggunakan src/lib/mock-data.ts):





Roster & Keuangan SSB (/ssb, /ssb/roster, /ssb/finance).


Penilaian Pelatih & Radar Chart (/coach, /coach/assessment, /coach/report).


Portal Orang Tua & Consent Wali (/parent, /parent/consent).


Portal Wasit, Jadwal, & Hasil Turnamen (/referee, /tournament, /organizer/draw, /organizer/results).


Portal Scouting (/scout, /scout/watchlist).










2. Analisis Kesenjangan (Gap Analysis)


Area	Status Saat Ini	Kesenjangan (Gap) Utama	Tingkat Risiko
1. Dual Architecture (Mock vs DB)	Check-in & Absensi sudah DB-backed; 17 route lainnya masih membaca mock-data.ts.	Pengguna yang melakukan login belum melihat data operasional yang tersimpan untuk dirinya di halaman SSB, Coach, atau Parent.	Tinggi (Inkonsistensi UX)
2. Role & Hak Akses (RBAC)	Role panitia diverifikasi di DB melalui public.user_roles, namun role navigasi utama (RoleContext) masih berupa switcher lokal berbasis localStorage.	Pengguna bisa berpindah tampilan role di UI, namun belum terikat secara permanen pada organisasi (SSB) atau peran riil akun di backend.	Tinggi (Kontrol Akses)
3. Privasi Data Anak & Consent	Halaman /parent/consent hanya menyimpan persetujuan di local state React (useState). Halaman /scout memfilter persetujuan anak di sisi browser.	Jika data anak asli dimasukkan, data tersebut terekspos ke browser sebelum filter dilakukan. Dibutuhkan tabel consents dan query server yang menyaring data sebelum dikirim ke client.	Kritis (Kepatuhan Regulasi Perlindungan Anak)
4. Multi-Tenancy SSB & Klub	Tabel training_sessions saat ini masih menggunakan placeholder ID tim sementara (00000000-...).	Belum ada entitas organizations (Klub/SSB) dan tabel relasi keanggotaan staf/pemain. SSB A masih berpotensi melihat data SSB B jika tidak ada isolasi tenant.	Tinggi (Isolasi Data)
5. AI Player Development	Library @lovable.dev/ai-gateway sudah terpasang, namun belum ada endpoint server function untuk mengeksekusi prompt analisis data latihan/asesmen.	Fitur rekomendasi perkembangan pemain belum bisa dinikmati oleh pelatih.	Sedang (Fitur Tertunda)
6. Modul Keuangan & Pembayaran	Halaman /payments dan /ssb/finance hanya memunculkan toast simulasi.	Belum ada skema invoice, riwayat transaksi, dan rekonsiliasi pembayaran iuran atau pendaftaran turnamen.	Sedang (Kesiapan Finansial)




3. Rencana Pengembangan Bertahap (Development Roadmap)



Berikut adalah urutan pengembangan bertahap yang direkomendasikan agar platform dapat bertransformasi secara stabil tanpa merusak fitur QR yang sudah aktif:



+-----------------------------------------------------------------------------------+
| FASE 1: Fondasi Entitas & Multi-Tenancy (Organisasi, SSB, & Sinkronisasi Role)    |
| - Tabel organizations & memberships                                               |
| - Sinkronisasi user_roles dengan profil akun login                                |
+-----------------------------------------+-----------------------------------------+
                                          |
+-----------------------------------------v-----------------------------------------+
| FASE 2: Modul Pemain, Wali, & Consent Server-Side (Child Safety Baseline)         |
| - Relasi resmi Akun Orang Tua -> Pemain (Child Identity)                          |
| - Tabel consents berbasis DB (izin kompetisi, medis, dan scouting)                |
| - Penyaringan server-side untuk direktori Talent Scouting                         |
+-----------------------------------------+-----------------------------------------+
                                          |
+-----------------------------------------v-----------------------------------------+
| FASE 3: Modul Operasional SSB & Asesmen Pelatih (SSB Ops + AI Gateway)            |
| - Persistensi roster pemain SSB & riwayat latihan resmi                           |
| - Formulir asesmen performa pelatih (teknik, fisik, taktik, mental)               |
| - AI Gateway: Generator Individual Development Plan (IDP) otomatis                |
+-----------------------------------------+-----------------------------------------+
                                          |
+-----------------------------------------v-----------------------------------------+
| FASE 4: Ekosistem Kompetisi & Integrasi Laga Penuh                                |
| - Manajemen pendaftaran turnamen, grup, dan bagan drawing                         |
| - Laporan wasit digital (kartu, pencetak gol) terhubung ke profil pemain          |
+-----------------------------------------------------------------------------------+



Rincian Pelaksanaan Per Fase


Fase 1: Fondasi Entitas, Organisasi & Multi-Tenancy (Prioritas 1)




Tujuan: Menjadikan akun login terikat pada SSB atau organisasi riil dengan role yang jelas.


Pekerjaan Database:



Tambahkan tabel public.organizations (id, name, slug, logo_url, category: SSB / Asosiasi / Event Organizer).


Tambahkan tabel public.organization_members (user_id, organization_id, role: coach, admin, staff).






Integrasi UI:



Ubah RoleProvider agar mengambil role aktif dari public.user_roles dan organization_members akun yang sedang login, dengan fallback mode demonstrasi jika belum login.








Fase 2: Identitas Pemain & Consent Orang Tua (Prioritas 2)




Tujuan: Menjamin kepatuhan penuh terhadap data privasi anak usia dini.


Pekerjaan Database:



Relasikan public.players dengan guardian_id (merujuk ke public.profiles).


Tambahkan tabel public.player_consents (player_id, purpose, granted, updated_at).






Integrasi UI:



Hubungkan /parent/consent untuk membaca dan memperbarui izin ke database.


Perbarui /scout: ubah pencarian scout agar mengambil data dari server endpoint yang hanya mereturn data anak dengan status consent_scout = true dan identitas kontak orang tua yang terlindungi.








Fase 3: Roster SSB, Asesmen & AI Development Plan (Prioritas 3)




Tujuan: Mengaktifkan nilai tambah utama bagi pelatih SSB.


Pekerjaan Database & Backend:



Tambahkan tabel public.player_assessments (player_id, coach_id, technical, tactical, physical, mental, notes, created_at).


Buat server function TanStack Start (createServerFn) yang memanggil Lovable AI Gateway untuk menyusun rekomendasi latihan terarah berdasarkan riwayat absensi dan skor penilaian.






Integrasi UI:



Hubungkan form di /coach/assessment ke database.


Tampilkan ringkasan rencana perkembangan pemain berbasis AI langsung di kartu profil pemain (/player).








Fase 4: Turnamen Lengkap & Laporan Pertandingan (Prioritas 4)




Tujuan: Menghubungkan check-in laga dengan hasil pertandingan dan statistik pemain.


Pekerjaan:



Buat tabel tournament_matches dan referee_reports.


Integrasikan check-in QR di /organizer/checkin agar pemain yang tercentang otomatis menjadi daftar susunan pemain (DSP) sah yang dapat dipilih wasit saat memasukkan laporan pertandingan di /referee/report.










4. Rekomendasi Langkah Selanjutnya



Untuk memulai implementasi secara terukur, ada dua opsi langkah yang bisa kita prioritaskan:





Opsi A (Fokus Operasional SSB & Pelatih): Menghubungkan Roster Pemain SSB, formulir penilaian pelatih, dan pembuatan rencana latihan berbasis AI Gateway.


Opsi B (Fokus Struktur Organisasi & Akun): Mengonfigurasi tabel organisasi (SSB) dan penetapan email akun panitia/pelatih pertama Anda ke dalam sistem role database.





Langkah mana yang ingin kita jadikan prioritas pertama untuk diimplementasikan?