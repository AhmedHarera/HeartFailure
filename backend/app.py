from flask import Flask, request, jsonify
from flask_cors import CORS
from flasgger import Swagger, swag_from
from ecg_service import ecg_bp
from chatbot_service import chatbot_bp

import pickle
import pandas as pd
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# تسجيل Blueprint الخاص بـ ECG
app.register_blueprint(ecg_bp)

# Register chatbot blueprint
app.register_blueprint(chatbot_bp, url_prefix='/chatbot')

# Configure Swagger
swagger_config = {
    "headers": [],
    "specs": [
        {
            "endpoint": 'apispec',
            "route": '/apispec.json',
            "rule_filter": lambda rule: True,
            "model_filter": lambda tag: True,
        }
    ],
    "static_url_path": "/flasgger_static",
    "swagger_ui": True,
    "specs_route": "/docs"
}

swagger = Swagger(app, config=swagger_config)

# تحديد مسار مجلد النماذج
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "model")  # ضع ملفات الـ pkl هنا

# تحديد مسارات ملفات النماذج
label_encoder_path = os.path.join(MODEL_DIR, "label_encoders.pkl")
one_hot_encoder_path = os.path.join(MODEL_DIR, "one_hot_encoder.pkl")
scaler_path = os.path.join(MODEL_DIR, "scaler.pkl")
model_path = os.path.join(MODEL_DIR, "heart_failure_model.pkl")

# التحقق من وجود الملفات
if not all(os.path.exists(p) for p in [model_path, label_encoder_path, one_hot_encoder_path, scaler_path]):
    raise FileNotFoundError("❌ One or more model files are missing! Please check the 'model' directory.")

# تحميل ملفات الـ pkl
with open(label_encoder_path, "rb") as le_file:
    label_encoders = pickle.load(le_file)

with open(one_hot_encoder_path, "rb") as ohe_file:
    one_hot_encoder = pickle.load(ohe_file)

with open(scaler_path, "rb") as scaler_file:
    scaler = pickle.load(scaler_file)

with open(model_path, "rb") as model_file:
    model = pickle.load(model_file)

# حفظ أسماء الميزات التي استخدمت أثناء التدريب
expected_feature_names = list(scaler.feature_names_in_)

# الخيارات الصالحة لبعض الميزات الفئوية
valid_options = {
    'Smoking': ['Yes', 'No'],
    'AlcoholDrinking': ['Yes', 'No'],
    'Stroke': ['Yes', 'No'],
    'DiffWalking': ['Yes', 'No'],
    'Sex': ['Male', 'Female'],
    'AgeCategory': ['18-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54',
                    '55-59', '60-64', '65-69', '70-74', '75-79', '80 or older'],
    'Race': ['White', 'Black', 'Asian', 'American Indian/Alaskan Native', 'Other', 'Hispanic'],
    'Diabetic': ['Yes', 'No', 'No, borderline diabetes', 'Yes (during pregnancy)'],
    'PhysicalActivity': ['Yes', 'No'],
    'GenHealth': ['Very good', 'Fair', 'Good', 'Poor', 'Excellent'],
    'Asthma': ['Yes', 'No'],
    'KidneyDisease': ['Yes', 'No'],
    'SkinCancer': ['Yes', 'No']
}

@app.route('/')
@swag_from({
    'responses': {
        200: {
            'description': 'Welcome to the Heart Failure Prediction API'
        }
    }
})
def home():
    return jsonify({"message": "Welcome to Heart Failure Prediction API!"})

