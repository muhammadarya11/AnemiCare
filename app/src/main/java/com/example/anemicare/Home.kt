package com.example.anemicare

import android.content.Intent
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.anemicare.databinding.ActivityHomeBinding
import com.example.anemicare.databinding.ActivityProfilePasienBinding

class Home : AppCompatActivity() {
    private lateinit var binding: ActivityHomeBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityHomeBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setupAction()
    }

    fun setupAction() {
        binding.button.setOnClickListener(){
            navigateToProfile()
        }

    }
    fun navigateToProfile() {
        val intent = Intent(this, ProfilePasien::class.java)
        startActivity(intent)
    }
}