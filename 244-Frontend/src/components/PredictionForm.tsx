import React, { useState } from 'react';
import { 
  Heart, 
  User, 
  Activity, 
  Wine, 
  Cigarette, 
  Moon, 
  Scale, 
  Info,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Download,
  ArrowLeft
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import type { FormData } from '../types';
import { AGE_CATEGORIES, RACE_CATEGORIES, DIABETIC_OPTIONS, GEN_HEALTH_OPTIONS } from '../types';
import { savePrediction } from '../services/predictionService';
import SelectField from './form/SelectField';
import NumberField from './form/NumberField';
import toast from 'react-hot-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface RiskFactor {
  factor: string;
  status: string;
  risk: 'high' | 'medium' | 'low';
}

const PredictionForm: React.FC = () => {
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    BMI: 25,
    Smoking: 'No',
    AlcoholDrinking: 'No',
    Stroke: 'No',
    PhysicalHealth: 0,
    MentalHealth: 0,
    DiffWalking: 'No',
    Sex: 'Male',
    AgeCategory: '18-24',
    Race: 'White',
    Diabetic: 'No',
    PhysicalActivity: 'Yes',
    GenHealth: 'Very good',
    SleepTime: 7,
    Asthma: 'No',
    KidneyDisease: 'No',
    SkinCancer: 'No'
  });

  const [prediction, setPrediction] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPrediction, setShowPrediction] = useState(false);
  const [riskFactors, setRiskFactors] = useState<RiskFactor[]>([]);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const resultsRef = React.useRef<HTMLDivElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: e.target.type === 'number' ? Number(value) : value
    }));
  };

  const analyzeRiskFactors = (data: FormData): RiskFactor[] => {
    const factors: RiskFactor[] = [];

    // BMI Analysis
    if (data.BMI >= 30) {
      factors.push({ factor: 'BMI', status: 'Obese', risk: 'high' });
    } else if (data.BMI >= 25) {
      factors.push({ factor: 'BMI', status: 'Overweight', risk: 'medium' });
    }

    // Physical Health Analysis
    if (data.PhysicalHealth >= 15) {
      factors.push({ 
        factor: 'Physical Health', 
        status: 'Poor physical health for more than 2 weeks', 
        risk: 'high' 
      });
    }

    // Mental Health Analysis
    if (data.MentalHealth >= 15) {
      factors.push({ 
        factor: 'Mental Health', 
        status: 'Poor mental health for more than 2 weeks', 
        risk: 'medium' 
      });
    }

    // Sleep Analysis
    if (data.SleepTime < 6) {
      factors.push({ 
        factor: 'Sleep', 
        status: 'Insufficient sleep', 
        risk: 'medium' 
      });
    } else if (data.SleepTime > 9) {
      factors.push({ 
        factor: 'Sleep', 
        status: 'Excessive sleep', 
        risk: 'medium' 
      });
    }

    // Lifestyle Analysis
    if (data.Smoking === 'Yes') {
      factors.push({ factor: 'Smoking', status: 'Active smoker', risk: 'high' });
    }
    if (data.AlcoholDrinking === 'Yes') {
      factors.push({ factor: 'Alcohol', status: 'Regular drinker', risk: 'medium' });
    }
    if (data.PhysicalActivity === 'No') {
      factors.push({ factor: 'Physical Activity', status: 'Sedentary lifestyle', risk: 'high' });
    }

    // Medical Conditions
    if (data.Stroke === 'Yes') {
      factors.push({ factor: 'Stroke', status: 'Previous stroke history', risk: 'high' });
    }
    if (data.DiffWalking === 'Yes') {
      factors.push({ factor: 'Mobility', status: 'Difficulty walking', risk: 'medium' });
    }
    if (data.Diabetic === 'Yes') {
      factors.push({ factor: 'Diabetes', status: 'Diabetic', risk: 'high' });
    }

    return factors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please log in to make predictions');
      return;
    }

    setLoading(true);
    setError(null);
    setPrediction(null);
    setShowPrediction(false);
    setIsSubmitted(true);
    
    try {
      const response = await fetch("http://127.0.0.1:49232/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        const predictionResult = data.HeartFailureRisk;
        setPrediction(predictionResult);
        setRiskFactors(analyzeRiskFactors(formData));
        
        const savedPrediction = await savePrediction(
          user.id,
          formData,
          predictionResult
        );

        if (savedPrediction) {
          toast.success('Prediction completed and saved successfully');
        } else {
          toast.error('Prediction completed but failed to save');
        }
      } else {
        const errorMessage = data.error || 'An error occurred while making the prediction';
        setError(errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'Network error: Could not connect to the prediction service';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Network error:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAsPDF = async () => {
    if (!resultsRef.current) return;

    try {
      const canvas = await html2canvas(resultsRef.current);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });

      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('heart-health-analysis.pdf');
      
      toast.success('Report downloaded successfully');
    } catch (error) {
      toast.error('Failed to download report');
      console.error('PDF generation error:', error);
    }
  };

  const Tooltip = ({ text }: { text: string }) => (
    <div className="group relative inline-block ml-2">
      <Info className="h-4 w-4 text-blue-500 cursor-help" />
      <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-sm rounded-md p-2 absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48">
        {text}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-gray-800"></div>
      </div>
    </div>
  );

  const nextStep = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    setCurrentStep((prev) => Math.min(prev + 1, formSteps.length - 1));
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const formSteps = [
    {
      title: 'Demographics',
      icon: <User className="mr-2 text-blue-400" />,
      content: (
        <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-gray-800 mb-4">Personal Information</h3>
          <SelectField
            label="Sex"
            name="Sex"
            value={formData.Sex}
            onChange={handleInputChange}
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' }
            ]}
          />
          <SelectField
            label="Age Category"
            name="AgeCategory"
            value={formData.AgeCategory}
            onChange={handleInputChange}
            options={AGE_CATEGORIES.map(age => ({ value: age, label: age }))}
          />
          <SelectField
            label="Race"
            name="Race"
            value={formData.Race}
            onChange={handleInputChange}
            options={RACE_CATEGORIES.map(race => ({ value: race, label: race }))}
          />
        </div>
      )
    },
    {
      title: 'Lifestyle Factors',
      icon: <Activity className="mr-2 text-blue-400" />,
      content: (
        <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-gray-800 mb-4">Lifestyle Habits</h3>
          <SelectField
            label={
              <div className="flex items-center">
                <Cigarette className="mr-2 text-gray-500 h-4 w-4" />
                Smoking
              </div>
            }
            name="Smoking"
            value={formData.Smoking}
            onChange={handleInputChange}
            options={[
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' }
            ]}
          />
          <SelectField
            label={
              <div className="flex items-center">
                <Wine className="mr-2 text-gray-500 h-4 w-4" />
                Alcohol Drinking
              </div>
            }
            name="AlcoholDrinking"
            value={formData.AlcoholDrinking}
            onChange={handleInputChange}
            options={[
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' }
            ]}
          />
          <SelectField
            label={
              <div className="flex items-center">
                <Activity className="mr-2 text-gray-500 h-4 w-4" />
                Physical Activity
              </div>
            }
            name="PhysicalActivity"
            value={formData.PhysicalActivity}
            onChange={handleInputChange}
            options={[
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' }
            ]}
          />
        </div>
      )
    },
    {
      title: 'Health Metrics',
      icon: <Scale className="mr-2 text-blue-400" />,
      content: (
        <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-gray-800 mb-4">Health Metrics</h3>
          <NumberField
            label={
              <div className="flex items-center">
                BMI
                <Tooltip text="Body Mass Index - weight in kg/(height in m)²" />
              </div>
            }
            name="BMI"
            value={formData.BMI}
            onChange={handleInputChange}
            min={10}
            max={60}
          />
          <NumberField
            label={
              <div className="flex items-center">
                Physical Health
                <Tooltip text="Number of days physical health was not good (0-30)" />
              </div>
            }
            name="PhysicalHealth"
            value={formData.PhysicalHealth}
            onChange={handleInputChange}
            min={0}
            max={30}
          />
          <NumberField
            label={
              <div className="flex items-center">
                Mental Health
                <Tooltip text="Number of days mental health was not good (0-30)" />
              </div>
            }
            name="MentalHealth"
            value={formData.MentalHealth}
            onChange={handleInputChange}
            min={0}
            max={30}
          />
          <NumberField
            label={
              <div className="flex items-center">
                <Moon className="mr-2 text-gray-500 h-4 w-4" />
                Sleep Time
                <Tooltip text="Average hours of sleep per 24 hours" />
              </div>
            }
            name="SleepTime"
            value={formData.SleepTime}
            onChange={handleInputChange}
            min={0}
            max={24}
          />
        </div>
      )
    },
    {
      title: 'Medical Conditions',
      icon: <AlertCircle className="mr-2 text-blue-400" />,
      content: (
        <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-gray-800 mb-4">Medical Conditions</h3>
          <SelectField
            label="Stroke History"
            name="Stroke"
            value={formData.Stroke}
            onChange={handleInputChange}
            options={[
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' }
            ]}
          />
          <SelectField
            label="Difficulty Walking"
            name="DiffWalking"
            value={formData.DiffWalking}
            onChange={handleInputChange}
            options={[
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' }
            ]}
          />
          <SelectField
            label="Diabetic"
            name="Diabetic"
            value={formData.Diabetic}
            onChange={handleInputChange}
            options={DIABETIC_OPTIONS.map(option => ({ value: option, label: option }))}
          />
          <SelectField
            label="Asthma"
            name="Asthma"
            value={formData.Asthma}
            onChange={handleInputChange}
            options={[
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' }
            ]}
          />
          <SelectField
            label="Kidney Disease"
            name="KidneyDisease"
            value={formData.KidneyDisease}
            onChange={handleInputChange}
            options={[
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' }
            ]}
          />
          <SelectField
            label="Skin Cancer"
            name="SkinCancer"
            value={formData.SkinCancer}
            onChange={handleInputChange}
            options={[
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' }
            ]}
          />
        </div>
      )
    },
    {
      title: 'Overall Health',
      icon: <Heart className={`mr-2 ${isSubmitted ? 'text-green-500' : 'text-blue-400'}`} />,
      content: (
        <div className="space-y-6 p-6 bg-white rounded-lg shadow-sm">
          <h3 className="text-xl font-medium text-gray-800 mb-4">Overall Health</h3>
          <SelectField
            label="General Health"
            name="GenHealth"
            value={formData.GenHealth}
            onChange={handleInputChange}
            options={GEN_HEALTH_OPTIONS.map(health => ({ value: health, label: health }))}
          />
        </div>
      )
    }
  ];

  const currentStepData = formSteps[currentStep];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-4">Heart Failure Risk Assessment</h1>
        <p className="text-gray-600 text-center">Complete all sections to receive your heart health analysis</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
            {error}
          </div>
        )}
        
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {formSteps.map((step, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentStep(index)}
                className={`flex flex-col items-center space-y-2 group ${
                  index === currentStep
                    ? 'text-blue-600'
                    : completedSteps.includes(index)
                    ? 'text-green-600'
                    : 'text-gray-400'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                  index === currentStep
                    ? 'border-blue-600 bg-blue-50'
                    : completedSteps.includes(index)
                    ? 'border-green-600 bg-green-50'
                    : 'border-gray-300'
                }`}>
                  {formSteps[index].icon}
                </div>
                <span className="text-sm font-medium">{step.title}</span>
              </button>
            ))}
          </div>
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / formSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Form Content */}
        <div className="min-h-[400px] transition-all duration-500">
          {currentStepData.content}
        </div>

        {/* Navigation - Moved back under the form */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg flex items-center gap-2 transition-all transform hover:scale-105 ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-300 hover:border-blue-500 hover:text-blue-500'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Previous</span>
            </button>

            {currentStep === formSteps.length - 1 ? (
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:hover:scale-100 font-medium shadow-md"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      Calculate Risk
                      <Heart className="w-5 h-5" />
                    </>
                  )}
                </button>
                {prediction && !showPrediction && (
                  <button
                    type="button"
                    onClick={() => setShowPrediction(true)}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 flex items-center gap-2 font-medium shadow-md"
                  >
                    View Results
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center gap-2 font-medium shadow-md"
              >
                <span className="font-medium">Next</span>
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Prediction Results Modal */}
        {showPrediction && prediction && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setShowPrediction(false)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-xl font-semibold text-gray-800">Your Heart Health Analysis</h2>
                <button
                  type="button"
                  onClick={downloadAsPDF}
                  className="text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1"
                >
                  <Download className="w-5 h-5" />
                </button>
              </div>

              <div ref={resultsRef} className="p-6">
                <div className={`p-4 rounded-lg mb-6 ${
                  prediction.includes('High') ? 'bg-red-50' : 'bg-green-50'
                }`}>
                  <h3 className="text-lg font-medium mb-2">Overall Risk Level</h3>
                  <p className={`text-xl font-bold ${
                    prediction.includes('High') ? 'text-red-700' : 'text-green-700'
                  }`}>
                    {prediction}
                  </p>
                </div>

                {riskFactors.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-800">Risk Factors Identified</h3>
                    {riskFactors.map((factor, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg border ${
                          factor.risk === 'high'
                            ? 'border-red-200 bg-red-50'
                            : factor.risk === 'medium'
                            ? 'border-yellow-200 bg-yellow-50'
                            : 'border-green-200 bg-green-50'
                        }`}
                      >
                        <h4 className="font-medium text-gray-800">{factor.factor}</h4>
                        <p className={`mt-1 ${
                          factor.risk === 'high'
                            ? 'text-red-700'
                            : factor.risk === 'medium'
                            ? 'text-yellow-700'
                            : 'text-green-700'
                        }`}>
                          {factor.status}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setShowPrediction(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Form
                </button>
                <button
                  type="button"
                  onClick={downloadAsPDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Download Report
                </button>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default PredictionForm;
