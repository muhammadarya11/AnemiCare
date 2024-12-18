package com.example.anemicare

import android.content.ContentValues.TAG
import android.content.Intent
import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AlertDialog
import androidx.appcompat.app.AppCompatActivity
import api.response.LoginResponse
import api.response.UserLoginData
import api.services.ApiConfig
import com.example.anemicare.databinding.ActivityMainBinding
import pref.SessionManager
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)
        setupAction()
    }

    private fun setupAction() {
        binding.loginButton.setOnClickListener {

            val username = binding.username.text.toString().trim()
            val password = binding.password.text.toString().trim()
            if (username.isNotEmpty() && password.isNotEmpty()) {
                login(username, password)
            } else {
                Toast.makeText(this, "Please fill all fields", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun login(username: String, password: String) {
        // Create user login data object
        println("Username: $username")
        println("Password: $password")
        val loginData = UserLoginData(username, password)
        println(loginData.username)
        println(loginData.password)
        // Make API call to login
        ApiConfig.getApiService().login(loginData).enqueue(object : Callback<LoginResponse> {
            override fun onResponse(call: Call<LoginResponse>, response: Response<LoginResponse>) {
                val loginResponse = response.body()
                if(response.isSuccessful){
                    if(loginResponse?.status == "success"){
                        SessionManager.token = "Bearer " + loginResponse?.token  // Save token
                        println("Login successful: ${loginResponse?.message}")
                        println("Token: ${loginResponse?.token}")
                        println("Token: ${loginResponse?.statusCode}")
                        showSuccessDialog(loginResponse?.token.toString())
                    } else {
                        showToast(loginResponse?.message ?: "Login failed")
                    }
                }else{
                    println("Failure: ${loginResponse?.message}")
                }
            }

            override fun onFailure(call: Call<LoginResponse>, t: Throwable) {
                Log.e(TAG, "onFailure: ${t.message}")
            }
        })
    }

    private fun showSuccessDialog(token: String) {
        AlertDialog.Builder(this).apply {
            setTitle("Login Successful")
            //setMessage("Welcome! Your token is: $token")
            setPositiveButton("Continue") { _, _ ->
                navigateToHome()
            }
            create()
            show()
        }
    }

    private fun showToast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    private fun navigateToHome() {
        val intent = Intent(this, Home::class.java)
        startActivity(intent)
        finish() // Close MainActivity
    }
}
