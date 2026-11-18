Berdasarkan audit menyeluruh terhadap seluruh codebase saat ini, berikut adalah hasil analisis kondisi Modul Wasit (Referee Module) serta peta rencana pengembangannya agar terintegrasi penuh ke dalam ekosistem BolaID.





1. Analisis Codebase Modul Wasit Saat Ini



Di sisi antarmuka (UI), modul wasit sudah memiliki alur kerja yang sangat baik untuk operasional lapangan. Namun, modul ini saat ini masih beroperasi secara terisolasi dengan data tiruan (mock data):



Area Fitur Wasit	Halaman / Route	Status Saat Ini	Detail Teknis & Sumber Data
Dashboard Penugasan	/referee	Mock Data	Menampilkan penugasan pertandingan, jadwal kick-off, venue, rekan tim wasit, serta tombol Konfirmasi / Tolak. Menggunakan src/lib/mock-data.ts (assignments, referee).
Match Report Digital	/referee/report	Mock Data / Local State	Papan skor interaktif, pengatur babak (Pre, H1, H2, FT), counter menit laga, pencatat kejadian (Gol, Kartu Kuning, Kartu Merah, Pergantian, Insiden), dan timeline kronologi. Data skuad dan pemain masih statis (reportSquads).
Profil & Lisensi	/referee/profile	Mock Data	Nomor lisensi (C2 PSSI), wilayah Askot, rekap laga dipimpin, dan rating panitia dalam komponen prototipe statis (RolePage).
Role & Hak Akses Backend	public.user_roles	Belum Ada di DB	Enum peran di database Supabase saat ini baru mencakup organizer, admin, dan coach. Peran referee belum ada di enum database dan RLS.
Tabel Pertandingan & Kejadian	matches & match_roster	Parsial	Tabel matches sudah ada (tim kandang, tandang, waktu, venue), tetapi belum menyimpan ID wasit yang ditugaskan, skor akhir, status laga (live/completed), maupun kejadian kartu dan pencetak gol.




2. Integrasi Modul Wasit dalam Ekosistem BolaID



Wasit adalah pencatat resmi fakta pertandingan (official match facts). Dalam arsitektur satu aplikasi, data yang dicatat wasit mengalir otomatis ke seluruh modul lainnya:



       ┌────────────────────────────────────────────────────────┐
       │             PANITIA TURNAMEN (/organizer)              │
       │       • Buat jadwal pertandingan di `matches`          │
       │       • Menugaskan wasit & asisten wasit               │
       └───────────────────────────┬────────────────────────────┘
                                   │ Penugasan
                                   ▼
       ┌────────────────────────────────────────────────────────┐
       │               MODUL WASIT (/referee)                   │
       │       • Terima / tolak penugasan laga                  │
       │       • Akses line-up pemain terverifikasi QR Passport │
       │       • Catat gol, kartu, pergantian secara live       │
       │       • Submit Match Sheet resmi (Status FT)           │
       └───────────────────────────┬────────────────────────────┘
                                   │ Submit Laporan Resmi
         ┌─────────────────────────┼─────────────────────────┐
         ▼                         ▼                         ▼
┌──────────────────┐      ┌──────────────────┐      ┌──────────────────┐
│ MODUL TURNAMEN   │      │ MODUL PEMAIN     │      │ MODUL ASOSIASI   │
│ • Skor terbit    │      │ • Caps (menit)   │      │ • Jam terbang &  │
│ • Klasemen grup  │      │ • Gol & assist   │      │   riwayat laga   │
│   otomatis naik  │      │ • Rekor disiplin │      │   wasit berlisensi│
│ • Top skor live  │      │   (kartu Y/R)    │      │   PSSI / Askot   │
└──────────────────┘      └──────────────────┘      └──────────────────┘





3. Peta Rencana Pengembangan Modul Wasit Terintegrasi



Pengembangan modul wasit dirancang dalam 4 fase terstruktur:



