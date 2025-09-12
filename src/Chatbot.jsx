import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, MessageCircle } from 'lucide-react';

const FarmerChatbot = () => {
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const languages = {
    as: { name: 'Assamese', greeting: 'কৃষকসকলৰ সহায়ৰ বাবে আমাৰ সৈতে কথা পাতক' },
    bn: { name: 'Bengali', greeting: 'কৃষকদের সাহায্যের জন্য আমাদের সাথে কথা বলুন' },
    brx: { name: 'Bodo', greeting: 'किसानों की मदद के लिए हमसे बात करें' },
    doi: { name: 'Dogri', greeting: 'किसानां दी मदद आस्तै साढ़े कन्नै गल्ल करो' },
    gu: { name: 'Gujarati', greeting: 'ખેડૂતોની મદદ માટે અમારી સાથે વાત કરો' },
    hi: { name: 'Hindi', greeting: 'किसानों की मदद के लिए हमसे बात करें' },
    kn: { name: 'Kannada', greeting: 'ರೈತರ ಸಹಾಯಕ್ಕಾಗಿ ನಮ್ಮೊಂದಿಗೆ ಮಾತನಾಡಿ' },
    kok: { name: 'Konkani', greeting: 'शेतकाऱ्यांच्या मदतीसाठी आमच्याशी बोला' },
    ks: { name: 'Kashmiri', greeting: 'کسان ساعدتہ لئی اسا سیتھ گل کریو' },
    mai: { name: 'Maithili', greeting: 'किसानक मदतिक लेल हमरा सँ गप्प करू' },
    ml: { name: 'Malayalam', greeting: 'കർഷകരുടെ സഹായത്തിനായി ഞങ്ങളോട് സംസാരിക്കുക' },
    mni: { name: 'Manipuri', greeting: 'লৌমীশিংগী মতেং পাংবা ঐখোয়গা ৱারী শানবিয়ু' },
    mr: { name: 'Marathi', greeting: 'शेतकऱ्यांच्या मदतीसाठी आमच्याशी बोला' },
    ne: { name: 'Nepali', greeting: 'किसानहरूको सहायताको लागि हामीसँग कुरा गर्नुहोस्' },
    or: { name: 'Odia', greeting: 'କୃଷକମାନଙ୍କ ସାହାଯ୍ୟ ପାଇଁ ଆମ ସହିତ କଥା ହୁଅନ୍ତୁ' },
    pa: { name: 'Punjabi', greeting: 'ਕਿਸਾਨਾਂ ਦੀ ਮਦਦ ਲਈ ਸਾਡੇ ਨਾਲ ਗੱਲ ਕਰੋ' },
    sa: { name: 'Sanskrit', greeting: 'कृषकाणां सहाय्यार्थं अस्माभिः सह वार्तालापं कुर्वन्तु' },
    sat: { name: 'Santali', greeting: 'हल करमी हुदिस लेकाते आलेकु साथे रोड़े' },
    sd: { name: 'Sindhi', greeting: 'هارين جي مدد لاءِ اسان سان ڳالهايو' },
    ta: { name: 'Tamil', greeting: 'விவசாயிகளின் உதவிக்காக எங்களுடன் பேசுங்கள்' },
    te: { name: 'Telugu', greeting: 'రైతుల సహాయం కోసం మాతో మాట్లాడండి' },
    ur: { name: 'Urdu', greeting: 'کسانوں کی مدد کے لیے ہم سے بات کریں' }
  };

  const sendMessage = async (message, isVoice = false) => {
    if (!message.trim() || !selectedLanguage) return;

    const userMessage = { text: message, sender: 'user', timestamp: Date.now() };
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: message,
          language: selectedLanguage,
          isVoice
        })
      });

      const data = await response.json();
      const botMessage = { text: data.response, sender: 'bot', timestamp: Date.now() };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { text: 'Sorry, I could not connect to the server.', sender: 'bot', timestamp: Date.now() };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const formData = new FormData();
        formData.append('audio', blob);
        formData.append('language', selectedLanguage);

        try {
          const response = await fetch('http://localhost:3000/voice', {
            method: 'POST',
            body: formData
          });
          const data = await response.json();
          if (data.transcript) {
            sendMessage(data.transcript, true);
          }
        } catch (error) {
          console.error('Voice processing error:', error);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    sendMessage(inputText);
  };

  if (!selectedLanguage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Farmer Help Assistant</h1>
            <p className="text-gray-600">Choose your preferred language to get started</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-96 overflow-y-auto">
            {Object.entries(languages).map(([code, lang]) => (
              <button
                key={code}
                onClick={() => setSelectedLanguage(code)}
                className="p-4 border-2 border-gray-200 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-200 text-left group"
              >
                <div className="font-semibold text-gray-800 group-hover:text-green-700 mb-1">
                  {lang.name}
                </div>
                <div className="text-sm text-gray-600 group-hover:text-green-600 leading-snug">
                  {lang.greeting}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex flex-col">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-gray-800">Farmer Assistant</h1>
              <p className="text-sm text-gray-600">{languages[selectedLanguage].name}</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedLanguage('')}
            className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Change Language
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col p-4">
        <div className="flex-1 bg-white rounded-t-2xl shadow-lg p-6 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-gray-600 mb-2">Welcome! I'm here to help with farming questions.</p>
              <p className="text-sm text-gray-500">{languages[selectedLanguage].greeting}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.sender === 'user' 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-b-2xl shadow-lg p-4 border-t pb-[70px]">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
              placeholder="Ask me anything about farming..."
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-4 py-3 rounded-xl transition-colors ${
                isRecording 
                  ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse' 
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
            <button
              onClick={handleSubmit}
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerChatbot;