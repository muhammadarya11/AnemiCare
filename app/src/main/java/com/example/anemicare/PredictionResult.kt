package com.example.anemicare

import android.content.Intent
import android.os.Bundle
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import api.response.PredictionResponse
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import com.example.anemicare.databinding.ActivityInputLabResultBinding
import com.example.anemicare.databinding.ActivityPredictionResultBinding

class PredictionResult : AppCompatActivity() {
    private lateinit var binding: ActivityPredictionResultBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityPredictionResultBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val predictedClass = intent.getStringExtra("predictedClass") ?: "Unknown"
        val confidenceScore = intent.getDoubleExtra("confidenceScore", 0.0)

        binding.tvPredictedClass.text = predictedClass
        binding.tvConfidenceScore.text = "Confidence Score: $confidenceScore"
        setupAction()
    }

    fun setupAction() {
        binding.btn1.setOnClickListener() {
            navigateToHome()
        }
        binding.btn2.setOnClickListener() {
            navigateToInputLabResult()
        }
    }

    fun navigateToHome() {
        val intent = Intent(this, Home::class.java)
        startActivity(intent)
    }
    fun navigateToInputLabResult() {
        val intent = Intent(this, InputLabResult::class.java)
        startActivity(intent)
    }
}