Berikut adalah analisis mendalam codebase saat ini, pemetaan kebutuhan, serta rencana arsitektur dan pengembangan terintegrasi untuk alur turnamen: dari pendaftaran turnamen, pendaftaran skuad pemain, penentuan line-up laga, hingga check-in berbasis QR Passport di lapangan.





1. Analisis Codebase Saat Ini (Kondisi Nyata vs Gap)



Berdasarkan pemeriksaan langsung pada database dan kode sumber aplikasi saat ini:



Komponen	Status Saat Ini	Gap / Yang Perlu Dibangun
Turnamen	Halaman /tournament dan /organizer masih membaca data mock statis (tournament di src/lib/mock-data.ts).	Belum ada tabel database tournaments dan tournament_teams untuk pendaftaran mandiri SSB/tim.
Pemain & Database SSB	Tabel players sudah aktif di database dengan nomor unik Football ID dan token QR terenkripsi (BOLAID:P:<token>).	Pemain baru terhubung ke SSB induk, belum ada tabel relasi pendaftaran pemain ke turnamen tertentu (tournament roster).
Pertandingan (Matches)	Tabel matches sudah ada dengan kolom teks tournament_name, home_team, away_team.	Belum terhubung secara relasional (foreign key) ke turnamen dan tim terdaftar.
Roster Laga (Match Roster)	Tabel match_roster sudah ada dan menghubungkan pemain ke laga tertentu.	Roster saat ini dimasukkan secara langsung tanpa membedakan status skuad turnamen resmi vs starting line-up / cadangan laga.
Line-up Pertandingan	Halaman /coach_/teams menampilkan susunan pemain contoh (mock statis).	Belum ada antarmuka bagi pelatih untuk memilih starting XI / 7v7, nomor punggung laga, kapten, dan pemain cadangan.
Check-in Pertandingan QR	Fungsi aman check_in_player dan halaman /_authenticated/organizer_/checkin sudah aktif dengan pemindai kamera QR & input manual ID.	Saat ini baru memvalidasi kehadiran terhadap match_roster, belum memvalidasi apakah pemain masuk dalam Line-up resmi laga atau kuota cadangan yang disahkan.




2. Pemetaan Kebutuhan (Requirements Mapping)



Sistem yang utuh membutuhkan alur berkesinambungan tanpa data ganda:



[1. Pendaftaran Turnamen]
SSB/Pelatih mendaftarkan tim ke Turnamen & Kategori Usia (U10, U12, dll)
                    ↓
[2. Pendaftaran Pemain Turnamen (Roster Skuad)]
Pelatih memilih pemain dari database SSB (diverifikasi via Football ID & tahun lahir)
Panitia menyetujui kuota & keabsahan berkas/usia (Screening Turnamen)
                    ↓
[3. Pembuatan Jadwal & Line-up Match]
Panitia merilis jadwal laga (Home vs Away)
Sebelum laga, masing-masing Pelatih menentukan DSP (Daftar Susunan Pemain):
- Starter (Inti) & Cadangan (Substitutes)
- Nomor punggung laga & Kapten
                    ↓
[4. Match Check-in QR di Lapangan]
Panitia memindai Football Passport pemain di *technical area*:
- Validasi instan: Terdaftar di turnamen? Masuk DSP laga? Duplikat?
- Status live: Siap bertanding (Terverifikasi) vs Tidak Hadir
                    ↓
[5. Laporan Laga Terpadu]
Data check-in & line-up otomatis menjadi lembar pertandingan resmi (Match Sheet).





3. Arsitektur Data & Keamanan (Skema Database)



Untuk mengintegrasikan seluruh alur ini secara aman dan konsisten, struktur tabel yang dibutuhkan:





tournaments



Atribut: id, name, organizer_id, category (misal: U10, U12), start_date, end_date, venue, status (registration_open, ongoing, completed), max_squad_size (misal: 14–18 pemain).






tournament_teams



Atribut: id, tournament_id, team_name, coach_user_id, status (pending, approved, rejected), registered_at.






