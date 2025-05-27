import React, { useState, useMemo } from 'react';
import { AlertCircle, ChevronLeft, Percent } from 'lucide-react';

const diseasePatterns = [
  {
    disease: 'Common Cold',
    symptoms: ['Fever', 'Cough', 'Runny nose', 'Sore throat', 'Congestion', 'Sneezing'],
    description: 'A viral infection of the upper respiratory tract.',
    suggestedActions: [
      'Rest and get adequate sleep',
      'Stay hydrated with water and warm liquids',
      'Use over-the-counter decongestants if needed',
      'Gargle with warm salt water for sore throat',
      'Monitor symptoms and seek medical attention if they worsen'
    ]
  },
  {
    disease: 'Influenza (Flu)',
    symptoms: ['High fever', 'Body aches', 'Fatigue', 'Cough', 'Headache', 'Chills', 'Sore throat'],
    description: 'A viral infection that attacks your respiratory system.',
    suggestedActions: [
      'Get plenty of rest',
      'Take antiviral medications if prescribed',
      'Stay home to prevent spreading',
      'Monitor fever and other symptoms',
      'Seek immediate care if breathing becomes difficult'
    ]
  },
  {
    disease: 'Migraine',
    symptoms: ['Severe headache', 'Nausea', 'Light sensitivity', 'Sound sensitivity', 'Vision changes', 'Dizziness'],
    description: 'A neurological condition causing severe headaches and other symptoms.',
    suggestedActions: [
      'Rest in a quiet, dark room',
      'Apply cold or warm compresses',
      'Take prescribed migraine medications',
      'Stay hydrated',
      'Keep a migraine diary to identify triggers'
    ]
  },
  {
    disease: 'Gastroenteritis',
    symptoms: ['Nausea', 'Vomiting', 'Diarrhea', 'Stomach pain', 'Fever', 'Loss of appetite'],
    description: 'An intestinal infection marked by diarrhea, cramps, nausea, vomiting, and fever.',
    suggestedActions: [
      'Stay hydrated with clear fluids',
      'Rest your stomach by eating bland foods',
      'Avoid dairy and fatty foods',
      'Use oral rehydration solutions',
      'Seek medical care if symptoms are severe'
    ]
  },
  {
    disease: 'Anxiety Disorder',
    symptoms: ['Excessive worry', 'Restlessness', 'Difficulty concentrating', 'Sleep problems', 'Heart palpitations', 'Sweating'],
    description: 'A mental health condition characterized by persistent worry and anxiety.',
    suggestedActions: [
      'Practice relaxation techniques',
      'Seek counseling or therapy',
      'Maintain regular exercise routine',
      'Get adequate sleep',
      'Consider medication if recommended by a professional'
    ]
  },
  {
    disease: 'Hypertension',
    symptoms: ['High blood pressure', 'Headache', 'Shortness of breath', 'Chest pain', 'Vision problems', 'Fatigue'],
    description: 'A condition where blood pressure against artery walls is consistently too high.',
    suggestedActions: [
      'Monitor blood pressure regularly',
      'Reduce sodium intake',
      'Exercise regularly',
      'Maintain healthy weight',
      'Take prescribed medications as directed'
    ]
  },
  {
    disease: 'Asthma',
    symptoms: ['Wheezing', 'Shortness of breath', 'Chest tightness', 'Coughing', 'Difficulty breathing', 'Fatigue'],
    description: 'A condition causing airways to narrow and swell, producing extra mucus.',
    suggestedActions: [
      'Use prescribed inhalers as directed',
      'Avoid known triggers',
      'Keep rescue inhaler nearby',
      'Follow asthma action plan',
      'Seek emergency care for severe attacks'
    ]
  },
  {
    disease: 'Depression',
    symptoms: ['Persistent sadness', 'Loss of interest', 'Sleep changes', 'Fatigue', 'Difficulty concentrating', 'Weight changes'],
    description: 'A mental health disorder characterized by persistently depressed mood.',
    suggestedActions: [
      'Seek professional help',
      'Maintain regular daily routine',
      'Exercise regularly',
      'Stay connected with support system',
      'Consider therapy or counseling'
    ]
  },
  {
    disease: 'Diabetes Type 2',
    symptoms: ['Increased thirst', 'Frequent urination', 'Increased hunger', 'Fatigue', 'Blurred vision', 'Slow healing'],
    description: 'A chronic condition affecting how your body metabolizes glucose.',
    suggestedActions: [
      'Monitor blood sugar regularly',
      'Follow prescribed medication routine',
      'Maintain healthy diet',
      'Exercise regularly',
      'Check feet daily for wounds'
    ]
  },
  {
    disease: 'Arthritis',
    symptoms: ['Joint pain', 'Joint stiffness', 'Swelling', 'Reduced range of motion', 'Redness', 'Fatigue'],
    description: 'Inflammation of one or more joints, causing pain and stiffness.',
    suggestedActions: [
      'Exercise regularly with low-impact activities',
      'Apply hot/cold therapy',
      'Maintain healthy weight',
      'Use prescribed medications',
      'Consider physical therapy'
    ]
  }
];

