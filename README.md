# About Smaily

Smaily merupakan aplikasi digital parenting yang memberikan sarana bagi orang tua untuk melakukan pemantauan dan pengontrolan atas aktivitas anak mereka selama menggunakan smartphone android. Smaily dibuat untuk memenuhi kebutuhan pembuatan Product-based Capstone Project dari kelompok C22-PS302 di Bangkit Academy 2022.

## CARA PAKAI (localhost):
1. Bikin database dulu di PostgreSQL yang namanya "testdb"
   - Install postgreSQL
   - Buka pSQL (PostgreSQL Shell)
   - Masukkan perintah berikut: ```CREATE DATABASE testdb```
2. Install package yang dubutuhkan pakai NPM
   - Install NodeJS
   - Buka folder tempat Anda menaruh code ini
   - Buka terminal Linux / cmd Windows di lokasi folder
   - Masukkan perintah ```npm init --y```
   - Install package yang dibutuhkan dengan perintah berikut: ```npm install package-name1 package-name2 package-nameN```
3. Jalankan node server.js
   - Ganti listening port terlebih dahulu (bila listening port di code sedang dipakai)
   - Masukkan perintah ```node server.js``` di terminal yang telah dibuka tadi
4. Tes API pakai Postman
   - Masukkan alamat yang ada di folder routes.js pada kolom address yang dituju
   - Tentukan HTTP Method sesuai dengan API yang ingin diuji
   - Masukkan variabel / parameter sesuai dengan API yang ingin diuji
   - Klik tombol Send untuk mengirim request ke API
   - Respons akan dikirim sesuai API yang diuji

## CARA PAKAI (online):
1. Tes API pakai Postman
   - Masukkan alamat yang ada di folder routes.js pada kolom address yang dituju
   - Tentukan HTTP Method sesuai dengan API yang ingin diuji
   - Masukkan variabel / parameter sesuai dengan API yang ingin diuji
   - Klik tombol Send untuk mengirim request ke API
   - Respons akan dikirim sesuai API yang diuji


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
- [x] Get, Set, Delete kunci untuk aplikasi dan URL pada perangkat anak
- [x] Dokumentasi API

###### **YANG BELOM:**
- [ ] ???
