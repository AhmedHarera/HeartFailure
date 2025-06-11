import tensorflow as tf
import numpy as np
from flask import Blueprint, request, jsonify
import pandas as pd
from pathlib import Path
from flasgger import swag_from
import logging
import tempfile
import os
from csv_converter import convert_csv_to_format

# إعداد التسجيل
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

ecg_bp = Blueprint('ecg', __name__)

# تحميل النموذج
try:
    model_path = Path(__file__).parent / 'ECG model' / 'ECG_Heart Failure Project_best_model_cnn_lstm.keras'
    logger.info(f"محاولة تحميل النموذج من: {model_path}")
    model = tf.keras.models.load_model(str(model_path))
    logger.info("تم تحميل النموذج بنجاح")
except Exception as e:
    logger.error(f"فشل في تحميل النموذج: {str(e)}")
    # لا نرفع استثناء هنا لتجنب فشل تشغيل التطبيق عند البدء
    model = None

# تعريف الفئات
CATEGORIES = [
    'Normal',
    'Atrial Premature',
    'Premature Ventricular Contraction',
    'Fusion of Ventricular and Normal',
    'Fusion of Paced and Normal'
]

def preprocess_ecg_data(data):
    """
    معالجة بيانات ECG قبل التنبؤ
    """
    try:
        # تحويل البيانات إلى مصفوفة numpy
        data = np.array(data)
        logger.info(f"شكل البيانات قبل إعادة التشكيل: {data.shape}")
        
        # إعادة تشكيل البيانات للنموذج (batch_size, timesteps, features)
        data = data.reshape(1, -1, 1)
        logger.info(f"شكل البيانات بعد إعادة التشكيل: {data.shape}")
        
        # تطبيع البيانات
        data = (data - np.mean(data)) / np.std(data)
        
        return data
    except Exception as e:
        logger.error(f"خطأ في معالجة البيانات: {str(e)}")
        raise

@ecg_bp.route('/predict-ecg', methods=['POST'])
@swag_from({
    'tags': ['ECG'],
    'description': 'تحليل بيانات ECG وتصنيفها',
    'parameters': [
        {
            'name': 'file',
            'in': 'formData',
            'type': 'file',
            'required': True,
            'description': 'ملف CSV يحتوي على بيانات ECG'
        }
    ],
    'responses': {
        200: {
            'description': 'نتيجة التحليل',
            'schema': {
                'properties': {
                    'prediction': {'type': 'string', 'description': 'تصنيف ECG'},
                    'confidence': {'type': 'number', 'description': 'نسبة الثقة في التنبؤ'},
                    'ecgData': {'type': 'array', 'description': 'بيانات ECG', 'items': {'type': 'number'}}
                }
            }
        },
        400: {
            'description': 'خطأ في البيانات المدخلة'
        },
        500: {
            'description': 'خطأ في الخادم'
        }
    }
})
def predict_ecg():
    try:
        # التحقق من تحميل النموذج
        if model is None:
            logger.error("النموذج غير محمل. لا يمكن إجراء التنبؤ.")
            return jsonify({'error': 'Model not loaded. Check server logs.'}), 500
            
        # التحقق من وجود الملف
        if 'file' not in request.files:
            logger.error("لم يتم توفير أي ملف في الطلب")
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        logger.info(f"تم استلام ملف: {file.filename}, نوع البيانات: {file.content_type}")
        
        if file.filename == '':
            logger.error("تم استلام ملف بدون اسم")
            return jsonify({'error': 'Empty filename'}), 400
        
        # حفظ الملف مؤقتًا
        temp_dir = tempfile.mkdtemp()
        temp_path = os.path.join(temp_dir, file.filename)
        file.save(temp_path)
        logger.info(f"تم حفظ الملف مؤقتًا في: {temp_path}")
        
        # تحويل الملف إلى التنسيق المناسب
        try:
            processed_file = convert_csv_to_format(temp_path)
            logger.info(f"تم تحويل الملف إلى: {processed_file}")
            
            if not processed_file:
                logger.error("فشل في تحويل الملف")
                return jsonify({'error': 'Failed to convert file format'}), 400
        except Exception as e:
            logger.error(f"خطأ أثناء تحويل الملف: {str(e)}")
            return jsonify({'error': f'Error converting file: {str(e)}'}), 400
            
        # قراءة بيانات CSV
        try:
            df = pd.read_csv(processed_file)
            logger.info(f"تم قراءة ملف CSV المعالج بنجاح. شكل البيانات: {df.shape}")
            
            if df.empty:
                logger.error("ملف CSV فارغ")
                return jsonify({'error': 'Empty CSV file'}), 400
                
            ecg_data = df.iloc[0].values  # نفترض أن البيانات في الصف الأول
            logger.info(f"تم استخراج بيانات ECG. طول البيانات: {len(ecg_data)}")
            
        except Exception as e:
            logger.error(f"فشل في قراءة ملف CSV: {str(e)}")
            return jsonify({'error': f'Failed to read CSV file: {str(e)}'}), 400
        
        # معالجة البيانات
        try:
            processed_data = preprocess_ecg_data(ecg_data)
        except Exception as e:
            logger.error(f"فشل في معالجة البيانات: {str(e)}")
            return jsonify({'error': f'Failed to preprocess data: {str(e)}'}), 400
        
        # التنبؤ
        try:
            logger.info("محاولة تنفيذ التنبؤ")
            predictions = model.predict(processed_data)
            logger.info(f"تم تنفيذ التنبؤ بنجاح. شكل النتائج: {predictions.shape}")
        except Exception as e:
            logger.error(f"فشل في تنفيذ التنبؤ: {str(e)}")
            return jsonify({'error': f'Failed to make prediction: {str(e)}'}), 500
        
        # الحصول على الفئة المتنبأ بها ونسبة الثقة
        predicted_class_index = np.argmax(predictions[0])
        confidence = float(predictions[0][predicted_class_index])
        predicted_class = CATEGORIES[predicted_class_index]
        
        # فحص نسبة الثقة - إذا كانت أقل من 90% فالنتيجة غير طبيعية
        if confidence < 0.9:
            logger.info(f"نسبة الثقة منخفضة ({confidence:.2f})، اعتبار النتيجة غير طبيعية")
            # إذا كانت النتيجة طبيعية، نغيرها إلى غير طبيعية
            if predicted_class == 'Normal':
                # اختيار تصنيف غير طبيعي بناءً على أعلى احتمال بعد الطبيعي
                other_probabilities = predictions[0].copy()
                other_probabilities[0] = 0  # تجاهل التصنيف الطبيعي
                second_best_index = np.argmax(other_probabilities)
                predicted_class = CATEGORIES[second_best_index]
                logger.info(f"تم تغيير النتيجة إلى: {predicted_class}")
            
            # إضافة ملاحظة حول انخفاض الثقة
            prediction_note = f"{predicted_class} (Low confidence)"
        else:
            prediction_note = predicted_class
        
        logger.info(f"النتيجة النهائية: {prediction_note}, الثقة: {confidence}")
        
        # إرجاع النتيجة
        return jsonify({
            'prediction': prediction_note,
            'confidence': confidence,
            'ecgData': ecg_data.tolist()
        })
        
    except Exception as e:
        logger.error(f"خطأ غير متوقع: {str(e)}")
        return jsonify({'error': str(e)}), 500 