┌─────────────────────────────────────────────────────────────────────────┐
│                 PETA PENGEMBANGAN MODUL WASIT TERPADU                   │
├──────────────────┬──────────────────┬──────────────────┬────────────────┤
│      FASE 1      │      FASE 2      │      FASE 3      │     FASE 4     │
│  Role & Sistem   │ Live Match Sheet │ Sinkronisasi Otomatis│ Profil Lisensi &│
│  Penugasan DB    │ & Event Logger   │ Hasil, Klasemen & Caps│ Verifikasi PSSI │
├──────────────────┼──────────────────┼──────────────────┼────────────────┤
│• Tambah role     │• Ambil roster    │• Update status   │• Tabel profil  │
│  `referee` di DB │  pemain real dari│  `completed`     │  wasit (lisensi│
│• Relasi penugasan│  `match_roster`  │• Rekap otomatis  │  C1/C2/C3)     │
│  wasit ke matches│• Catat gol/kartu │  klasemen grup   │• Validasi masa │
│• Konfirmasi laga │  ke `match_events│• Akumulasi gol & │  berlaku oleh  │
│  oleh wasit      │  di database     │  caps di `/player│  Asprov/Askot  │
└──────────────────┴──────────────────┴──────────────────┴────────────────┘



Fase 1: Role Wasit & Sistem Penugasan Resmi (Assignment)




Pondasi Database:



Menambahkan enum referee ke dalam public.app_role dan fungsi keamanan is_referee.


Menambahkan relasi penugasan wasit pada tabel matches (wasit utama, asisten 1, asisten 2, status konfirmasi: pending, confirmed, declined).






Dashboard Wasit Real (/referee):



Mengambil penugasan laga nyata yang ditugaskan oleh panitia turnamen.


Aksi konfirmasi atau penolakan penugasan tersimpan permanen dan memberi notifikasi balik ke panitia (/organizer).








Fase 2: Digital Match Sheet & Event Logger Real-Time (/referee/report)




Validasi Skuad dari Hasil Check-In:



Mengganti daftar pemain statis (reportSquads) dengan pemain yang benar-benar terdaftar di match_roster dan telah lolos check-in barcode Football Passport (match_checkins).






Pencatatan Kejadian Pertandingan (match_events):



Menyimpan setiap kejadian ke tabel match_events (menit kejadian, tim, tipe: gol, kartu kuning, kartu merah, pergantian, insiden, serta relasi ke player_id).


Fitur penghapusan kejadian jika terjadi salah input oleh wasit.








Fase 3: Otomatisasi Hasil, Klasemen Turnamen & Statistik Pemain




Finalisasi Laporan (Full Time - FT):



Saat wasit menekan tombol "Kirim Laporan Resmi", status laga di tabel matches otomatis berubah menjadi completed dengan skor akhir yang terkunci.






Integrasi Hasil ke Seluruh Aplikasi:



Turnamen (/tournament & /organizer/results): Hasil skor, poin grup, selisih gol, dan daftar pencetak gol (top scorer) otomatis terhitung tanpa perlu input manual ulang dari panitia.


Profil Pemain (/player): Menit bermain (caps), gol resmi, dan catatan disiplin kartu pemain langsung bertambah di statistik Football Passport anak.








Fase 4: Profil Lisensi Wasit & Validasi Asosiasi (/referee/profile)




Identitas & Lisensi Wasit Digital:



Menyimpan data lisensi (C3 Daerah, C2 Provinsi, C1 Nasional), nomor registrasi wasit PSSI, dan masa berlaku sertifikasi.






Monitoring Asosiasi (/association):



PSSI Askot/Asprov dapat melihat persebaran wasit aktif, riwayat laga yang dipimpin, dan evaluasi integritas pertandingan.










Pilihan Prioritas untuk Dieksekusi



Untuk mulai mengintegrasikan modul wasit ini ke dalam aplikasi, berikut 2 pilihan prioritas eksekusi:





Prioritas A (Integrasi Laporan Pertandingan & Event Logger Real):

Menghubungkan formulir laporan pertandingan di /referee/report dengan tabel matches, skuad pemain riil dari match_roster, dan mencatat gol/kartu ke database sehingga skor laga otomatis terbit.


Prioritas B (Role Wasit & Sistem Penugasan Laga):

Menambahkan role wasit di database, menghubungkan jadwal penugasan di /referee dengan jadwal turnamen panitia (/organizer), dan menyediakan alur konfirmasi penugasan langsung dari HP wasit.





Bagian mana yang ingin Anda prioritaskan terlebih dahulu? Ketika Anda siap, kita bisa beralih ke Build mode untuk mulai mengembangkannya.