import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const API_URL = 'http://127.0.0.1:49232';

interface ECGPredictionResponse {
  prediction: string;
  confidence: number;
  ecgData: number[];
}

interface ErrorResponse {
  error: string;
}

const ECGPrediction: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [prediction, setPrediction] = useState<string>('');
  const [confidence, setConfidence] = useState<number>(0);
  const [ecgData, setEcgData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showInfo, setShowInfo] = useState<boolean>(false);

  // التحقق من حالة الخادم عند تحميل الصفحة
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        console.log(`Checking server status at ${API_URL}`);
        const response = await fetch(`${API_URL}/`, { 
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          }
        });
        console.log(`Server response status: ${response.status}`);
        
        if (response.ok) {
          setServerStatus('online');
          toast.success('تم الاتصال بالخادم بنجاح');
        } else {
          setServerStatus('offline');
          toast.error('فشل الاتصال بالخادم');
        }
      } catch (error) {
        console.error('Server connection error:', error);
        setServerStatus('offline');
        toast.error('لا يمكن الاتصال بالخادم');
      }
    };

    checkServerStatus();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const selectedFile = event.target.files[0];
      console.log(`Selected file: ${selectedFile.name}, type: ${selectedFile.type}, size: ${selectedFile.size} bytes`);
      setFile(selectedFile);
      setErrorDetails(null); // مسح الأخطاء السابقة
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setErrorDetails(null);
    
    if (!file) {
      toast.error('الرجاء اختيار ملف');
      return;
    }

    setIsLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      console.log(`Sending request to ${API_URL}/predict-ecg with file: ${file.name}`);
      
      const response = await fetch(`${API_URL}/predict-ecg`, {
        method: 'POST',
        body: formData,
      });

      console.log(`Response status: ${response.status}`);
      
      const responseData = await response.text();
      console.log(`Raw response data: ${responseData}`);
      
      if (!response.ok) {
        // محاولة تحليل نص الخطأ كـ JSON إذا كان ذلك ممكنًا
        try {
          const errorResponse = JSON.parse(responseData) as ErrorResponse;
          throw new Error(`فشل في التنبؤ (${response.status}): ${errorResponse.error}`);
        } catch (parseError) {
          // إذا فشل التحليل، استخدم النص الخام
          throw new Error(`فشل في التنبؤ (${response.status}): ${responseData}`);
        }
      }

      // تحليل JSON
      const data = JSON.parse(responseData) as ECGPredictionResponse;
      
      setPrediction(data.prediction);
      setConfidence(data.confidence);
      setEcgData(data.ecgData);
      toast.success('تم التنبؤ بنجاح!');
    } catch (error) {
      console.error('Prediction error:', error);
      const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف';
      setErrorDetails(errorMessage);
      toast.error(`حدث خطأ أثناء التنبؤ`);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = ecgData.map((value, index) => ({
    time: index,
    value: value
  }));

  const toggleInfo = () => {
    setShowInfo(!showInfo);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">تحليل مخطط القلب الكهربائي (ECG)</h1>
      
      <div className="mb-6 flex justify-center">
        <img src="/ECG.jpg" alt="مخطط ECG" className="max-h-64 rounded-lg shadow-lg" />
      </div>

      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6 border-b">
          <button 
            onClick={toggleInfo}
            className="flex items-center justify-between w-full text-lg font-semibold text-right"
          >
            <span>ما هو مخطط القلب الكهربائي (ECG)؟</span>
            <span className="text-xl">{showInfo ? '▲' : '▼'}</span>
          </button>
        </div>

        {showInfo && (
          <div className="p-6 bg-blue-50">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-xl font-bold mb-3 text-blue-800">تعريف مخطط القلب الكهربائي</h3>
                <p className="text-gray-700 mb-4">
                  مخطط القلب الكهربائي (ECG أو EKG) هو اختبار يقيس النشاط الكهربائي للقلب. يسجل هذا النشاط على شكل موجات ويظهر على الرسم البياني كيفية انتقال النبضات الكهربائية عبر القلب.
                </p>
                <p className="text-gray-700 mb-4">
                  يساعد مخطط القلب في الكشف عن مجموعة متنوعة من المشاكل القلبية مثل:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 pr-4">
                  <li>عدم انتظام ضربات القلب (اضطرابات النظم)</li>
                  <li>نوبات قلبية سابقة</li>
                  <li>مشاكل تدفق الدم إلى عضلة القلب</li>
                  <li>تضخم عضلة القلب</li>
                  <li>خلل في صمامات القلب</li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3 text-blue-800">كيف يعمل الذكاء الاصطناعي في تحليل ECG</h3>
                <p className="text-gray-700 mb-4">
                  يمكن للخوارزميات المتقدمة للذكاء الاصطناعي تحليل موجات ECG واكتشاف أنماط قد تفوتها العين البشرية. يمكنها:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 pr-4">
                  <li>التنبؤ بخطر الإصابة بالرجفان الأذيني</li>
                  <li>اكتشاف علامات احتشاء عضلة القلب</li>
                  <li>تحديد حالات القلب الشاذة</li>
                  <li>تقديم تشخيصات بدقة تضاهي الأطباء المتخصصين</li>
                </ul>
                <p className="text-gray-700 font-semibold">
                  نظامنا يستخدم تقنيات التعلم العميق لتحليل مخططات ECG وتصنيفها إلى فئات متعددة من الحالات القلبية بدقة عالية.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-xl mx-auto bg-white rounded-lg shadow-md p-6">
        {serverStatus === 'checking' && (
          <p className="text-center text-yellow-600 mb-4">جاري التحقق من الاتصال بالخادم...</p>
        )}
        
        {serverStatus === 'offline' && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            <p className="font-bold">تنبيه!</p>
            <p>تعذر الاتصال بالخادم. تأكد من تشغيل خادم Flask على المنفذ 49232.</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              اختر ملف ECG (.csv)
            </label>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="text-xs text-gray-500 space-y-1">
              <p>قم بتحميل أحد ملفات CSV الاختبارية من المجلد: backend/ECG model</p>
              <p className="font-medium text-blue-600">تنسيق الملف المتوقع:</p>
              <ul className="list-disc list-inside pl-2">
                <li>يجب أن يحتوي الملف على بيانات رقمية</li>
                <li>القيم يجب أن تكون مفصولة بفواصل (,)</li>
                <li>مثال لبداية محتوى ملف CSV صحيح: 0.1,0.2,0.3,0.5...</li>
              </ul>
              <p className="font-medium text-teal-600 mt-1">ملاحظة هامة: النظام يحاول تلقائياً تحويل أي ملف CSV إلى التنسيق المناسب.</p>
            </div>
            {file && (
              <p className="text-xs text-green-600">
                تم اختيار الملف: {file.name} (الحجم: {(file.size / 1024).toFixed(2)} كيلوبايت)
              </p>
            )}
          </div>
          
          <button
            type="submit"
            disabled={isLoading || serverStatus !== 'online'}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
          >
            {isLoading ? 'جاري التحليل...' : 'تحليل ECG'}
          </button>
        </form>

        {errorDetails && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-800">
            <h3 className="font-bold text-red-600 mb-1">تفاصيل الخطأ:</h3>
            <pre className="text-xs overflow-auto whitespace-pre-wrap">{errorDetails}</pre>
            <p className="mt-2 text-sm">حلول مقترحة:</p>
            <ul className="list-disc list-inside text-sm">
              <li>تأكد من اختيار ملف CSV بالتنسيق الصحيح</li>
              <li>استخدم أحد ملفات الاختبار المزودة مع المشروع</li>
              <li>حاول معالجة الملف يدويًا بواسطة الأمر:
                <code className="block bg-gray-800 text-white p-1 mt-1 rounded text-xs">
                  cd backend<br />
                  python csv_converter.py "مسار/إلى/الملف.csv"
                </code>
              </li>
              <li>
                إذا استمرت المشكلة، افتح ملف CSV في محرر نصوص وتأكد من وجود أرقام مفصولة بفواصل
              </li>
            </ul>
          </div>
        )}

        {prediction && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-gray-50 rounded-md">
              <h2 className="text-xl font-semibold mb-2">النتيجة:</h2>
              <p className="text-lg">{prediction}</p>
              <p className="text-sm text-gray-600">نسبة الثقة: {(confidence * 100).toFixed(2)}%</p>
            </div>

            {ecgData.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-2">مخطط ECG:</h3>
                <div className="overflow-x-auto">
                  <LineChart width={600} height={300} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
                  </LineChart>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="max-w-4xl mx-auto mt-10 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 bg-blue-800 text-white">
          <h2 className="text-2xl font-bold">تفسير نتائج تحليل ECG</h2>
        </div>
        <div className="p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-800">الحالات الطبيعية</h3>
              <p className="text-gray-700 mb-3">
                القلب السليم يظهر نمطًا منتظمًا مع موجات PQRST واضحة ومتسقة:
              </p>
              <ul className="list-disc list-inside text-gray-700 pr-4">
                <li>موجة P: انتشار كهربائي من العقدة الجيبية الأذينية عبر الأذينين</li>
                <li>مركب QRS: انتشار كهربائي عبر البطينين</li>
                <li>موجة T: استرخاء عضلة القلب البطينية</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3 text-blue-800">الحالات الشاذة الشائعة</h3>
              <ul className="list-disc list-inside text-gray-700 pr-4">
                <li><span className="font-medium">عدم انتظام ضربات القلب</span>: أنماط غير منتظمة في إيقاع القلب</li>
                <li><span className="font-medium">احتشاء عضلة القلب</span>: تغيرات في قطعة ST وموجة T</li>
                <li><span className="font-medium">تضخم البطين الأيسر</span>: زيادة في سعة موجة R</li>
                <li><span className="font-medium">حصار القلب</span>: تأخير أو انقطاع في توصيل الإشارات الكهربائية</li>
              </ul>
            </div>
          </div>
          <div className="mt-6 p-4 bg-yellow-50 border-r-4 border-yellow-400 rounded">
            <p className="font-bold text-yellow-800">ملاحظة هامة:</p>
            <p className="text-gray-700">هذا النظام مخصص للأغراض التعليمية والبحثية فقط. يجب دائمًا استشارة أخصائي الرعاية الصحية للحصول على تشخيص طبي دقيق.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ECGPrediction; 