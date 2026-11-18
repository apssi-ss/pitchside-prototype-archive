Berikut adalah hasil analisis mendalam terhadap Modul Pemain (Player Module) saat ini, serta peta perencanaan pengembangan agar modul pemain menjadi jangkar utama yang terintegrasi penuh dengan seluruh modul di dalam satu aplikasi BolaID.





1. Analisis Codebase Modul Pemain Saat Ini


A. Status Tampilan & Fungsionalitas Saat Ini



Halaman Pemain (/player) saat ini menyajikan 3 tab utama:





Football Passport (Kartu Identitas Digital): Menampilkan nama, foto inisial, posisi, kelompok usia, Football ID unik, status verifikasi wali, serta kode QR check-in (BOLAID:P:<token>).


Tab Journey: Menampilkan milestone perjalanan karier (SSB 
→
→ Turnamen 
→
→ Seleksi Regional 
→
→ Akademi).


Tab Perkembangan (Development): Menampilkan radar chart 5 pilar Filanesia (Teknik, Taktik, Fisik, Mental, Sosial), tren antarkuartal, dan catatan pelatih.


Tab Pertandingan (Matches): Menampilkan riwayat laga, menit bermain, kontribusi gol/assist, dan sertifikat juara.




B. Gap Integrasi dengan Database & Modul Lain



Meskipun tampilan antarmukanya sudah sangat baik, modul pemain di /player saat ini masih menggunakan data contoh statis (src/lib/mock-data.ts). Sementara itu, di backend database Supabase kita sudah memiliki data riil yang dihasilkan oleh modul lain:



                ┌────────────────────────────────────────────────────────┐
                │          MODUL PEMAIN (FOOTBALL PASSPORT)              │
                │        Pusat Identitas & Akumulasi Data Anak           │
                └──────────────────────────▲─────────────────────────────┘
                                           │
         ┌───────────────────┬─────────────┴───────────────┬────────────────────┐
         │                   │                             │                    │
┌────────┴────────┐ ┌────────┴─────────┐         ┌─────────┴─────────┐ ┌────────┴────────┐
│  ADMIN SSB      │ │  PELATIH (COACH) │         │  PANITIA TURNAMEN │ │  ORANG TUA / WALI   │
│• Registrasi     │ │• Penilaian skor  │         │• QR check-in laga │ │• Persetujuan izin   │
│  Football ID    │ │  18 indikator    │         │  otomatis         │  (consent scouting)   │
│• Roster tim &   │ │• AI Development  │         │• Line-up match    │ │• Iuran & kehadiran  │
│  sesi latihan   │ │  Plan 8 minggu   │         │• Caps & gol resmi │  latihan anak         │
└─────────────────┘ └──────────────────┘         └───────────────────┘ └─────────────────────┘





Belum Terhubung ke Tabel players Real: Halaman /player belum mengambil profil berdasarkan akun anak yang sedang aktif atau ID pemain yang dipilih.


Penilaian Pelatih Masih Terpisah: Hasil input skor di /coach/assessment (tabel player_assessments) belum mengalir langsung ke tab Perkembangan di /player.


Check-in Pertandingan Belum Terakumulasi Jadi "Caps": Check-in sukses di /organizer/checkin (tabel match_checkins) belum otomatis masuk ke riwayat statistik pertandingan pemain.


Absensi Latihan Belum Menjadi Metrik Kehadiran Real: Absensi QR di /ssb/attendance (tabel training_attendance) belum otomatis terhitung pada ringkasan kehadiran pemain di kartu Passport.






2. Peta Perencanaan Pengembangan Modul Pemain Terintegrasi



Untuk mewujudkan ekosistem satu aplikasi yang utuh, modul pemain dikembangkan dalam 4 fase:



┌─────────────────────────────────────────────────────────────────────────┐
│                 PETA PENGEMBANGAN MODUL PEMAIN TERPADU                  │
├──────────────────┬──────────────────┬──────────────────┬────────────────┤
│      FASE 1      │      FASE 2      │      FASE 3      │     FASE 4     │
│  Identitas & QR  │ Sinkronisasi     │ Akumulasi Match  │ Akses & Karir  │
│  Passport Real   │ Penilaian & AI   │ & Jam Terbang    │ Scouting/Trial │
├──────────────────┼──────────────────┼──────────────────┼────────────────┤
│• Query tabel     │• Hubungkan tabel │• Query otomatis  │• Portal profil │
│  `players`       │  `player_assess- │  `match_checkins`│  publik pemain │
│• QR dinamis dari │  ments` ke radar │  & `match_roster`│• Filter izin   │
│  `passport_token`│• Tampilkan AI    │• Timeline caps   │  wali (consent)│
│• Tautan ke akun  │  Development     │  resmi & riwayat │• Kartu trial & │
│  pemain / wali   │  Plan di tab Dev │  turnamen nyata  │  peluang seleksi│
└──────────────────┴──────────────────┴──────────────────┴────────────────┘



