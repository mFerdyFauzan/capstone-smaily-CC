# Capstone-Smaily

Repository team Smaily sebagai tempat untuk menampung code backend untuk Capstone Project di Bangkit Academy 2022

## CARA PAKAI:
1. Bikin database dulu di PostgreSQL yang namanya "testdb"
   - Install postgreSQL
   - Buka pSQL (PostgreSQL Shell)
   - Masukkan perintah berikut: ```CREATE DATABASE testdb```
2. install package yang dubutuhkan pakai NPM
   - Install NodeJS
   - Buka folder tempat Anda menaruh code ini
   - Buka terminal / cmd Windows di lokasi folder
   - Masukkan perintah ```npm init --y```
   - Install package yang dibutuhkan dengan perintah berikut: ```npm install package-name1 package-name2 package-nameN```
4. Jalankan node server.js
   - Ganti listening port terlebih dahulu (bila listening port di code sedang dipakai)
   - Masukkan perintah ```node server.js``` di terminal yang telah dibuka tadi
5. Tes API pakai Postman
   - Masukkan alamat yang ada di smaily.route.js pada kolom address yang dituju
   - Tentukan HTTP Method sesuai dengan API yang ingin dites
   - Masukkan variabel / parameter sesuai dengan API yang ingin dites
   - Klik tombol Send Request

###### **YANG SUDAH:**
- [x] Login
- [x] Register
- [x] CRUD
- [x] Logout
- [x] Search
- [x] JWT
- [x] Hash Password
- [x] Pagination
- [x] Ordering
- [x] Insert Admin user
- [x] Input Validation
- [x] Profile
- [x] Role-based Authorization
- [x] Autentikasi token
- [x] Menyambungkan akun orangtua ke akun anak

###### **YANG BELOM:**
- [ ] log out yang bener (bukan expire jwt)
- [ ] Riwayat jelajah anak (kalo perlu) GA USAH PLEASE
- [ ] Komentar ortu berdasarkan riwayat (kalo perlu) GA USAH PLEASE
- [ ] Dokumentasi API
- [ ] dll
