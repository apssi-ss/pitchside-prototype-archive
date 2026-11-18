Berdasarkan audit mendalam pada codebase saat ini, berikut adalah hasil analisis kondisi Modul Pelatih (Coach Module) beserta peta rencana pengembangannya agar terintegrasi penuh ke dalam ekosistem aplikasi BolaID.





1. Analisis Codebase Modul Pelatih Saat Ini



Di dalam codebase, peran pelatih sudah memiliki fondasi backend yang solid (khususnya pada penilaian Filanesia dan AI), namun tampilan dashboard harian dan taktik masih menggunakan data mock statis:



Area Fitur Pelatih	Status Saat Ini	Detail Teknis & Sumber Data
Role & Akses Keamanan	Sudah Terintegrasi	Role coach tercatat di public.user_roles. Akses backend diamankan lewat RLS dan fungsi security is_coach.
Penilaian Pemain (/coach/assessment)	Sudah Terintegrasi	Formulir 18 indikator Filanesia (Teknik, Taktik, Fisik, Mental, Sosial), skala 1–10 (kelipatan 0.5), catatan kualitatif, dan riwayat periode tersimpan di tabel player_assessments.
Rencana Latihan AI (development_plans)	Sudah Terintegrasi	Dibuat melalui server function generateDevelopmentPlan dengan Lovable AI Gateway. Rencana 8 minggu disusun dengan privasi ketat (nama/ID/token disaring) berbasis skor dan absensi latihan.
Daftar Roster Pemain (/ssb/roster)	Sudah Terintegrasi	Pelatih dapat melihat seluruh pemain aktif di database, mencari, memfilter kategori, dan langsung menuju penilaian pemain.
Dashboard Pelatih (/coach)	Mock Data	Statistik jumlah pemain, sesi latihan hari ini, widget pertandingan berikutnya, dan peringatan kehadiran masih membaca dari src/lib/mock-data.ts.
Susunan Tim & Taktik (/coach_/teams)	Mock Data	Halaman masih berupa tampilan prototipe statis (RolePage) dengan formasi 2-3-1 dan daftar pemain contoh. Belum terhubung ke tabel players maupun line-up pertandingan.
Laporan Pertandingan (/coach_/report)	Mock Data	Rekap evaluasi pertandingan dan laporan kuartal masih berupa data contoh, belum terhubung ke tabel matches atau evaluasi pasca-laga.
Manajemen Sesi Latihan (training_sessions)	Parsial	Tabel dan fungsi absensi QR sudah ada di database, tetapi pelatih belum memiliki antarmuka formulir mandiri untuk membuat jadwal latihan baru.




2. Arsitektur Alur Kerja Pelatih yang Terintegrasi



Modul pelatih memegang peranan krusial sebagai penghubung operasional lapangan dengan pembinaan anak:



 ┌────────────────────────────────────────────────────────────────────────┐
 │                      MODUL PELATIH (COACH PORTAL)                      │
 │     Dashboard · Formasi & Taktik · Penilaian Filanesia · Evaluasi      │
 └───────▲───────────────────────────▲────────────────────────────▲───────┘
         │                           │                            │
 ┌───────┴───────────────┐   ┌───────┴───────────────┐   ┌────────┴───────────────┐
 │       OPERASIONAL     │   │      PEMBINAAN        │   │      PERTANDINGAN      │
 │ • Buat jadwal latihan │   │ • Nilai 18 indikator  │   │ • Pilih Starting Lineup│
 │   di training_sessions│   │   Filanesia           │   │   di match_roster      │
 │ • Pantau absensi QR   │   │ • Generate Rencana AI │   │ • Input catatan laga & │
 │   anak didik          │   │ • Terbit raport wali  │   │   evaluasi menit main  │
 └───────────────────────┘   └───────────────────────┘   └────────────────────────┘





3. Peta Rencana Pengembangan Modul Pelatih Terintegrasi



Pengembangan modul pelatih dipetakan ke dalam 4 fase terstruktur:



