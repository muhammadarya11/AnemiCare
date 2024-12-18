package com.example.anemicare

import android.content.Intent
import androidx.appcompat.app.AppCompatActivity
import android.os.Bundle
import android.os.Handler

class SplashActivity : AppCompatActivity() {

    private val SPLASH_TIME_OUT: Long = 5000 // Durasi splash screen (dalam milidetik)

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_splash)

        // Menggunakan Handler untuk menunda navigasi ke MainActivity selama beberapa detik
        Handler().postDelayed({
            // Navigasi ke MainActivity setelah SPLASH_TIME_OUT
            startActivity(Intent(this, MainActivity::class.java))
            // Menutup activity splash screen agar tidak dapat kembali dengan tombol kembali
            finish()
        }, SPLASH_TIME_OUT)
    }
}