tournament_rosters



Atribut: id, tournament_team_id, player_id, jersey_number, verified_by_organizer (boolean).


Validasi otomatis: Tahun lahir pemain pada tabel players harus sesuai batas usia kategori turnamen.






matches (Refaktor)



Atribut: Menghubungkan langsung home_tournament_team_id dan away_tournament_team_id ke tabel turnamen resmi.






match_lineups



Atribut: match_id, player_id, team_id, role (starter | substitute), shirt_number, is_captain, submitted_by.






match_checkins (Sudah ada, diperkaya)



Memvalidasi check-in terhadap match_lineups. Panitia langsung tahu apakah pemain berstatus Pemain Inti atau Cadangan saat dipindai.










4. Rencana Pengembangan Bertahap (Actionable Roadmap)


Tahap 1: Pendaftaran Turnamen & Verifikasi Skuad (Admin/Panitia + Pelatih)




Tabel & RLS: Membuat tabel tournaments, tournament_teams, dan tournament_rosters.


Portal Pelatih: Halaman pendaftaran turnamen bagi akun pelatih (/coach/tournaments atau di /ssb), di mana pelatih memilih turnamen aktif, mendaftarkan tim, dan memilih pemain dari daftar SSB yang sudah ber-Football ID.


Validasi Otomatis Usia: Pemain di luar rentang kelahiran kategori langsung ditolak sistem saat pelatih memilih skuad.


Dasbor Panitia: Halaman tinjauan pendaftaran (/organizer/registrations) untuk menyetujui tim dan memverifikasi kuota pemain.




Tahap 2: Manajemen Jadwal & Pengisian Line-up Pertandingan




Integrasi Match: Jadwal pertandingan mengambil tim dari peserta turnamen yang sudah disetujui.


Formulir DSP (Line-up) Pelatih: Sebelum pertandingan dimulai, pelatih membuka menu laga timnya untuk menyusun:



Pemain Inti (Starter)


Pemain Cadangan (Substitutes)


Nomor punggung khusus laga & penunjukan Kapten.






Batas Waktu Penguncian: Line-up otomatis terkunci setelah batas waktu (misal: 30 menit sebelum kickoff) atau setelah dikonfirmasi pelatih.




Tahap 3: Pemutakhiran Check-in QR Pertandingan




Pembaruan Fungsi check_in_player:



Memverifikasi keberadaan pemain di match_lineups.


Mengembalikan informasi posisi (starter atau substitute) beserta nomor punggung saat berhasil dipindai.






Antarmuka Scanner Panitia:



Menampilkan dua tab: Starting XI / Formasi Inti dan Pemain Cadangan.


Begitu QR Passport dipindai, kartu pemain langsung berubah hijau dengan lencana "Hadir (Starter)" atau "Hadir (Cadangan)".


Peringatan jika pemain terdaftar di turnamen tetapi tidak dimasukkan pelatih ke dalam line-up laga.








Tahap 4: Halaman Publik & Lembar Pertandingan (Match Sheet)




Halaman jadwal publik (/schedule & /tournament) menampilkan line-up resmi dan status kehadiran secara transparan untuk penonton, orang tua, dan pemandu bakat (scout).


Panitia dapat mengunduh atau mencetak lembar susunan pemain (DSP) yang sah sebelum peluit dimulai.






Opsi Keputusan & Langkah Selanjutnya



Untuk memulai implementasi ini, kita dapat membaginya ke dalam siklus kerja berikut:





Mulai dari Fondasi Data & Registrasi (Tahap 1 & 2): Membangun skema tabel turnamen, pendaftaran tim oleh pelatih, dan penyusunan line-up laga.


Mulai dari Integrasi Line-up & Check-in (Tahap 2 & 3): Memanfaatkan data pertandingan yang sudah ada di database untuk langsung melengkapi antarmuka pengisian line-up pelatih dan sinkronisasi ke pemindai QR panitia.





Bagian mana yang ingin Anda prioritaskan untuk kita mulai eksekusi?