@app.route('/predict', methods=['POST'])
@swag_from({
    'parameters': [
        {
            'name': 'body',
            'in': 'body',
            'required': True,
            'schema': {
                'id': 'PredictionInput',
                'required': ['BMI', 'Smoking', 'AlcoholDrinking', 'Stroke', 'PhysicalHealth', 
                           'MentalHealth', 'DiffWalking', 'Sex', 'AgeCategory', 'Race', 
                           'Diabetic', 'PhysicalActivity', 'GenHealth', 'SleepTime', 
                           'Asthma', 'KidneyDisease', 'SkinCancer'],
                'properties': {
                    'BMI': {'type': 'number', 'description': 'Body Mass Index'},
                    'Smoking': {'type': 'string', 'enum': ['Yes', 'No']},
                    'AlcoholDrinking': {'type': 'string', 'enum': ['Yes', 'No']},
                    'Stroke': {'type': 'string', 'enum': ['Yes', 'No']},
                    'PhysicalHealth': {'type': 'integer', 'minimum': 0, 'maximum': 30},
                    'MentalHealth': {'type': 'integer', 'minimum': 0, 'maximum': 30},
                    'DiffWalking': {'type': 'string', 'enum': ['Yes', 'No']},
                    'Sex': {'type': 'string', 'enum': ['Male', 'Female']},
                    'AgeCategory': {'type': 'string'},
                    'Race': {'type': 'string'},
                    'Diabetic': {'type': 'string'},
                    'PhysicalActivity': {'type': 'string', 'enum': ['Yes', 'No']},
                    'GenHealth': {'type': 'string'},
                    'SleepTime': {'type': 'number', 'minimum': 0, 'maximum': 24},
                    'Asthma': {'type': 'string', 'enum': ['Yes', 'No']},
                    'KidneyDisease': {'type': 'string', 'enum': ['Yes', 'No']},
                    'SkinCancer': {'type': 'string', 'enum': ['Yes', 'No']}
                }
            }
        }
    ],
    'responses': {
        200: {
            'description': 'Prediction result',
            'schema': {
                'properties': {
                    'HeartFailureRisk': {'type': 'string'}
                }
            }
        },
        400: {
            'description': 'Invalid input data'
        }
    }
})
def predict():
    try:
        data = request.json
        user_input = pd.DataFrame([data])

        # التأكد من أن جميع الأعمدة موجودة
        required_columns = list(valid_options.keys()) + ['BMI', 'PhysicalHealth', 'MentalHealth', 'SleepTime']
        missing_columns = [col for col in required_columns if col not in user_input]

        if missing_columns:
            return jsonify({"error": f"Missing columns: {missing_columns}"}), 400

        # تحويل الأعمار إلى أرقام
        age_mapping = {age: i for i, age in enumerate(valid_options['AgeCategory'])}
        user_input['AgeCategory'] = user_input['AgeCategory'].map(age_mapping)

        # تحويل الميزات الفئوية باستخدام Label Encoder
        categorical_columns = ['Smoking', 'AlcoholDrinking', 'Stroke', 'DiffWalking', 'Sex',
                               'PhysicalActivity', 'Asthma', 'KidneyDisease', 'SkinCancer']
        for col in categorical_columns:
            if col in label_encoders:
                user_input[col] = label_encoders[col].transform(user_input[col])

        # تحويل الميزات الاسمية باستخدام One-Hot Encoding
        nominal_columns = ['Race', 'Diabetic', 'GenHealth']
        one_hot_encoded = one_hot_encoder.transform(user_input[nominal_columns])
        one_hot_df = pd.DataFrame(one_hot_encoded, columns=one_hot_encoder.get_feature_names_out(nominal_columns))

        # دمج البيانات بعد One-Hot Encoding
        user_input = pd.concat([user_input.drop(nominal_columns, axis=1), one_hot_df], axis=1)

        # إعادة ترتيب الأعمدة بنفس الترتيب المستخدم أثناء التدريب
        user_input = user_input.reindex(columns=expected_feature_names, fill_value=0)

        # تطبيق StandardScaler
        user_input_scaled = scaler.transform(user_input)

        # تنفيذ التنبؤ
        prediction = model.predict(user_input_scaled)
        result = "High Prediction of heart failure" if prediction[0] == 1 else "Low Prediction of heart failure"

        return jsonify({'HeartFailureRisk': result})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True, port=49232, host='127.0.0.1')
