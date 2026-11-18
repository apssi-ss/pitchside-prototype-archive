Berikut adalah analisis mendalam terhadap codebase saat ini serta peta perencanaan pengembangan Modul Orang Tua (Parent Portal), termasuk integrasi Raport Pemain (hasil penilaian pelatih) dan Player Journey.





1. Analisis Kondisi Codebase Saat Ini


A. Apa yang Sudah Tersedia di Backend & Database




Tabel player_assessments (Sudah Persisten & RLS):

Menyimpan 18 indikator penilaian kurikulum Filanesia dalam 5 aspek utama:



Teknik: Kontrol bola, passing, receiving, dribbling, shooting.


Taktik: Positioning, pengambilan keputusan, awareness.


Fisik: Kecepatan, kelincahan, koordinasi.


Mental: Disiplin, kerja sama, percaya diri, mau dilatih.


Sosial: Respek, fair play, komunikasi.

Tersimpan dengan skor (1.0–10.0), rata-rata, catatan pelatih, dan periode (misal: Q4 2026).






Tabel development_plans (Sudah Terintegrasi AI Gateway):

Menyimpan rencana perkembangan hasil analisis AI yang sudah menyertakan kolom khusus:



summary: Ringkasan progres anak.


focus_areas & weekly_plan: Rencana latihan fokus 8 minggu.


parent_note: Catatan khusus positif untuk orang tua serta 1–2 aktivitas latihan ringan yang bisa dilakukan di rumah.






Tabel training_attendance & match_checkins:

Menyimpan rekap kehadiran latihan riil dan riwayat pertandingan anak via QR Passport.




B. Kondisi Modul Orang Tua Saat Ini (/parent & /player)




Dashboard Orang Tua (/parent): Masih menggunakan data mock (children, parentMessages, auditTrail). Skor perkembangan (7.7) dan grafik tren masih nilai statis, belum mengambil hasil penilaian riil dari tabel player_assessments.


Football Passport & Journey (/player): Menampilkan timeline mock (journey), radar chart visual, dan rekap statistik, namun belum diikat dengan ID pemain riil anak dari akun orang tua yang login.


Ketiadaan Relasi Akun Orang Tua - Anak di DB: Belum ada tabel penghubung antara auth.users (wali/orang tua) dengan players (anak), sehingga saat ini sistem belum tahu siapa anak dari akun yang sedang login.






2. Konsep Raport Pemain & Player Journey untuk Orang Tua


A. Raport Pemain Digital (E-Report Card)



Raport ini bukan sekadar angka atau rapor kelulusan konvensional, melainkan laporan tumbuh kembang atlet muda yang edukatif:





Radar Kemampuan 5 Pilar Filanesia: Visualisasi grafik radar (Teknik, Taktik, Fisik, Mental, Sosial) per kuartal.


Nilai & Perkembangan Tren: Membandingkan kuartal aktif dengan kuartal sebelumnya (misal: Teknik naik +0.5, Disiplin stabil di 8.5).


Catatan Pelatih Kepala (Coach Feedback): Evaluasi kualitatif langsung dari pelatih tim anak.


Pesan & Panduan Orang Tua dari AI (parent_note): Rekomendasi aktivitas edukatif yang dapat didukung orang tua di rumah (misal: pola istirahat, nutrisi, atau juggling bola santai di halaman).


Ekspor / Unduh PDF: Opsi bagi orang tua untuk mengunduh Raport Kuartalan resmi berlogo SSB & APSSI.




B. Player Journey (Jejak Karier & Prestasi Anak)



Timeline kronologis perjalanan sepak bola anak yang abadi:





Milestone SSB: Tanggal bergabung, kenaikan kelompok usia (U-8 
→
→ U-10 
→
→ U-12), dan posisi utama.


Riwayat Turnamen & Jam Terbang (Caps): Daftar kompetisi resmi yang diikuti (misal: Makassar Youth Cup 2026), menit bermain, dan gol/assist.


Rekap Kedisiplinan Latihan: Persentase absensi bulanan dari scan QR Passport.


Sertifikat & Penghargaan Digital: Piagam penghargaan pemain, juara turnamen, atau apresiasi bulanan.






