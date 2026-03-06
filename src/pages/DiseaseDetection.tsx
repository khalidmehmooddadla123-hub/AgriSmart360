import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Upload, Loader } from 'lucide-react';

interface DetectionResult {
  diseaseName: string;
  diseaseNameUrdu: string;
  severity: 'low' | 'medium' | 'high';
  confidence: number;
  treatment: string;
  treatmentUrdu: string;
  symptoms: string;
  symptomsUrdu: string;
}

const MOCK_DETECTIONS: Record<string, DetectionResult> = {
  default: {
    diseaseName: 'Wheat Rust (Yellow Rust)',
    diseaseNameUrdu: 'گندم کی کنگی (پیلی کنگی)',
    severity: 'medium',
    confidence: 87,
    treatment: 'Apply Propiconazole 25% EC @ 200ml/acre. Repeat after 14 days if needed.',
    treatmentUrdu: 'Propiconazole 25% EC @ 200ml فی ایکڑ چھڑکیں۔ ضرورت پڑنے پر 14 دن بعد دہرائیں۔',
    symptoms: 'Yellow/orange pustules on leaves and stems. Leaves may turn yellow.',
    symptomsUrdu: 'پتوں اور تنوں پر پیلے/نارنجی دھبے۔ پتے پیلے ہو سکتے ہیں۔',
  },
};

const DISEASE_TIPS = [
  { crop: 'گندم', disease: 'کنگی', treatment: 'Propiconazole سپرے', icon: '🌾' },
  { crop: 'چاول', disease: 'جھلسا', treatment: 'Tricyclazole سپرے', icon: '🌾' },
  { crop: 'کپاس', disease: 'سفید مکھی', treatment: 'Imidacloprid سپرے', icon: '🌿' },
  { crop: 'ٹماٹر', disease: 'اگیتا جھلسا', treatment: 'Mancozeb سپرے', icon: '🍅' },
  { crop: 'آلو', disease: 'پچھیتا جھلسا', treatment: 'Metalaxyl سپرے', icon: '🥔' },
];

const SEVERITY_CONFIG = {
  low: { label: 'ہلکی', color: 'text-green-600 bg-green-50', icon: '✅' },
  medium: { label: 'درمیانی', color: 'text-amber-600 bg-amber-50', icon: '⚠️' },
  high: { label: 'شدید', color: 'text-red-600 bg-red-50', icon: '🚨' },
};

export default function DiseaseDetection() {
  const { t } = useTranslation();
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      setImage(e.target?.result as string);
      setResult(null);
      analyzeImage();
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async () => {
    setLoading(true);
    // Simulate AI analysis delay
    await new Promise(r => setTimeout(r, 2500));
    setResult(MOCK_DETECTIONS.default);
    setLoading(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const sevCfg = result ? SEVERITY_CONFIG[result.severity] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('disease')}</h1>
        <p className="text-sm text-gray-500 font-urdu mt-0.5">فصل کی تصویر اپلوڈ کریں — AI بیماری پہچانے گا</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Area */}
        <div className="space-y-4">
          <div
            className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-colors
              ${dragOver ? 'border-primary bg-primary-50 dark:bg-primary-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-primary-50/50'}`}
            onDragOver={e => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
            />
            {image ? (
              <img src={image} alt="Uploaded" className="max-h-64 mx-auto rounded-xl object-contain" />
            ) : (
              <div>
                <Upload className="mx-auto text-gray-400 mb-3" size={48} />
                <p className="font-urdu text-gray-600 dark:text-gray-300 text-lg">تصویر یہاں ڈراپ کریں</p>
                <p className="text-gray-400 text-sm mt-1">یا کلک کریں</p>
                <p className="text-xs text-gray-400 mt-2">JPG, PNG, WEBP • Max 10MB</p>
              </div>
            )}
          </div>

          {image && !loading && !result && (
            <button onClick={analyzeImage} className="btn-primary w-full">
              🔬 بیماری تشخیص کریں
            </button>
          )}

          {loading && (
            <div className="card flex items-center justify-center gap-3">
              <Loader className="animate-spin text-primary" size={24} />
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-100 font-urdu">تجزیہ ہو رہا ہے...</p>
                <p className="text-xs text-gray-500">AI تصویر کا تجزیہ کر رہا ہے</p>
              </div>
            </div>
          )}

          {/* Camera Button */}
          <div className="text-center">
            <button
              onClick={() => {
                if (fileRef.current) {
                  fileRef.current.setAttribute('capture', 'environment');
                  fileRef.current.click();
                }
              }}
              className="btn-secondary"
            >
              📸 کیمرہ سے تصویر لیں
            </button>
          </div>
        </div>

        {/* Result */}
        {result && sevCfg && (
          <div className="space-y-4">
            <div className="card border-l-4 border-amber-500">
              <div className="flex items-start gap-3 mb-4">
                <span className="text-3xl">{sevCfg.icon}</span>
                <div>
                  <h2 className="font-bold text-gray-800 dark:text-gray-100 font-urdu text-xl">{result.diseaseNameUrdu}</h2>
                  <p className="text-gray-500 text-sm">{result.diseaseName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className={`px-3 py-2 rounded-lg ${sevCfg.color}`}>
                  <p className="text-xs opacity-70">شدت</p>
                  <p className="font-bold font-urdu">{sevCfg.label}</p>
                </div>
                <div className="px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                  <p className="text-xs opacity-70">اعتماد</p>
                  <p className="font-bold">{result.confidence}%</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
                  <h3 className="font-semibold text-amber-700 dark:text-amber-400 font-urdu mb-1">علامات</h3>
                  <p className="text-sm font-urdu text-gray-700 dark:text-gray-300">{result.symptomsUrdu}</p>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
                  <h3 className="font-semibold text-green-700 dark:text-green-400 font-urdu mb-1">علاج</h3>
                  <p className="text-sm font-urdu text-gray-700 dark:text-gray-300">{result.treatmentUrdu}</p>
                  <p className="text-xs text-gray-500 mt-1">{result.treatment}</p>
                </div>
              </div>

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => {
                    if ('speechSynthesis' in window) {
                      const text = `بیماری: ${result.diseaseNameUrdu}۔ علاج: ${result.treatmentUrdu}`;
                      const utterance = new SpeechSynthesisUtterance(text);
                      utterance.lang = 'ur-PK';
                      window.speechSynthesis.speak(utterance);
                    }
                  }}
                  className="btn-secondary flex-1"
                >
                  🔊 آواز سے سنیں
                </button>
                <button onClick={() => { setImage(null); setResult(null); }} className="btn-secondary flex-1">
                  دوبارہ کریں
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Common Diseases Reference */}
        {!result && (
          <div className="card">
            <h2 className="font-bold text-gray-800 dark:text-gray-100 mb-4">عام فصل بیماریاں</h2>
            <div className="space-y-3">
              {DISEASE_TIPS.map((tip, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <span className="text-2xl">{tip.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold font-urdu text-gray-800 dark:text-gray-100">{tip.crop}</span>
                      <span className="text-xs text-red-500">→</span>
                      <span className="text-sm font-urdu text-red-600">{tip.disease}</span>
                    </div>
                    <p className="text-xs text-gray-500">{tip.treatment}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
