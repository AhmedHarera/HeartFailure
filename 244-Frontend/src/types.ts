export interface FormData {
  BMI: number;
  Smoking: string;
  AlcoholDrinking: string;
  Stroke: string;
  PhysicalHealth: number;
  MentalHealth: number;
  DiffWalking: string;
  Sex: string;
  AgeCategory: string;
  Race: string;
  Diabetic: string;
  PhysicalActivity: string;
  GenHealth: string;
  SleepTime: number;
  Asthma: string;
  KidneyDisease: string;
  SkinCancer: string;
}

export interface PredictionRecord {
  id: string;
  user_id: string;
  prediction_data: FormData;
  prediction_result: string;
  created_at: string;
}

export interface UserStats {
  total_predictions: number;
  high_risk_predictions: number;
  low_risk_predictions: number;
  last_prediction_date: string;
}

export interface SystemStats {
  total_users: number;
  total_predictions: number;
  accuracy_rate: number;
  lives_impacted: number;
}

export const AGE_CATEGORIES = [
  '18-24', '25-29', '30-34', '35-39', '40-44', '45-49', '50-54',
  '55-59', '60-64', '65-69', '70-74', '75-79', '80 or older'
];

export const RACE_CATEGORIES = [
  'White', 'Black', 'Asian', 'American Indian/Alaskan Native',
  'Other', 'Hispanic'
];

export const DIABETIC_OPTIONS = [
  'No',
  'Yes',
  'No, borderline diabetes',
  'Yes (during pregnancy)'
];

export const GEN_HEALTH_OPTIONS = [
  'Very good',
  'Fair',
  'Good',
  'Poor',
  'Excellent'
];
