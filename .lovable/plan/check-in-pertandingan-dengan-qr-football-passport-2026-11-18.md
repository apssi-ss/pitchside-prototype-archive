# Check-in pertandingan dengan QR Football Passport

## Yang akan dibuat
- Mengganti pola QR tiruan di Football Passport dengan QR yang benar-benar bisa dipindai, berisi pengenal aman tanpa memuat data pribadi pemain.
- Menyediakan data tersimpan untuk turnamen, pertandingan, dan daftar pemain tiap pertandingan agar panitia dapat memilih laga dan memeriksa peserta yang berhak check-in.
- Membuat halaman panitia untuk memindai QR melalui kamera, mencari ID secara manual bila kamera tidak tersedia, melihat status hadir, dan mencatat waktu serta akun petugas.
- Menolak QR yang tidak dikenal, pemain di luar roster pertandingan, dan check-in ganda; catatan tetap tersedia setelah halaman dimuat ulang.
- Membatasi pengelolaan pertandingan dan check-in pada akun yang secara khusus ditetapkan sebagai panitia. Pilihan peran demo tidak akan memberi izin. Email akun panitia pertama akan ditambahkan saat Anda memberikannya.

## Teknis
- Menambah struktur data pertandingan, roster, check-in, dan peran panitia dengan akses berbasis akun serta kebijakan privasi pada database.
- Menggunakan QR sungguhan dan alur kamera browser dengan jalur input ID sebagai cadangan.
- Menghubungkan tampilan turnamen dan panitia ke data tersimpan; mempertahankan data demo yang ada sebagai contoh, bukan sebagai catatan check-in nyata.
- Menguji izin panitia dan penolakan akses, pemindaian valid/tidak valid, roster yang salah, duplikasi, serta ketahanan catatan setelah muat ulang.
