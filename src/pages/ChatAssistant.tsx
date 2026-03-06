import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Send, Mic, MicOff, Volume2, VolumeX, Bot, User } from 'lucide-react';
import i18n from '../lib/i18n';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Extend Window interface for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

interface SpeechRecognitionInstance {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

const FAQ_RESPONSES: Record<string, string> = {
  'گندم': 'گندم کی موجودہ قیمت لاہور منڈی میں ₨3,800 فی من ہے۔ گزشتہ ہفتے کے مقابلے میں 1.3% اضافہ ہوا ہے۔ گندم بوائی کا بہترین وقت اکتوبر سے نومبر ہے۔',
  'قیمت': 'آج کی اہم فصل قیمتیں:\n• گندم: ₨3,800/من\n• چاول: ₨7,500/من\n• کپاس: ₨8,200/من\n• مکئی: ₨2,800/من\nقیمتیں منڈی کے حساب سے مختلف ہو سکتی ہیں۔',
  'موسم': 'لاہور میں آج موسم صاف ہے، درجہ حرارت 28°C ہے۔ کل بارش کا 60% امکان ہے۔ سپرے کے لیے آج کا دن مناسب ہے۔',
  'کھاد': 'گندم کے لیے:\n• یوریا: 1 بیگ فی ایکڑ (بوائی پر)\n• DAP: 1 بیگ فی ایکڑ (بوائی پر)\n• دوسری یوریا: 1 بیگ (21 دن بعد)\nکپاس کے لیے NPK 20-20-0 استعمال کریں۔',
  'بیماری': 'عام فصل بیماریاں:\n• گندم: کنگی (Rust) - علاج: Propiconazole سپرے\n• چاول: جھلسا (Blast) - علاج: Tricyclazole\n• کپاس: سفید مکھی - علاج: Imidacloprid\nبیماری کی تشخیص کے لیے تصویر اپلوڈ کریں۔',
  'پانی': 'آبپاشی کے بارے میں:\n• گندم: ہر 21-25 دن میں ایک بار\n• کپاس: ہر 10-14 دن\n• چاول: 5-7 سینٹی میٹر پانی مسلسل\nڈرپ آبپاشی 40% پانی بچاتی ہے۔',
  'سبسڈی': 'حکومتی سبسڈیز:\n• یوریا پر ₨500 فی بیگ سبسڈی\n• شمسی پمپ پر 60% گرانٹ\n• ٹریکٹر پر 30% سبسڈی\nتفصیل کے لیے قریبی زرعی دفتر سے رابطہ کریں۔',
  'cotton': 'Cotton prices: ₨8,200 per 40kg in Multan. Best spray schedule: Imidacloprid for whitefly, Chlorpyrifos for bollworm. Harvest when 60% bolls are open.',
  'wheat': 'Wheat price: ₨3,800 per 40kg in Lahore (+1.3%). Best sowing time: October-November. Apply 1 bag DAP + 1 bag Urea per acre at sowing.',
};

function getResponse(query: string): string {
  const q = query.toLowerCase();
  for (const [key, response] of Object.entries(FAQ_RESPONSES)) {
    if (q.includes(key.toLowerCase())) {
      return response;
    }
  }
  // Default Urdu response
  if (/[\u0600-\u06FF]/.test(query)) {
    return `آپ نے پوچھا: "${query}"\n\nہم ابھی اس سوال کا جواب تیار کر رہے ہیں۔ براہ کرم قیمت، موسم، کھاد، بیماری، پانی یا سبسڈی کے بارے میں پوچھیں۔\n\nمثال:\n• "گندم کی قیمت کیا ہے؟"\n• "کپاس پر کیڑے کا علاج؟"\n• "سبسڈی کیسے ملے گی؟"`;
  }
  return `For crop prices, weather, fertilizers, disease treatment, or government subsidies, please ask in more detail. Try asking:\n• "What is wheat price?"\n• "Cotton disease treatment?"\n• "Irrigation schedule for rice?"`;
}

export default function ChatAssistant() {
  const { t } = useTranslation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: 'السلام علیکم! میں AgriSmart 360 کا AI مددگار ہوں۔ آپ مجھ سے فصل کی قیمتوں، موسم، کھاد، بیماریوں، سبسڈی اور دیگر زرعی سوالات پوچھ سکتے ہیں۔\n\nسوال پوچھیں یا مائیک بٹن دبا کر بولیں۔ 🌾',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI thinking delay
    await new Promise(r => setTimeout(r, 800));

    const response = getResponse(text);
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, assistantMsg]);
    setIsTyping(false);

    // Voice output
    if (voiceEnabled && 'speechSynthesis' in window) {
      speakText(response);
    }
  };

  const getSpeechLang = () => {
    const langMap: Record<string, string> = {
      ur: 'ur-PK', en: 'en-US', ar: 'ar-SA', hi: 'hi-IN',
      pa: 'pa-IN', sd: 'sd-PK', ps: 'ps-AF', tr: 'tr-TR', zh: 'zh-CN',
    };
    return langMap[i18n.language] || 'ur-PK';
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    const lang = getSpeechLang();
    // Try to find a matching voice
    const voices = window.speechSynthesis.getVoices();
    const matchingVoice = voices.find(v => v.lang.startsWith(lang.split('-')[0]));
    if (matchingVoice) utterance.voice = matchingVoice;
    utterance.lang = lang;
    utterance.rate = 0.85;
    utterance.pitch = 1;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('آپ کا براؤزر آواز کی تشخیص کی حمایت نہیں کرتا');
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = getSpeechLang();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setIsListening(false);
  };

  const quickQuestions = [
    'گندم کی قیمت کیا ہے؟',
    'کل موسم کیسا ہوگا؟',
    'کپاس پر بیماری کا علاج؟',
    'سبسڈی کیسے ملے گی؟',
    'گندم کو پانی کب دیں؟',
    'یوریا کتنی ڈالیں؟',
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{t('chat')} 🤖</h1>
          <p className="text-sm text-gray-500 font-urdu">اردو میں زرعی سوالات پوچھیں</p>
        </div>
        <button
          onClick={() => setVoiceEnabled(!voiceEnabled)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm border transition-colors ${voiceEnabled ? 'border-primary text-primary bg-primary-50' : 'border-gray-300 text-gray-500'}`}
        >
          {voiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          <span>{voiceEnabled ? 'آواز: آن' : 'آواز: آف'}</span>
        </button>
      </div>

      {/* Quick Questions */}
      <div className="flex gap-2 flex-wrap mb-4">
        {quickQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => sendMessage(q)}
            className="px-3 py-1.5 bg-primary-50 dark:bg-primary-900/30 text-primary text-xs rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors font-urdu"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'assistant' ? 'bg-primary' : 'bg-earth-light'}`}>
              {msg.role === 'assistant' ? (
                <Bot size={16} className="text-white" />
              ) : (
                <User size={16} className="text-white" />
              )}
            </div>
            {/* Bubble */}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
              msg.role === 'assistant'
                ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
                : 'bg-primary text-white'
            }`}>
              <p className="text-sm whitespace-pre-line font-urdu leading-relaxed">{msg.content}</p>
              <p className="text-xs opacity-60 mt-1">
                {msg.timestamp.toLocaleTimeString('ur', { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
            {/* Speak button for assistant */}
            {msg.role === 'assistant' && voiceEnabled && (
              <button
                onClick={() => isSpeaking ? stopSpeaking() : speakText(msg.content)}
                className="self-end mb-1 text-gray-400 hover:text-primary"
              >
                {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
              </button>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="mt-3 flex gap-2">
        <button
          onMouseDown={startListening}
          onMouseUp={stopListening}
          onTouchStart={startListening}
          onTouchEnd={stopListening}
          className={`p-3 rounded-xl transition-colors ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200'}`}
          title={t('voiceInput')}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
          placeholder={t('askQuestion')}
          className="input-field flex-1"
          dir="rtl"
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={!input.trim()}
          className="btn-primary px-4"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
}
