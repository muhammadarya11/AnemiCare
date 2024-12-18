package com.example.anemicare

import android.content.Intent
import android.os.Bundle
import android.widget.Toast
import androidx.activity.enableEdgeToEdge
import androidx.appcompat.app.AppCompatActivity
import androidx.core.view.ViewCompat
import androidx.core.view.WindowInsetsCompat
import api.response.LabResultRequest
import api.response.LabValues
import api.response.LoginResponse
import api.response.PredictionResponse
import api.services.ApiConfig
import api.services.ApiService
import com.example.anemicare.databinding.ActivityHomeBinding
import com.example.anemicare.databinding.ActivityInputLabResultBinding
import pref.SessionManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response


class InputLabResult : AppCompatActivity() {
    private lateinit var binding: ActivityInputLabResultBinding
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityInputLabResultBinding.inflate(layoutInflater)
        setContentView(binding.root)
        val token = SessionManager.token ?: ""
        println("Token: $token")
        setupAction()
    }

    fun setupAction() {
        binding.btn1.setOnClickListener() {
            navigateToHome()
        }
        binding.btn2.setOnClickListener() {
            navigateToProfile()
        }
        binding.btn3.setOnClickListener() {
            println("Token: ${SessionManager.token}")
            val wbc = binding.wbc.text.toString()
            val lymp = binding.lymp.text.toString()
            val neutp = binding.neutp.text.toString()
            val lynm = binding.lymn.text.toString()
            val neutn = binding.neutn.text.toString()
            val rbc = binding.rbc.text.toString()
            val hgb = binding.hgb.text.toString()
            val hct = binding.hct.text.toString()
            val mcv = binding.mcv.text.toString()
            val mch = binding.mch.text.toString()
            val mchc = binding.mchc.text.toString()
            val plt = binding.plt.text.toString()
            val pdw = binding.pdw.text.toString()
            val pct = binding.pct.text.toString()
            if (wbc.isNotEmpty() && lymp.isNotEmpty() && neutp.isNotEmpty() &&
                lynm.isNotEmpty() && neutn.isNotEmpty() && rbc.isNotEmpty() &&
                hgb.isNotEmpty() && hct.isNotEmpty() && mcv.isNotEmpty() &&
                mch.isNotEmpty() && mchc.isNotEmpty() && plt.isNotEmpty() &&
                pdw.isNotEmpty() && pct.isNotEmpty()) {
                submitLabRequest(SessionManager.token ?: "")
            } else {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
            }

        }

    }

    fun submitLabRequest(token: String){
        val labValues = LabValues(
            WBC = binding.wbc.text.toString().toDouble(),
            LYMp = binding.lymp.text.toString().toDouble(),
            NEUTp = binding.neutp.text.toString().toDouble(),
            LYNm = binding.lymn.text.toString().toDouble(),
            NEUTn = binding.neutn.text.toString().toDouble(),
            RBC = binding.rbc.text.toString().toDouble(),
            HGB = binding.hgb.text.toString().toDouble(),
            HCT = binding.hct.text.toString().toDouble(),
            MCV = binding.mcv.text.toString().toDouble(),
            MCH = binding.mch.text.toString().toDouble(),
            MCHC = binding.mchc.text.toString().toDouble(),
            PLT = binding.plt.text.toString().toDouble(),
            PDW = binding.pdw.text.toString().toDouble(),
            PCT = binding.pct.text.toString().toDouble()
        )
        val request = LabResultRequest(labValues)
        ApiConfig.getApiService().submitLabResults(token,request).enqueue(object : Callback<PredictionResponse>{
            override fun onResponse(
                call: Call<PredictionResponse>,
                response: Response<PredictionResponse>
            ) {
                if (response.isSuccessful) {
                    val predictionResponse = response.body()
                    println("Success: ${predictionResponse?.message}")
                    println("Predicted Class: ${predictionResponse?.data?.predictedClass}")
                    println("Confidence Score: ${predictionResponse?.data?.confidenceScore}")
                    val predictedClass = predictionResponse?.data?.predictedClass ?: "Unknown"
                    val confidenceScore = predictionResponse?.data?.confidenceScore ?: 0.0
                    navigateToResult(predictedClass, confidenceScore)
                } else {
                    println("Error: ${response.errorBody()?.string()}")
                }
            }
            override fun onFailure(call: Call<PredictionResponse>, t: Throwable) {
                println("Failure: ${t.message}")
            }
        })
    }

    fun navigateToHome() {
        val intent = Intent(this, Home::class.java)
        startActivity(intent)
    }
    fun navigateToProfile() {
        val intent = Intent(this, ProfilePasien::class.java)
        startActivity(intent)
    }
    fun navigateToResult(predictedClass: String, confidenceScore: Double) {
        val intent = Intent(this, PredictionResult::class.java)
        intent.putExtra("predictedClass", predictedClass)
        intent.putExtra("confidenceScore", confidenceScore)
        startActivity(intent)
    }
}