import ast
import numpy as np
import tensorflow as tf
import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from flask import Flask, request, jsonify

# Inisialisasi Flask app
app = Flask(__name__)

# Load dataset untuk preprocessing
df = pd.read_csv('dataset.csv')

# Misalkan df adalah DataFrame Anda
X = df.drop('Diagnosis', axis=1)  # features
y = df['Diagnosis']  # target label

# Split data 80:10:10
X_train, X_temp, y_train, y_temp = train_test_split(X, y, test_size=0.2, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)

# StandardScaler untuk preprocessing
sc = StandardScaler()
X_train_scaled = sc.fit_transform(X_train)
X_val_scaled = sc.transform(X_val)
X_test_scaled = sc.transform(X_test)

# Daftar nama kelas
class_names = [
    "Healthy", "Iron Deficiency Anemia", "Leukemia",
    "Leukemia with Thrombocytopenia", "Macrocytic Anemia",
    "Normocytic Hypochromic Anemia", "Normocytic Normochromic Anemia",
    "Other Microcytic Anemia", "Thrombocytopenia"
]

# Load model TensorFlow
model = tf.keras.models.load_model('model/model-v2.h5')

# Fungsi prediksi
def predict_anemia_from_features(features, model, class_name, scaler):
    # Reshape features ke bentuk 2D array (1 sampel, jumlah fitur)
    features = np.array(features).reshape(1, -1)

    # Pastikan jumlah fitur sesuai dengan scaler
    if features.shape[1] != scaler.n_features_in_:
        raise ValueError(f"Input features have {features.shape[1]} features, "
                         f"but StandardScaler expects {scaler.n_features_in_} features.")

    features_scaled = scaler.transform(features)

    # Prediksi menggunakan model Keras
    predictions = model.predict(features_scaled)
    
    predicted_class_index = np.argmax(predictions)
    confidence = np.max(predictions)

    # Mapping class index ke nama class
    predicted_class = class_name[predicted_class_index] if class_name else predicted_class_index

    return predicted_class, confidence

# Endpoint prediksi
@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Ambil input dari JSON
        input_data = request.json.get('input')
        if not input_data or not isinstance(input_data, list):
            return jsonify({
                "status": "error",
                "message": "Invalid input. Expected a list of features."
            }), 400

        # Prediksi
        predicted_class, confidence = predict_anemia_from_features(input_data, model, class_names, sc)

        # Response JSON
        response = {
            "status": "success",
            "message": "Prediction completed successfully.",
            "data": {
                "predictedClass": predicted_class,
                "confidenceScore": round(float(confidence), 2)
            }
        }
        return jsonify(response), 200

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": f"An error occurred during prediction: {str(e)}"
        }), 500

# Menjalankan server Flask
if __name__ == '__main__':
    app.run(debug=True)