const allSymptoms = Array.from(
  new Set(
    diseasePatterns.flatMap(pattern => pattern.symptoms)
  )
).sort();

function App() {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<Array<{
    disease: string;
    confidence: number;
    description: string;
    suggestedActions: string[];
  }>>([]);

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const calculateMatchPercentage = (patternSymptoms: string[]): number => {
    if (selectedSymptoms.length === 0) return 0;
    const matchingSymptoms = patternSymptoms.filter(s => selectedSymptoms.includes(s));
    const totalSelectedSymptoms = selectedSymptoms.length;
    const totalPatternSymptoms = patternSymptoms.length;
    const matchRatioFromPattern = (matchingSymptoms.length / totalPatternSymptoms) * 100;
    const matchRatioFromSelected = (matchingSymptoms.length / totalSelectedSymptoms) * 100;
    return (matchRatioFromPattern + matchRatioFromSelected) / 2;
  };

  const handlePredict = () => {
    if (selectedSymptoms.length === 0) {
      alert('Please select at least one symptom');
      return;
    }
    const newPredictions = diseasePatterns
      .map(pattern => ({
        disease: pattern.disease,
        confidence: calculateMatchPercentage(pattern.symptoms),
        description: pattern.description,
        suggestedActions: pattern.suggestedActions
      }))
      .filter(pred => pred.confidence > 0)
      .sort((a, b) => b.confidence - a.confidence);
    setPredictions(newPredictions.length > 0 ? newPredictions : []);
  };

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat p-4 md:p-8" 
      style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80")'
      }}
    >
      <div className="max-w-5xl mx-auto">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Symptom-Based Disease Prediction</h2>
          <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-6 shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
              {allSymptoms.map(symptom => (
                <button 
                  key={symptom} 
                  onClick={() => handleSymptomToggle(symptom)} 
                  className={`p-3 rounded-lg transition-all transform hover:-translate-y-1 ${
                    selectedSymptoms.includes(symptom) 
                      ? 'bg-blue-500 text-white shadow-lg' 
                      : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {symptom}
                </button>
              ))}
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Selected symptoms: {selectedSymptoms.length}</span>
                {selectedSymptoms.length > 0 && (
                  <button 
                    onClick={() => setSelectedSymptoms([])} 
                    className="text-red-500 hover:text-red-600 text-sm"
                  >
                    Clear all
                  </button>
                )}
              </div>
              <button 
                onClick={handlePredict} 
                className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={selectedSymptoms.length === 0}
              >
                Analyze Symptoms
              </button>
            </div>
          </div>

          {predictions.length > 0 && (
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-6 shadow-xl space-y-4">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Potential Conditions</h3>
              {predictions.map((pred, index) => (
                <div key={index} className="border-b border-gray-200 last:border-0 pb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-semibold text-gray-800">{pred.disease}</h4>
                    <div className="flex items-center space-x-1">
                      <Percent className="w-4 h-4 text-blue-600" />
                      <span className="text-lg font-bold text-blue-600">{Math.round(pred.confidence)}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{pred.description}</p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2 text-blue-700">
                      <AlertCircle className="w-5 h-5" />
                      <h5 className="font-semibold">Suggested Actions:</h5>
                    </div>
                    <ul className="list-disc list-inside space-y-2 text-blue-600">
                      {pred.suggestedActions.map((action, idx) => (
                        <li key={idx} className="text-sm">{action}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-yellow-800 text-sm">
                  Note: This is a preliminary analysis based on symptoms only. Please consult with a healthcare professional for accurate diagnosis.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;