3. Peta Arah Perencanaan Pengembangan (Roadmap Modul Orang Tua)


┌─────────────────────────────────────────────────────────────────────────┐
│                 ROADMAP PENGEMBANGAN MODUL ORANG TUA                    │
├──────────────────┬──────────────────┬──────────────────┬────────────────┤
│      FASE 1      │      FASE 2      │      FASE 3      │     FASE 4     │
│ Relasi Data Wali │  Raport Pemain   │  Player Journey  │ Notifikasi &   │
│   & Anak di DB   │  Hasil Evaluasi  │ & Passport Terpadu Tagihan Iuran  │
├──────────────────┼──────────────────┼──────────────────┼────────────────┤
│• Tabel relasi    │• Halaman Raport  │• Timeline jejak  │• Tagihan iuran │
│  wali-anak       │  anak di /parent │  karier & caps   │  SPP bulanan   │
│• Kode verifikasi │• Visual radar 5  │• Integrasi scan  │• Konfirmasi &  │
│  klaim anak      │  dimensi (real)  │  laga & turnamen │  bukti bayar   │
│• Switcher profil │• Catatan pelatih │• Arsip sertifikat│• Pengingat WA/ │
│  multi-anak      │  & AI parent_note│  digital         │  jadwal H-1    │
└──────────────────┴──────────────────┴──────────────────┴────────────────┘



Fase 1: Fondasi Relasi Wali & Anak di Database




Tabel player_guardians: Menghubungkan guardian_user_id (orang tua) dengan player_id (anak), disertai status verifikasi wali.


Mekanisme Klaim Anak: Orang tua dapat menautkan akun anaknya dengan memasukkan Football ID resmi anak (misal: IDN-FB-2016-000123) atau melalui nomor kontak terdaftar.


Multi-Child Switcher: Orang tua yang memiliki lebih dari satu anak di SSB dapat berpindah profil anak dengan satu ketukan di dashboard.




Fase 2: Implementasi Raport Pemain di Dashboard Orang Tua




Integrasi Query Real: Mengambil data langsung dari tabel player_assessments berdasarkan player_id anak.


Komponen Raport Interaktif:



Grafik perbandingan kuartal (Q1 vs Q2 vs Q3 vs Q4).


Skor rata-rata dan breakdown 18 indikator Filanesia.


Kartu khusus "Saran untuk Orang Tua" yang diambil dari development_plans.plan.parent_note.






Status Publikasi Raport: Fitur bagi pelatih untuk menandai penilaian sebagai "Draf" atau "Terkirim ke Orang Tua".




Fase 3: Integrasi Player Journey & Riwayat Bertanding




Penyatuan Halaman Passport (/player) ke Tampilan Wali: Mengalirkan data Football Passport langsung dari data asli pemain.


Riwayat Pertandingan Real: Menggabungkan tabel matches dan match_checkins sehingga orang tua dapat melihat seluruh laga yang telah dijalani anak.


Log Kehadiran: Menampilkan riwayat absensi latihan (training_attendance) lengkap dengan tanggal dan materi latihan.




Fase 4: Tagihan Iuran, Notifikasi & Privasi




Tagihan Riil SSB: Menghubungkan tagihan SPP dari modul Admin SSB ke kartu tagihan di /parent dan /payments.


Manajemen Consent: Pengaturan privasi scouting yang terhubung dengan hak akses pemandu bakat (scout).






Rekomendasi Tahap Awal untuk Dikerjakan




Langkah 1 (Data & UI Raport): Membuat halaman/komponen Raport Pemain di modul orang tua yang menampilkan data dari player_assessments (5 dimensi Filanesia, catatan pelatih, dan saran AI di rumah).


Langkah 2 (Player Journey): Menyusun timeline Player Journey dinamis yang merangkum riwayat SSB, absensi latihan, dan riwayat match check-in anak.





Apakah Anda ingin kita mulai menyusun implementasi Raport Pemain dan Player Journey ini ke dalam aplikasi? Sampaikan bagian yang ingin diprioritaskan, dan kita dapat beralih ke Build mode.