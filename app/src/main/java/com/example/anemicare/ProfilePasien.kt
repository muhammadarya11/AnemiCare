package com.example.anemicare

import android.content.Intent
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.anemicare.databinding.ActivityMainBinding
import com.example.anemicare.databinding.ActivityProfilePasienBinding

class ProfilePasien : AppCompatActivity() {
    private lateinit var binding: ActivityProfilePasienBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityProfilePasienBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setupAction()
    }

    fun setupAction() {
        binding.btn1.setOnClickListener(){
            navigateToHome()

        }
        binding.btn2.setOnClickListener(){
            navigateToInputLabResult()
        }

    }
    fun navigateToInputLabResult() {
        val intent = Intent(this, InputLabResult::class.java)
        startActivity(intent)
    }
    fun navigateToHome() {
        val intent = Intent(this, Home::class.java)
        startActivity(intent)
    }

}

