import React, { useState, useRef } from 'react';
import { FileText, Printer, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface Prescription {
  prescriptionId: string;
  date: string;
  patientName: string;
  patientAge: string;
  gender: 'male' | 'female' | 'other' | '';
  weight: string;
  bloodPressure: string;
  allergies: string;
  diagnosis: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  beforeAfterFood: 'before' | 'after' | 'with' | '';
  specialInstructions: string;
  doctorNotes: string;
}

function App() {
  const prescriptionRef = useRef<HTMLDivElement>(null);
  const [prescription, setPrescription] = useState<Prescription>({
    prescriptionId: `RX${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    patientName: '',
    patientAge: '',
    gender: '',
    weight: '',
    bloodPressure: '',
    allergies: '',
    diagnosis: '',
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    beforeAfterFood: '',
    specialInstructions: '',
    doctorNotes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPrescription(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = async () => {
    if (prescriptionRef.current) {
      const canvas = await html2canvas(prescriptionRef.current, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const width = pdf.internal.pageSize.getWidth();
      const height = (canvas.height * width) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, width, height);
      pdf.save(`prescription-${prescription.prescriptionId}.pdf`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Form Section */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Prescription Generator</h1>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Printer className="h-5 w-5" />
                Print
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Download className="h-5 w-5" />
                Download PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Patient Name
              </label>
              <input
                type="text"
                name="patientName"
                value={prescription.patientName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter patient name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="text"
                name="patientAge"
                value={prescription.patientAge}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter age"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={prescription.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (kg)
              </label>
              <input
                type="text"
                name="weight"
                value={prescription.weight}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter weight"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Pressure
              </label>
              <input
                type="text"
                name="bloodPressure"
                value={prescription.bloodPressure}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 120/80"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allergies
              </label>
              <input
                type="text"
                name="allergies"
                value={prescription.allergies}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter allergies"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Diagnosis
              </label>
              <input
                type="text"
                name="diagnosis"
                value={prescription.diagnosis}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter diagnosis"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medication
              </label>
              <input
                type="text"
                name="medication"
                value={prescription.medication}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter medication"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dosage
              </label>
              <input
                type="text"
                name="dosage"
                value={prescription.dosage}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 500mg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Frequency
              </label>
              <input
                type="text"
                name="frequency"
                value={prescription.frequency}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Twice daily"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={prescription.duration}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 7 days"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Take Medicine
              </label>
              <select
                name="beforeAfterFood"
                value={prescription.beforeAfterFood}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select when to take</option>
                <option value="before">Before food</option>
                <option value="after">After food</option>
                <option value="with">With food</option>
              </select>
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                name="specialInstructions"
                value={prescription.specialInstructions}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter special instructions"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doctor's Notes
              </label>
              <textarea
                name="doctorNotes"
                value={prescription.doctorNotes}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter additional notes"
              />
            </div>
          </div>
        </div>

        {/* Preview Section - Traditional Prescription Layout */}
        <div ref={prescriptionRef} className="bg-white rounded-xl shadow-lg p-8 mb-8 min-h-[1056px] w-[816px] mx-auto print:shadow-none">
          <div className="border-2 border-gray-800 p-8 min-h-full">
            <div className="text-center border-b-2 border-gray-800 pb-4 mb-8">
              <h1 className="text-3xl font-bold">Patient Prescription</h1>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between">
                <p><strong>Date:</strong> {new Date(prescription.date).toLocaleDateString()}</p>
                <p><strong>Prescription ID:</strong> {prescription.prescriptionId}</p>
              </div>

              <div className="border-b border-gray-300 pb-4">
                <h2 className="font-bold mb-2">Patient Information</h2>
                <p>Name: {prescription.patientName || '[Patient Name]'}</p>
                <p>Age: {prescription.patientAge || '[Age]'} years | Gender: {prescription.gender || '[Gender]'}</p>
                <p>Weight: {prescription.weight || '[Weight]'} kg | BP: {prescription.bloodPressure || '[BP]'}</p>
                {prescription.allergies && <p>Allergies: {prescription.allergies}</p>}
              </div>

              <div className="border-b border-gray-300 pb-4">
                <h2 className="font-bold mb-2">Diagnosis</h2>
                <p>{prescription.diagnosis || '[Diagnosis]'}</p>
              </div>

              <div className="border-b border-gray-300 pb-4">
                <h2 className="font-bold mb-2">Prescription</h2>
                <div className="pl-4">
                  <p className="mb-2">
                    <strong>Medication:</strong> {prescription.medication || '[Medication]'}
                  </p>
                  <p className="mb-2">
                    <strong>Dosage:</strong> {prescription.dosage || '[Dosage]'}
                  </p>
                  <p className="mb-2">
                    <strong>Frequency:</strong> {prescription.frequency || '[Frequency]'}
                  </p>
                  <p className="mb-2">
                    <strong>Duration:</strong> {prescription.duration || '[Duration]'}
                  </p>
                  <p className="mb-2">
                    <strong>Take:</strong> {prescription.beforeAfterFood ? `${prescription.beforeAfterFood} food` : '[When to take]'}
                  </p>
                </div>
              </div>

              {(prescription.specialInstructions || prescription.doctorNotes) && (
                <div>
                  {prescription.specialInstructions && (
                    <div className="mb-4">
                      <h2 className="font-bold mb-2">Special Instructions</h2>
                      <p>{prescription.specialInstructions}</p>
                    </div>
                  )}
                  {prescription.doctorNotes && (
                    <div>
                      <h2 className="font-bold mb-2">Doctor's Notes</h2>
                      <p>{prescription.doctorNotes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;