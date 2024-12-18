package api.response

import com.google.gson.annotations.SerializedName

class UserLoginData(

	@field:SerializedName("username")
	val username: String,

	@field:SerializedName("password")
	val password: String
)
