Berdasarkan audit mendalam pada codebase saat ini, berikut adalah hasil analisis kondisi modul SSB / Admin SSB beserta peta arah pengembangannya (roadmap):





1. Analisis Status Codebase Saat Ini



Aplikasi saat ini beroperasi dalam model hibrida (sebagian sudah terhubung ke database Supabase dengan RLS dan AI, sebagian masih berupa UI prototipe dengan data mock).



Area Fitur	Status Saat Ini	Detail Teknis & Sumber Data
Roster Pemain (/ssb/roster)	Persisten (DB)	Menggunakan tabel players & RPC register_player. Menghasilkan Football ID resmi otomatis.
Absensi QR Latihan (/ssb/attendance)	Persisten (DB)	Menggunakan tabel training_sessions & training_attendance. Scanner kamera & validasi Football Passport sudah bekerja.
Dashboard Utama SSB (/ssb)	Mock	Masih membaca stat statis dari ssb, teams, dan roster di src/lib/mock-data.ts. Belum membaca data agregat real dari DB.
Jadwal Latihan SSB (/ssb/training)	Mock	Masih menggunakan state lokal React dan array sessions dari mock-data; belum tersambung ke tabel training_sessions.
Keuangan SSB (/ssb/finance)	Mock	Menggunakan variabel ssbFinance. Tombol ingatkan bayar hanya memicu toast notifikasi simulasi, belum ada tabel tagihan/pembayaran.
Role & Multi-Tenancy	Belum Multi-Tenant	Belum ada tabel ssbs atau organizations. Role di database baru memiliki admin, coach, dan organizer. Semua pemain berada dalam satu tabel global tanpa isolasi per klub.




2. Gap Arsitektur yang Perlu Dibangun




Belum Ada Entitas Multi-Tenant SSB (ssbs / clubs)

Saat ini pemain baru memiliki kolom team (string seperti "U10"). Belum ada relasi ke ID SSB tertentu. Jika ada 2 SSB berbeda, pelatih atau admin saat ini masih melihat daftar pemain yang sama.


Ketiadaan Role Resmi ssb_admin di Database

Di navigasi UI (src/lib/roles.tsx), role Admin SSB sudah ada sebagai persona, tetapi di level izin database (user_roles), hak akses baru memeriksa coach atau organizer.


Pemisahan Modul Latihan vs Absensi QR

/ssb/training (daftar sesi latihan) dan /ssb/attendance (pemindai QR) saat ini berjalan terpisah dan belum terintegrasi ke dalam satu alur kerja terpadu.


Modul Keuangan Belum Terhubung dengan Orang Tua

Data tagihan di dashboard orang tua (/parent dan /payments) belum terhubung dengan rekapitulasi iuran di /ssb/finance.






3. Peta Arah Pengembangan Modul SSB / Admin SSB


┌─────────────────────────────────────────────────────────────────────────┐
│                 PETA PENGEMBANGAN MODUL ADMIN SSB                       │
├──────────────────┬──────────────────┬──────────────────┬────────────────┤
│      FASE 1      │      FASE 2      │      FASE 3      │     FASE 4     │
│ Fondasi Entitas  │   Operasional    │  Modul Keuangan  │ Integrasi      │
│  & Multi-Tenant  │  Harian & Tim    │  & Billing SPP   │ Ekosistem Luar │
├──────────────────┼──────────────────┼──────────────────┼────────────────┤
│• Tabel `ssbs`    │• Dashboard real  │• Skema tagihan   │• Pendaftaran   │
│• Role `ssb_admin`│  (KPI pemain/tim)│  iuran bulanan   │  ke turnamen   │
│• Isolasi data RLS│• Manajemen tim   │• Status bayar    │• Match line-up │
│  antar-SSB       │  (kelompok usia) │  (lunas/telat)   │• Verifikasi ke │
│• Profil & legal  │• Sinkronisasi    │• Portal tagihan  │  asosiasi      │
│  SSB (APSSI)     │  sesi latihan    │  ke orang tua    │  (APSSI/PSSI)  │
└──────────────────┴──────────────────┴──────────────────┴────────────────┘



Fase 1: Fondasi Entitas & Multi-Tenancy (Prioritas Utama)




Tabel ssbs / organizations: Nama SSB, kota, nomor registrasi APSSI/PSSI, logo, kontak resmi.


Relasi Pengguna & Role: Penambahan role ssb_admin pada tabel user_roles dan penghubung ke ssb_id.


Isolasi RLS: Kebijakan keamanan agar Admin SSB A hanya dapat mengelola pemain, pelatih, tim, dan keuangan milik SSB A.




Fase 2: Operasional Harian SSB & Pengelompokan Tim




Dashboard Utama Dinamis (/ssb): Menampilkan metrik riil dari database (total pemain aktif, rasio kehadiran, jumlah tim terdaftar).


Manajemen Tim/Kelompok Usia: Membuat dan mengelompokkan kategori (U-8, U-10, U-12, U-15) serta menugaskan pelatih kepala ke tim terkait.


Penyatuan Manajemen Latihan (/ssb/training + /ssb/attendance): Admin/pelatih membuat jadwal latihan mingguan, dan kehadiran langsung dicatat baik melalui pemindaian QR Passport maupun checklist manual.




Fase 3: Modul Keuangan & Iuran Pemain (/ssb/finance)




Tabel Tagihan (ssb_invoices): Kategori iuran bulanan (SPP), uang registrasi, atau biaya jersey/turnamen.


Integrasi Dua Arah: Ketika Admin SSB menerbitkan iuran, tagihan langsung tampil pada menu Orang Tua (/parent & /payments).


Pencatatan Pembayaran: Tombol konfirmasi bayar / integrasi bukti bayar serta pengingat tagihan otomatis.




Fase 4: Integrasi Turnamen & Asosiasi




Pendaftaran Kontingen Turnamen: Admin SSB memilih kategori usia, mendaftarkan tim, dan menyusun roster pemain langsung dari database SSB ke turnamen yang diselenggarakan panitia.


Verifikasi Asosiasi (APSSI SULSEL): Sinkronisasi data legalitas SSB dan lisensi pelatih ke modul verifikasi asosiasi (/association/verification).






Langkah Berikutnya



Dari peta di atas, area mana yang ingin Anda prioritaskan untuk dimulai terlebih dahulu?





Fase 1 (Fondasi Multi-Tenant & Role Admin SSB): Menyiapkan tabel SSB, menghubungkan akun admin ke SSB, dan mengisolasi data pemain per klub.


Operasional Latihan & Dashboard (Fase 2): Menghubungkan dashboard /ssb dan halaman latihan /ssb/training dengan data real Supabase.


Modul Keuangan (Fase 3): Membangun pencatatan iuran dan penagihan ke orang tua pemain.





Jika Anda sudah siap untuk mulai mengimplementasikannya, sampaikan pilihan Anda dan kita bisa beralih ke Build mode.