package api.response

import com.google.gson.annotations.SerializedName

data class LabResultRequest(
	@SerializedName("hasil_lab")
	val hasilLab: LabValues
)

data class LabValues(
	@SerializedName("WBC") val WBC: Double,
	@SerializedName("LYMp") val LYMp: Double,
	@SerializedName("NEUTp") val NEUTp: Double,
	@SerializedName("LYMn") val LYNm: Double,
	@SerializedName("NEUTn") val NEUTn: Double,
	@SerializedName("RBC") val RBC: Double,
	@SerializedName("HGB") val HGB: Double,
	@SerializedName("HCT") val HCT: Double,
	@SerializedName("MCV") val MCV: Double,
	@SerializedName("MCH") val MCH: Double,
	@SerializedName("MCHC") val MCHC: Double,
	@SerializedName("PLT") val PLT: Double,
	@SerializedName("PDW") val PDW: Double,
	@SerializedName("PCT") val PCT: Double
)
