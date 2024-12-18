package api.services

import api.response.LabResultRequest
import api.response.LoginResponse
import api.response.UserLoginData
import api.response.PredictionResponse
import retrofit2.Call
import retrofit2.http.Body
import retrofit2.http.GET
import retrofit2.http.Header
import retrofit2.http.Headers
import retrofit2.http.POST

interface ApiService {
        @Headers("Content-Type: application/json")
        @POST("auth/login")
        fun login(@Body request: UserLoginData): Call<LoginResponse>

        @POST("anemia/predict") // Replace with the correct endpoint
        @Headers("Content-Type: application/json") // Optional, ensure JSON content type
        fun submitLabResults(
                @Header("Authorization") token: String,  // Token for Authorization
                @Body request: LabResultRequest          // Request body
        ): Call<PredictionResponse>
}