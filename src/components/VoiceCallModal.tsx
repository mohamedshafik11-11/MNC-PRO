import { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  PhoneOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  MessageSquare,
  Zap,
  CheckCircle2,
  Clock,
  AudioWaveform as Waveform,
} from 'lucide-react';

interface VoiceCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetCompany?: string;
  targetRole?: string;
}

export function VoiceCallModal({
  isOpen,
  onClose,
  targetCompany = 'Amazon / Google',
  targetRole = 'Senior Software Engineer',
}: VoiceCallModalProps) {
  const [isMuted, setIsMuted] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<'system_design' | 'behavioral_star' | 'salary_neg'>('behavioral_star');
  const [callDuration, setCallDuration] = useState(0);
  const [transcriptHistory, setTranscriptHistory] = useState<
    { speaker: 'ai' | 'user'; text: string; time: string }[]
  >([
    {
      speaker: 'ai',
      text: `Hello! I am your Voice AI Interview Coach. We are simulating a live phone screen for ${targetCompany}. Give me your best response using the STAR method. Let's begin: Tell me about a time you made a high-stakes technical trade-off under a tight deadline.`,
      time: '00:01',
    },
  ]);
  const [userSpeechInput, setUserSpeechInput] = useState('');
  const recognitionRef = useRef<any>(null);

  // Call timer
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Initial voice greeting
  useEffect(() => {
    if (isOpen) {
      speakVoice(`Welcome to your MNC Voice Coach session. I am listening. Tap the microphone when you want to respond.`);
    }
  }, [isOpen]);

  const speakVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleToggleListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. You can type in the prompt box.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          setUserSpeechInput(event.results[i][0].transcript);
        }
      }
      if (finalTranscript) {
        setUserSpeechInput(finalTranscript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSendVoiceReply = async () => {
    if (!userSpeechInput.trim()) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const userText = userSpeechInput;
    setUserSpeechInput('');

    const newHistory = [
      ...transcriptHistory,
      { speaker: 'user' as const, text: userText, time: formatTime(callDuration) },
    ];
    setTranscriptHistory(newHistory);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userText,
          context: `You are acting as an elite Tier-1 MNC hiring interviewer during a live voice call. Evaluate the candidate's answer in 2 crisp sentences, point out 1 specific improvement, then ask 1 relevant follow-up question.`,
        }),
      });
      const data = await res.json();
      const aiReply = data.reply || "Strong articulation. To stand out for Tier-1 MNCs, quantify your end result with measurable latency or dollar savings. How did the rest of the engineering team react to your decision?";

      setTranscriptHistory((prev) => [
        ...prev,
        { speaker: 'ai', text: aiReply, time: formatTime(callDuration + 2) },
      ]);
      speakVoice(aiReply);
    } catch (err) {
      const fallback = "Good STAR structure! Let's probe deeper: What was the primary operational bottleneck you encountered during deployment?";
      setTranscriptHistory((prev) => [
        ...prev,
        { speaker: 'ai', text: fallback, time: formatTime(callDuration + 2) },
      ]);
      speakVoice(fallback);
    }
  };

  const handleEndCall = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    onClose();
  };

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div id="voice-call-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div id="voice-call-window" className="relative flex h-full max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-slate-900 shadow-2xl ring-1 ring-slate-800 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white shadow-xs">
              <Mic className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">MNC Voice AI Coach</h3>
                <span className="flex items-center gap-1 rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  AUDIO CALL
                </span>
              </div>
              <p className="text-xs text-slate-400">{targetCompany} • {targetRole}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-mono font-semibold text-slate-300">
              <Clock className="h-3.5 w-3.5 text-indigo-400" />
              <span>{formatTime(callDuration)}</span>
            </div>

            <button
              id="btn-close-voice-modal"
              onClick={handleEndCall}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Center: Audio Waveform Visualizer */}
        <div className="flex flex-col items-center justify-center py-6 bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
          <div className="relative flex items-center justify-center">
            {/* Pulsating ring */}
            <div
              className={`absolute h-32 w-32 rounded-full border border-indigo-500/30 transition-all duration-700 ${
                isAiSpeaking || isListening ? 'scale-125 animate-ping opacity-30 bg-indigo-600/10' : 'opacity-10'
              }`}
            />
            <div
              className={`flex h-24 w-24 items-center justify-center rounded-full shadow-2xl transition-transform duration-300 ${
                isAiSpeaking
                  ? 'bg-gradient-to-tr from-blue-600 to-indigo-500 scale-105 ring-4 ring-indigo-400/30 shadow-indigo-500/30'
                  : isListening
                  ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 scale-105 ring-4 ring-emerald-400/30 shadow-emerald-500/30'
                  : 'bg-slate-800 ring-2 ring-slate-700'
              }`}
            >
              <Bot className="h-10 w-10 text-white" />
            </div>
          </div>

          {/* Animated Equalizer Waves */}
          <div className="mt-4 flex items-center gap-1 h-8">
            {[40, 70, 90, 60, 100, 80, 50, 90, 75, 45].map((height, idx) => (
              <div
                key={idx}
                className={`w-1 rounded-full transition-all duration-200 ${
                  isAiSpeaking
                    ? 'bg-indigo-400 animate-pulse'
                    : isListening
                    ? 'bg-emerald-400 animate-pulse'
                    : 'bg-slate-700 h-2'
                }`}
                style={{
                  height: isAiSpeaking || isListening ? `${height}%` : '8px',
                  animationDelay: `${idx * 0.1}s`,
                }}
              />
            ))}
          </div>

          <p className="mt-2 text-xs font-semibold text-slate-300">
            {isAiSpeaking ? 'AI Coach is speaking...' : isListening ? 'Listening to your response...' : 'Tap Mic below or type response'}
          </p>
        </div>

        {/* Live Conversation Transcript */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <span>Live Audio Transcript</span>
            <span>Real-Time Feedback</span>
          </div>

          <div className="space-y-3">
            {transcriptHistory.map((item, idx) => (
              <div
                key={idx}
                className={`flex gap-3 text-xs ${
                  item.speaker === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {item.speaker === 'ai' && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                    AI
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3 leading-relaxed ${
                    item.speaker === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-none'
                      : 'bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700'
                  }`}
                >
                  <p>{item.text}</p>
                  <span className="mt-1 block text-[10px] text-slate-400 text-right">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Voice Input & Controls */}
        <div className="border-t border-slate-800 bg-slate-950 p-4 space-y-3">
          {/* Editable / Speech Preview Input */}
          <div className="flex items-center gap-2">
            <input
              id="input-voice-user-text"
              type="text"
              placeholder={isListening ? 'Listening to your voice...' : 'Type or speak your answer...'}
              value={userSpeechInput}
              onChange={(e) => setUserSpeechInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendVoiceReply()}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
            <button
              id="btn-voice-send-text"
              onClick={handleSendVoiceReply}
              disabled={!userSpeechInput.trim()}
              className="rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white hover:bg-indigo-500 disabled:opacity-40"
            >
              Send Answer
            </button>
          </div>

          <div className="flex items-center justify-center gap-4 pt-1">
            <button
              id="btn-toggle-mic-listen"
              onClick={handleToggleListening}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition shadow-md ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-emerald-600 text-white hover:bg-emerald-500'
              }`}
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              <span>{isListening ? 'Stop Speaking' : 'Hold / Tap to Speak'}</span>
            </button>

            <button
              id="btn-end-voice-call"
              onClick={handleEndCall}
              className="flex items-center gap-2 rounded-full bg-rose-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-rose-700"
            >
              <PhoneOff className="h-4 w-4" />
              <span>End Call</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
