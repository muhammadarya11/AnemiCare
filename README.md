# Dokumentasi Anemicare API

## Pendahuluan

Selamat datang di dokumentasi API. Dokumen ini menjelaskan endpoint-endpoint yang tersedia, bagaimana cara menggunakannya, dan format data yang digunakan. Semua komunikasi dengan API harus menggunakan protokol HTTPS.

## Base URL

```
https://anemicare.app
```

## Autentikasi

API ini menggunakan autentikasi berbasis token. Anda perlu menyertakan token API di header setiap permintaan dengan format berikut:

```http
Authorization: Bearer <TOKEN_JWT_KAMU>
```

---

## Daftar Endpoint

### 1. **Autentikasi**

### **Login**

**Endpoint:**

```
POST /auth/login
```

**Deskripsi:**
Mengautentikasi pengguna dan menghasilkan token akses.

**Request:**

- Header:

```http
Authorization: Bearer <TOKEN_JWT_KAMU>
Content-Type: application/json
```

- Body:

```json
{
    "username": "budiman.bagus",
    "password": "password_aman"
}
```

**Response:**

- 200 OK:

```json
{
    "status": "success",
    "message": "Berhasil login.",
    "token": "TOKEN_JWT",
    "status_code": 200
}
```

- 401 Unauthorized:

```json
{
    "status": "error",
    "message": "Username atau Password salah.",
    "status_code": 400
}
```

- 400 Bad Request:

```json
{
    "status": "error",
    "message": "Payload JSON tidak valid.",
    "details": [
      {
        "field": "username",
        "error": "Username harus memiliki minimal 5 karakter."
      },
      {
        "field": "password",
        "error": "Password tidak boleh kosong."
      }
    ],
    "status_code": 400
}
```

---

### **Register**

**Endpoint:**

```
POST /auth/register
```

**Deskripsi:**
Mendaftarkan akun pengguna/dokter baru.

**Request:**

- Header:

```http
Authorization: Bearer <TOKEN_JWT_KAMU>
Content-Type: application/json
```

- Body:

```json
{
    "name": "Dr. Budiman"
    "username": "budiman.bagus",
    "password": "password_aman"
}
```

**Response:**

- 201 Created:

```json
{
    "status": "success",
    "message": "Pengguna berhasil didaftarkan.",
    "data": {
        "user": {
            "name": "Dr. Budiman",
            "username": "budiman.bagus"
        }
    },
    "status_code": 201
}
```

- 422 Unprocessable Entity

```json
{
    "status": "error",
    "message": "Username sudah digunakan. Silakan pilih username lain.",
    "status_code": 422
}
```

- 400 Bad Request

```json
{
    "status": "error",
    "message": "Payload JSON tidak valid.",
    "details": [
        {
            "field": "name",
            "error": "Nama tidak boleh kosong."
        },
        {
            "field": "username",
            "error": "Username tidak boleh kosong."
        },
        {
            "field": "password",
            "error": "Password tidak boleh kosong."
        }
    ],
    "status_code": 400
}
```

---

### Profile

**Endpoint**

```
GET /auth/profile
```

**Deskripsi:**
Mendapatkan data profil pengguna berdasarkan token.

**Request:**

- Header:

```http
Authorization: Bearer <TOKEN_JWT_KAMU>
```

**Response:**

- 200 OK:

```json
{
    "status": "success",
    "message": "Berhasil mengambil data profil.",
    "data": {
        "id": 1,
        "name": "Dr. Budiman",
        "username": "budiman.bagus"
    },
    "status_code": 200
}
```

- 401 Unauthorized:

```json
{
    "status": "error",
    "message": "Unauthorized - Token tidak valid atau tidak ada.",
    "status_code": 401
}
```

### **2. Prediksi Anemia**

### **Prediksi Anemia**

**Endpoint:**

```
POST /anemia/predict
```

**Deskripsi:**
Memprediksi tipe anemia berdasarkan hasil lab.

**Request:**

- Header:

```http
Authorization: Bearer <TOKEN_JWT_KAMU>
Content-Type: application/json
```

- Body:

```json
{
    "hasil_lab": {
        "WBC": 12.8,
        "LYMp": 13.1,
        "NEUTp": 78.5,
        "LYMn": 1.7,
        "NEUTn": 10,
        "RBC": 5.77,
        "HGB": 13.9,
        "HCT": 44.6,
        "MCV": 77.4,
        "MCH": 24,
        "MCHC": 31.1,
        "PLT": 164,
        "PDW": 12.3,
        "PCT": 0.15
    }
}
```

**Response:**

- 200 OK:

```json
{
    "status": "success",
    "message": "Prediksi berhasil.",
    "data": {
        "confidence_score": 0.95,
        "predicted_class": "Leukemia with Thrombocytopenia"
    },
    "status_code": 200
}
```

- 400 Bad Request:

```json
{
    "status": "error",
    "message": "Payload JSON tidak valid.",
    "details": [
        {
            "field": "LYMn",
            "error": "LYMn wajib diisi."
        },
        {
            "field": "PCT",
            "error": "PCT harus berupa angka."
        }
    ],
    "status_code": 400
}
```

### **Simpan Hasil Prediksi**

**Endpoint:**

```
POST /anemia/predict/save
```

**Deskripsi:**
Menyimpan hasil diagnosis prediksi beserta hasil lab dan data pasien.

**Request:**

- Header:

```http
Authorization: Bearer <TOKEN_JWT_KAMU>
Content-Type: application/json
```

- Body:

```json
{
    "profil_pasien": {
        "nama": "Siti",
        "usia": 35,
        "no_telp": "0812345678",
        "gender": "PEREMPUAN" # LAKI_LAKI atau PEREMPUAN
    },
    "hasil_lab": {
        "WBC": 10,
        "LYMp": 43.2,
        "NEUTp": 50.1,
        "LYMn": 4.3,
        "NEUTn": 5,
        "RBC": 2.77,
        "HGB": 7.3,
        "HCT": 24.2,
        "MCV": 87.7,
        "MCH": 26.3,
        "MCHC": 30.1,
        "PLT": 189,
        "PDW": 12.5,
        "PCT": 0.17
    },
    "diagnosis" : "Leukemia with Thrombocytopenia"
}
```

**Response:**

- 201 Created:

```json
{
    "status": "success",
    "message": "Data prediksi berhasil disimpan.",
    "data": {
        "id": 4,
        "diagnosis": "Leukemia with Thrombocytopenia"
    },
    "status_code": 201
}
```

- 400 Bad Request

```json
{
    "status": "error",
    "message": "Payload JSON tidak valid.",
    "details": [
        {
            "field": "gender",
            "error": "Gender harus berupa 'LAKI_LAKI' atau 'PEREMPUAN'."
        }
    ],
    "status_code": 400
}
```

### **3. Riwayat dan Rekapitulasi**

### **Rekapitulasi Pengguna/Dokter**

**Endpoint:**

```
GET /report/summary
```

**Deskripsi:**
Mendapatkan data rekap dokter/pengguna.

**Request:**

- Header:

```http
Authorization: Bearer <TOKEN_JWT_KAMU>
```

**Response:**

- 200 OK:

```json
{
    "status": "success",
    "message": "Berhasil mengambil data.",
    "data": {
        "persentase": {
            "usia": {
                "anak_anak": "9.80",
                "remaja": "9.80",
                "dewasa": "41.18",
                "lansia": "39.22"
            },
            "gender": {
                "laki_laki": "35.29",
                "perempuan": "64.71"
            }
        },
        "riwayat": [
            {
                "nama": "Siti",
                "usia": 29,
                "gender": "PEREMPUAN",
                "diagnosis": "Leukemia with Thrombocytopenia"
            },
            {
                "nama": "Patient_6",
                "usia": 40,
                "gender": "PEREMPUAN",
                "diagnosis": "Anemia"
            },
            {
                "nama": "Patient_10",
                "usia": 4,
                "gender": "PEREMPUAN",
                "diagnosis": "Anemia"
            }
        ],
        "status_code" : 200
    }
}
```

### **Data Riwayat**

**Endpoint:**

```
GET /report/history?from=date&to=date
```

**Deskripsi:**
Mendapatkan data rekap dokter/pengguna.

**Request:**

- Header:

```http
Authorization: Bearer <TOKEN_JWT_KAMU>
```

- Query Params
  - **from (opsional)** : tanggal mulai berupa string seperti **"10-12-2024"**
  - **to (opsional)** : tanggal hingga berupa string seperti **"20-12-2024"**

**Response:**

- 200 OK:

```json
{
    "status": "success",
    "message": "Berhasil mengambil data.",
    "data": [
        {
            "id": 4,
            "dokter": {
                "name": "Dr. Budiman"
            },
            "hasil_diagnosis": {
                "id": 4,
                "dokter_id": 4,
                "pasien_id": 4,
                "wbc": 10,
                "lymp": 43.2,
                "neutp": 50.1,
                "lymn": 4.3,
                "neutn": 5,
                "rbc": 2.77,
                "hgb": 7.3,
                "hct": 24.2,
                "mcv": 87.7,
                "mch": 26.3,
                "mchc": 30.1,
                "plt": 189,
                "pdw": 12.5,
                "pct": 0.17,
                "diagnosis": "Leukemia with Thrombocytopenia",
                "created_at": "2024-12-12T04:41:44.809Z"
            },
            "pasien": {
                "nama": "Siti",
                "gender": "PEREMPUAN",
                "usia": 29
            },
            "created_at": "2024-12-12T04:41:44.843Z"
        },
        {
            "id": 5,
            "dokter": {
                "name": "Dr. Budiman"
            },
            "hasil_diagnosis": {
                "id": 5,
                "dokter_id": 4,
                "pasien_id": 5,
                "wbc": 8.4,
                "lymp": 32.1,
                "neutp": 55.9,
                "lymn": 2.9,
                "neutn": 7.4,
                "rbc": 5.69,
                "hgb": 10.8,
                "hct": 48.5,
                "mcv": 81.4,
                "mch": 26.6,
                "mchc": 36.6,
                "plt": 345,
                "pdw": 13.3,
                "pct": 0.19,
                "diagnosis": "Anemia",
                "created_at": "2024-12-12T04:47:43.316Z"
            },
            "pasien": {
                "nama": "Patient_6",
                "gender": "PEREMPUAN",
                "usia": 40
            },
            "created_at": "2024-12-12T04:47:43.416Z"
        }
    ],
    "status_code": 200
}
```

## Kesalahan Umum

API ini menggunakan kode status HTTP standar untuk menunjukkan keberhasilan atau kegagalan permintaan. Berikut adalah beberapa kode status yang umum:

- **200 OK**: Permintaan berhasil diproses.
- **201 Created**: Data baru berhasil dibuat.
- **400 Bad Request**: Permintaan tidak valid.
- **401 Unauthorized**: Token autentikasi tidak valid atau hilang.
- **404 Not Found**: Data yang diminta tidak ditemukan.
- **422 Unprocessable Entity**: Permintaan valid tetapi tidak dapat diproses, misalnya karena username sudah terdaftar.
- **500 Internal Server Error**: Terjadi kesalahan di server.

## Kontak

Jika ada pertanyaan lebih lanjut atau masalah teknis, silakan hubungi tim pengembang melalui email: [muhammadaryakusuma4@gmail.com](mailto\:[muhammadaryakusuma4@gmail.com).
