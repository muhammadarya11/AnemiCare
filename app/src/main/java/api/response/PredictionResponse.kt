package api.response

import com.google.gson.annotations.SerializedName

data class PredictionResponse(

	@field:SerializedName("status_code")
	val statusCode: Int,

	@field:SerializedName("data")
	val data: Data,

	@field:SerializedName("message")
	val message: String,

	@field:SerializedName("status")
	val status: String
)

data class Data(

	@field:SerializedName("confidence_score")
	val confidenceScore: Double,

	@field:SerializedName("predicted_class")
	val predictedClass: String
)
