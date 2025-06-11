export type FormData = {
  heartDisease: 'Yes' | 'No';
  bmi: number;
  smoking: 'Yes' | 'No';
  alcoholDrinking: 'Yes' | 'No';
  stroke: 'Yes' | 'No';
  physicalHealth: number;
  mentalHealth: number;
  diffWalking: 'Yes' | 'No';
  sex: 'Male' | 'Female';
  ageCategory: string;
  race: string;
  diabetic: 'Yes' | 'No';
  physicalActivity: 'Yes' | 'No';
  genHealth: 'Excellent' | 'Very Good' | 'Good' | 'Fair' | 'Poor';
  sleepTime: number;
  asthma: 'Yes' | 'No';
  kidneyDisease: 'Yes' | 'No';
  skinCancer: 'Yes' | 'No';
};

export type ExtendedProfile = {
  id: string;
  full_name: string | null;
  date_of_birth: string | null;
  gender: 'Male' | 'Female' | 'Other' | null;
  phone_number: string | null;
  created_at: string;
  updated_at: string;
};

export type Prediction = {
  id: string;
  user_id: string;
  prediction_result: boolean;
  prediction_date: string;
  bmi: number;
  smoking: boolean;
  alcohol_drinking: boolean;
  stroke: boolean;
  physical_health: number;
  mental_health: number;
  diff_walking: boolean;
  sex: string;
  age_category: string;
  race: string;
  diabetic: boolean;
  physical_activity: boolean;
  gen_health: string;
  sleep_time: number;
  asthma: boolean;
  kidney_disease: boolean;
  skin_cancer: boolean;
};

export const AGE_CATEGORIES = [
  '18-24', '25-29', '30-34', '35-39', '40-44', '45-49',
  '50-54', '55-59', '60-64', '65-69', '70-74', '75-79', '80+'
];

export const RACE_CATEGORIES = [
  'White', 'Black', 'Asian', 'Hispanic', 'American Indian/Alaskan Native',
  'Other'
];