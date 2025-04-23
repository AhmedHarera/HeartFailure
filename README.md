# HeartGuard AI: Heart Failure Prediction System

## 🫀 Project Overview
HeartGuard AI is a full-stack web application designed to predict heart failure risk using advanced machine learning techniques. The system also provides ECG signal analysis capability to detect cardiac abnormalities.

## 🛠 Tech Stack
- **Frontend**: React, TypeScript, Vite, TailwindCSS, Recharts
- **Backend**: Python Flask
- **Machine Learning**: scikit-learn, TensorFlow, Keras
- **Database**: Supabase
- **State Management**: Zustand

## 📋 Prerequisites
- Python 3.9+
- Node.js 18+
- npm 9+
- Git

## 🚀 Installation and Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/heartguard-ai.git
cd heartguard-ai
```

### 2. Backend Setup
#### Create Virtual Environment
```bash
# Windows
python -m venv backend_venv
backend_venv\Scripts\activate

# macOS/Linux
python3 -m venv backend_venv
source backend_venv/bin/activate
```

#### Install Backend Dependencies
```bash
cd backend
pip install -r requirements.txt
```

#### Set Up Environment Variables
Create a `.env` file in the backend directory with:
```
FLASK_ENV=development
CORS_ORIGINS=http://localhost:5173,http://localhost:5176
```

### 3. Frontend Setup
```bash
cd ../project
npm install
```

### 4. Machine Learning Models
- Ensure `heart_failure_model.pkl` is in the backend directory
- Verify label encoders and scalers are correctly configured
- Make sure the ECG model `ECG_Heart Failure Project_best_model_cnn_lstm.keras` is in the `backend/ECG model` directory

### 5. Running the Application

#### Start Backend (Flask)
```bash
# In backend directory
python app.py
```

#### Start Frontend (Vite)
```bash
# In project directory
npm run dev
```

## 🔍 Access Points
- Frontend: `http://localhost:5176`
- Backend API: `http://127.0.0.1:49232`

## 📊 Features

### Heart Failure Risk Assessment
- Input patient medical data
- Receive risk assessment based on multiple factors
- View detailed analysis of risk factors

### ECG Analysis
- Upload ECG readings in CSV format
- Automatic analysis of ECG patterns
- Classification into five categories:
  - Normal
  - Atrial Premature
  - Premature Ventricular Contraction
  - Fusion of Ventricular and Normal
  - Fusion of Paced and Normal
- Visualization of ECG waveform using Recharts

### CSV File Format for ECG
The system accepts CSV files with ECG data in the following format:
- Values should be comma-separated
- Numeric values representing the ECG signal amplitude
- Example: `0.1,0.2,0.3,0.4,0.5,0.6,0.7,0.8,0.9,1.0`
- The system automatically converts and processes various CSV formats

## 🧪 Testing
```bash
# Backend tests
python -m pytest

# Frontend tests
npm test
```

## 🔒 Security Notes
- Never commit sensitive information
- Use environment variables for configurations
- Regularly update dependencies

## 📄 License
[Your License Here]

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 💡 Troubleshooting
- Ensure all dependencies are installed
- Check Python and Node.js versions
- Verify environment variables
- Restart services if encountering connection issues
- For ECG analysis issues, try using the example files in `backend/ECG model` directory

## 📞 Support
For issues or questions, please open a GitHub issue or contact support@heartguardai.com