┌─────────────────────────────────────────────────────────────────────────┐
│                 PETA PENGEMBANGAN MODUL PELATIH TERPADU                 │
├──────────────────┬──────────────────┬──────────────────┬────────────────┤
│      FASE 1      │      FASE 2      │      FASE 3      │     FASE 4     │
│  Live Dashboard  │ Tim, Formasi &   │ Match Line-up &  │ Alur Raport &  │
│  & Sesi Latihan  │ Taktik Interaktif│ Laporan Laga     │ Sinkronisasi   │
├──────────────────┼──────────────────┼──────────────────┼────────────────┤
│• Query metrik DB │• Pilihan kategori│• Sinkronisasi ke │• Tombol terbit │
│  (pemain, sesi)  │  usia (U8-U14)   │  tabel `matches` │  raport periode│
│• Widget latihan  │• Formasi mini-   │• Atur starting   │• Tampil di     │
│  hari ini real   │  soccer/filanesia│  line-up resmi   │  `/parent` &   │
│• Form buat sesi  │• Tautkan pemain  │• Form evaluasi & │  radar chart   │
│  latihan baru    │  dari DB real    │  catatan laga    │  `/player`     │
└──────────────────┴──────────────────┴──────────────────┴────────────────┘



Fase 1: Live Coach Dashboard & Manajemen Sesi Latihan




Statistik Riil di /coach:



Mengambil jumlah pemain asuhan aktif langsung dari tabel players.


Menghitung jumlah pemain yang belum dinilai pada kuartal berjalan (player_assessments).


Menampilkan sesi latihan terdekat dari tabel training_sessions.






Formulir Jadwal Latihan:



Memungkinkan pelatih membuat sesi latihan baru (kategori usia, tanggal/jam, lapangan/venue, topik latihan/drill Filanesia).


Sesi yang dibuat langsung muncul di scanner absensi QR (/ssb/attendance).








Fase 2: Manajemen Tim, Formasi & Taktik (/coach/teams)




Papan Taktik & Formasi Dinamis:



Dukungan formasi kelompok usia pembinaan:



5 vs 5 / 7 vs 7 (U-8 s/d U-10): Formasi 2-3-1 atau 3-2-1.


9 vs 9 (U-12): Formasi 3-2-3 atau 3-3-2.


11 vs 11 (U-14 ke atas): Formasi 4-3-3 atau 3-5-2.










Penetapan Posisi Pemain:



Memilih pemain riil dari database ke dalam posisi starting line-up dan cadangan.


Peringatan otomatis jika pemain memiliki riwayat absensi rendah atau cedera.






Papan Instruksi & Catatan Taktik:



Catatan fokus sesi (misal: build-up dari kiper, pressing 5 detik pertama).








Fase 3: Integrasi Pertandingan & Laporan Pasca Laga (/coach/report)




Pendaftaran Line-up Pertandingan:



Memilih laga dari jadwal resmi di tabel matches.


Menetapkan skuad ke match_roster yang menjadi rujukan verifikasi check-in barcode panitia turnamen.






Laporan Pertandingan (Match Report):



Catatan evaluasi pelatih pasca-pertandingan (poin positif tim, aspek yang perlu diperbaiki).


Menit bermain pemain dan kontribusi gol/assist yang tercatat ke riwayat karier pemain.








Fase 4: Otomatisasi Distribusi Raport ke Orang Tua & Pemain




Siklus Raport Kuartalan (Q1–Q4):



Penilaian yang disimpan di /coach/assessment otomatis merangkum nilai rata-rata 5 pilar Filanesia.


Pelatih dapat meninjau rekap sebelum mempublikasikan rapor.






Terhubung Langsung ke Portal Lain:



Halaman Pemain (/player): Radar chart 5 pilar dan rekomendasi latihan AI otomatis terbarui.


Halaman Orang Tua (/parent): Rapor kemajuan anak, catatan khusus pelatih, serta tips pendampingan di rumah dapat dibaca langsung oleh wali.










Pilihan Prioritas untuk Dieksekusi



Jika ingin mulai mengimplementasikan rencana ini, ada 2 opsi prioritas yang dapat kita kerjakan terlebih dahulu:





Prioritas A (Dashboard Pelatih & Sesi Latihan Real):

Menghubungkan halaman /coach ke data database asli dan menambahkan fitur bagi pelatih untuk membuat jadwal latihan baru yang terhubung ke absensi QR.


Prioritas B (Formasi & Line-up Taktik Real):

Mengubah halaman /coach/teams agar dapat memilih pemain database nyata, menyusun formasi taktik, dan menyiapkan line-up pertandingan.





Sampaikan opsi yang ingin Anda prioritaskan, dan kita dapat beralih ke Build mode untuk mulai membangunnya.