Fase 1: Integrasi Identitas Real & Dynamic Football Passport




Profil Pemain Dinamis: Mengganti data statis player dengan pembacaan langsung dari tabel players di database.


Dynamic Passport QR: QR Code menghasilkan token aman dari kolom passport_token pemain yang dapat dipindai oleh Panitia Turnamen (/organizer/checkin) dan Admin SSB (/ssb/attendance).


Penyatuan Multi-Profil: Jika diakses oleh pemain langsung, ia melihat profilnya; jika diakses oleh orang tua (/parent), orang tua dapat memilih anak mana yang ingin dibuka passport-nya.




Fase 2: Sinkronisasi Raport & Rencana AI Pelatih




Radar Chart Real-Time: Menghubungkan grafik radar 5 pilar (Teknik, Taktik, Fisik, Mental, Sosial) dengan rata-rata skor terbaru dari tabel player_assessments.


Riwayat Penilaian Berkala: Menampilkan perbandingan perkembangan anak dari kuartal ke kuartal (Q1 
→
→ Q2 
→
→ Q3 
→
→ Q4).


Rencana Pengembangan Mandiri (AI Plan): Menampilkan modul latihan mingguan (weekly plan) hasil racikan AI Gateway agar anak tahu menu latihan yang perlu diasah di rumah.




Fase 3: Integrasi Matchday, Caps, dan Player Journey Otomatis




Akumulasi Menit & Pertandingan (Caps): Setiap kali panitia melakukan scan QR check-in di hari pertandingan, statistik jumlah laga otomatis bertambah secara resmi.


Player Journey Kronologis Dinamis:



Riwayat bergabung dan kenaikan kelompok usia di SSB (misal: U-8 
→
→ U-10).


Riwayat turnamen resmi yang diikuti (diambil dari pendaftaran tim ke turnamen).


Jejak penghargaan & sertifikat digital pemain yang diterbitkan oleh panitia.






Kehadiran Latihan Real: Persentase absensi dihitung secara matematis dari jumlah sesi latihan tim yang dihadiri vs yang diselenggarakan.




Fase 4: Integrasi Peluang, Trial & Scouting




Izin Wali (Parental Consent Guard): Profil pemain hanya dapat dilihat oleh pemandu bakat (/scout) jika wali telah mengaktifkan toggle "Izinkan scouting" di /parent/consent.


Integrasi Menu Peluang (/opportunities): Pemain mendapatkan rekomendasi seleksi tim daerah (Asprov/Askot PSSI) atau trial akademi berdasarkan kelompok usia dan data performa yang terverifikasi.






3. Arsitektur Alur Data Terintegrasi (Data Flow)



Dalam satu aplikasi ini, alur data pemain bergerak tanpa sekat manual:





Admin SSB mendaftarkan anak via /ssb/roster 
→
→ Database membuat Football ID resmi dan Token Passport.


Pelatih memberikan penilaian rutin di /coach/assessment 
→
→ Radar perkembangan di halaman Pemain (/player) dan Raport di halaman Orang Tua (/parent) otomatis terisi.


Panitia Turnamen memindai QR anak di /organizer/checkin 
→
→ Data pertandingan terekam di tab Pertandingan & Journey pemain secara permanen.


Orang Tua memantau seluruh proses ini dari satu genggaman di /parent.






Langkah Konkret Berikutnya



Untuk mulai mewujudkan integrasi modul pemain ini ke dalam aplikasi, berikut 2 pilihan prioritas eksekusi:





Prioritas A (Integrasi Data Passport & Penilaian Pelatih): Menghubungkan halaman /player ke tabel players dan player_assessments asli, sehingga radar chart, Football ID, dan QR code menampilkan data nyata dari database.


Prioritas B (Integrasi Player Journey & Riwayat Pertandingan): Menghubungkan tab Journey dan Matches dengan hasil check-in turnamen dan riwayat absensi latihan nyata.





Ketika Anda siap mengimplementasikannya, sampaikan bagian mana yang ingin dieksekusi terlebih dahulu dan kita bisa beralih ke Build mode.