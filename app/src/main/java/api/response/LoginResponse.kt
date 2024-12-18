package api.response

import com.google.gson.annotations.SerializedName

 class LoginResponse(

	@field:SerializedName("status_code")
	val statusCode: Int,

	@field:SerializedName("message")
	val message: String,

	@field:SerializedName("status")
	val status: String,

	@field:SerializedName("token")
	val token: String
)
