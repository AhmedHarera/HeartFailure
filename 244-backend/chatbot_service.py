from flask import Blueprint, request, jsonify
import os
import random

# Create blueprint for chatbot routes
chatbot_bp = Blueprint('chatbot', __name__)

# Get base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CHATBOT_DIR = os.path.join(BASE_DIR, "colab_chatbot")

# Initialize model and tokenizer
model = None
tokenizer = None
pipe = None

# Simple template-based response system as fallback
FALLBACK_TEMPLATES = [
    "I'd recommend consulting with a healthcare provider about your heart health concerns.",
    "Regular check-ups are important for monitoring your heart health.",
    "A healthy diet and regular exercise are key factors in maintaining good heart health.",
    "If you're experiencing chest pain or discomfort, please seek medical attention immediately.",
    "Monitoring your blood pressure regularly can help detect potential heart issues early.",
    "It's important to maintain a healthy lifestyle to reduce your risk of heart disease."
]

def load_model():
    global model, tokenizer, pipe
    
    try:
        print("Loading chatbot model...")
        # Try to load tokenizer from local folder
        tokenizer = AutoTokenizer.from_pretrained(CHATBOT_DIR)
        print("Tokenizer loaded successfully")
        
        # For this simplified version, we'll use a rule-based response system
        # instead of loading the heavy model which may cause errors
        print("Using template-based responses instead of full model loading")
        return True
        
    except Exception as e:
        print(f"Error loading chatbot model: {str(e)}")
        return False

@chatbot_bp.route('/chat', methods=['POST'])
def chat():
    global pipe, model, tokenizer
    
    try:
        data = request.json
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({"error": "Empty message"}), 400
        
        # Determine if the query is heart-related
        heart_related_keywords = [
            'heart', 'cardiac', 'ecg', 'ekg', 'cardiovascular', 'chest pain',
            'arrhythmia', 'palpitations', 'blood pressure', 'cholesterol',
            'hypertension', 'stroke', 'attack', 'failure', 'health', 'exercise', 
            'diet', 'lifestyle', 'risk', 'symptom', 'diagnosis'
        ]
        
        is_heart_related = any(keyword in user_message.lower() for keyword in heart_related_keywords)
        
        # Generate a response based on the input
        if is_heart_related:
            # Select an appropriate response template based on the input
            if 'chest pain' in user_message.lower() or 'discomfort' in user_message.lower():
                response = "If you're experiencing chest pain or discomfort, please seek medical attention immediately. This could be a sign of a serious condition."
            elif 'exercise' in user_message.lower() or 'activity' in user_message.lower():
                response = "Regular physical activity is excellent for heart health. Aim for at least 150 minutes of moderate exercise each week, but always consult with your doctor before starting a new exercise program."
            elif 'diet' in user_message.lower() or 'food' in user_message.lower() or 'eat' in user_message.lower():
                response = "A heart-healthy diet includes plenty of fruits, vegetables, whole grains, lean proteins, and healthy fats. Limiting sodium, processed foods, and saturated fats can help reduce heart disease risk."
            elif 'blood pressure' in user_message.lower() or 'hypertension' in user_message.lower():
                response = "Maintaining healthy blood pressure is crucial for heart health. Regular monitoring, medication if prescribed, reducing sodium intake, staying physically active, and managing stress can all help control blood pressure."
            elif 'cholesterol' in user_message.lower() or 'lipids' in user_message.lower():
                response = "High cholesterol can increase your risk of heart disease. A heart-healthy diet, regular exercise, and sometimes medication can help manage cholesterol levels. Regular check-ups can monitor your progress."
            elif 'risk' in user_message.lower() or 'prevention' in user_message.lower():
                response = "Key factors for heart disease prevention include not smoking, maintaining a healthy weight, regular exercise, healthy diet, limiting alcohol, managing stress, and regular health check-ups."
            elif any(word in user_message.lower() for word in ['ecg', 'ekg', 'electrocardiogram']):
                response = "An ECG or EKG (electrocardiogram) is a test that records the electrical activity of your heart. It helps doctors detect irregularities in heart rhythm and structure. It's a common, non-invasive diagnostic tool."
            elif 'failure' in user_message.lower():
                response = "Heart failure is a condition where the heart can't pump blood effectively. Symptoms may include shortness of breath, fatigue, and swelling. Early detection through regular check-ups and prompt treatment are essential."
            else:
                import random
                response = random.choice(FALLBACK_TEMPLATES)
        else:
            response = "I'm an assistant focused on heart health topics. Could you please ask a question related to heart health, ECG analysis, or cardiovascular wellness?"
            
        return jsonify({"response": response})
        
    except Exception as e:
        print(f"Error in chatbot: {str(e)}")
        return jsonify({"response": "I'm having trouble processing your request right now. Please try asking about heart health in a different way."}), 200

# Health check endpoint for the chatbot service
@chatbot_bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "Healthy", "service": "ECG Chatbot"})

