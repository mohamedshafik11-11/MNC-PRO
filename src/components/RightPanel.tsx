import { useState } from 'react';
import {
  TrendingUp,
  Target,
  Sparkles,
  MessageSquare,
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Building2,
  CheckCircle2,
  Zap,
} from 'lucide-react';
import { UserProfile, ChatMessage } from '../types';

export interface RightPanelProps {
  user: UserProfile;
  onOpenMasterPrompt?: () => void;
  onOpenPromptAccelerator?: () => void;
  onOpenVoiceCall?: () => void;
  onOpenVideoCall?: () => void;
  onOpenAptitudeTest?: () => void;
}

export function RightPanel({ user, onOpenMasterPrompt, onOpenPromptAccelerator, onOpenVoiceCall = () => {} }: RightPanelProps) {
  const handlePrompt = onOpenMasterPrompt || onOpenPromptAccelerator || (() => {});

  const [chatExpanded, setChatExpanded] = useState(true);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceListening, setIsVoiceListening] = useState(false);
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'ai',
      text: `Hello ${user.name}! I am your MNC Pro AI Career Advisor. Your Tier-1 Readiness is at ${user.stats.mncReadinessPercentage}%. Ready to practice Google System Design, Amazon STAR answers, or Aptitude shortcuts?`,
      timestamp: 'Just now',
      suggestedPrompts: [
        'Google SDE III System Design topics',
        'Amazon Leadership STAR question',
        '10-Minute Rapid Aptitude trick',
      ],
    },
  ]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          context: `Candidate targeting ${user.targetCompany} for role ${user.targetRole}. Current readiness: ${user.stats.mncReadinessPercentage}%.`,
          history: messages.map((m) => ({ role: m.sender, text: m.text })),
        }),
      });

      const data = await response.json();
      const aiReply = data.reply || 'Here is your targeted MNC advice: Focus on scale, structured trade-offs, and quantified past achievements.';

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiReply,
        timestamp: 'Just now',
        suggestedPrompts: [
          'Generate STAR response template',
          'Give me an aptitude speed formula',
          'Evaluate my resume ATS compatibility',
        ],
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Voice output synthesis if enabled
      if (isTtsEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(aiReply.slice(0, 200));
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          sender: 'ai',
          text: 'Practice is key for MNCs! Frame all answers using: 1. Core architecture 2. Failure modes 3. Quantified metrics.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. You can type your question.');
      return;
    }

    if (isVoiceListening) {
      setIsVoiceListening(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsVoiceListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputMessage(transcript);
      setIsVoiceListening(false);
      handleSendMessage(transcript);
    };

    recognition.onerror = () => {
      setIsVoiceListening(false);
    };

    recognition.onend = () => {
      setIsVoiceListening(false);
    };

    recognition.start();
  };

  return (
    <aside className="flex h-full w-80 flex-col justify-between border-l border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/70 overflow-y-auto">
      {/* Top Section: MNC Readiness Progress Widget */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-600" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              MNC Readiness Score
            </h3>
          </div>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
            Top Tier
          </span>
        </div>

        {/* Circular / Large Score Card */}
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-4 text-white shadow-md dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-medium text-slate-400">Overall Benchmark</p>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-3xl font-black tracking-tight">{user.stats.mncReadinessPercentage}%</span>
                <span className="text-xs font-semibold text-emerald-400">READY</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Targeting {user.targetCompany}</p>
            </div>

            {/* Circular Visual Indicator */}
            <div className="relative flex h-14 w-14 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <path
                  className="text-slate-700"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-blue-500"
                  strokeDasharray={`${user.stats.mncReadinessPercentage}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <Zap className="absolute h-5 w-5 text-amber-400 fill-amber-400" />
            </div>
          </div>

          {/* Metric Bars */}
          <div className="mt-4 space-y-2 border-t border-slate-700/60 pt-3">
            <div>
              <div className="flex justify-between text-[10px] font-semibold text-slate-300">
                <span>System Design & Arch</span>
                <span>90%</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-slate-700">
                <div className="h-1.5 rounded-full bg-blue-500" style={{ width: '90%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-semibold text-slate-300">
                <span>Data Structures & Algo</span>
                <span>88%</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-slate-700">
                <div className="h-1.5 rounded-full bg-indigo-500" style={{ width: '88%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-semibold text-slate-300">
                <span>Aptitude & Speed Math</span>
                <span>94%</span>
              </div>
              <div className="mt-1 h-1.5 w-full rounded-full bg-slate-700">
                <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: '94%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Company Match Projections */}
        <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-blue-600" />
              Target MNC Probability
            </span>
            <span className="text-[10px] font-medium text-slate-400">ATS + Mocks</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 text-xs shadow-2xs dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Google SDE III</span>
              </div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">94% Match</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 text-xs shadow-2xs dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">AWS Cloud SDE</span>
              </div>
              <span className="font-bold text-blue-600 dark:text-blue-400">91% Match</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-white px-2.5 py-1.5 text-xs shadow-2xs dark:bg-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-800 dark:text-slate-200">Microsoft Copilot</span>
              </div>
              <span className="font-bold text-indigo-600 dark:text-indigo-400">89% Match</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Right Corner Live AI Chat & Voice Assistant */}
      <div className="mt-4 flex flex-col rounded-2xl border border-blue-200 bg-white shadow-lg shadow-blue-500/5 dark:border-slate-700 dark:bg-slate-850">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-t-2xl text-white">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Bot className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-emerald-400 ring-1 ring-white" />
            </div>
            <div>
              <p className="text-xs font-bold leading-none">Voice & Chat Coach</p>
              <p className="text-[10px] text-blue-100 mt-0.5">Gemini 3.7 Career AI</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="btn-toggle-tts"
              onClick={() => setIsTtsEnabled(!isTtsEnabled)}
              className="rounded-md p-1 text-white/80 hover:bg-white/10 hover:text-white"
              title={isTtsEnabled ? 'Disable Voice Playback' : 'Enable Voice Playback'}
            >
              {isTtsEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
            </button>
            <button
              id="btn-quick-voice-coach"
              onClick={onOpenVoiceCall}
              className="rounded-md bg-white/20 p-1 text-white hover:bg-white/30"
              title="Open Full Voice Coach Studio"
            >
              <Mic className="h-3.5 w-3.5" />
            </button>
            <button
              id="btn-toggle-chat-expand"
              onClick={() => setChatExpanded(!chatExpanded)}
              className="rounded-md p-1 text-white/80 hover:bg-white/10 hover:text-white"
            >
              {chatExpanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {chatExpanded && (
          <div className="flex flex-col h-[280px]">
            {/* Messages Feed */}
            <div className="flex-1 space-y-2.5 overflow-y-auto p-3 text-xs">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[90%] rounded-xl px-3 py-2 ${
                      m.sender === 'user'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded-bl-none border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <p className="whitespace-pre-line leading-relaxed">{m.text}</p>
                  </div>

                  {/* Suggestion Prompts */}
                  {m.suggestedPrompts && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {m.suggestedPrompts.map((p, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSendMessage(p)}
                          className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-900/50 dark:bg-blue-950/40 dark:text-blue-300"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Bot className="h-3.5 w-3.5 animate-spin text-blue-500" />
                  <span>MNC AI is evaluating...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="border-t border-slate-100 p-2 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/40 rounded-b-2xl">
              <div className="flex items-center gap-1.5">
                <button
                  id="btn-chat-mic"
                  onClick={toggleVoiceInput}
                  className={`rounded-lg p-1.5 transition ${
                    isVoiceListening
                      ? 'bg-red-500 text-white animate-pulse'
                      : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300'
                  }`}
                  title={isVoiceListening ? 'Listening... click to stop' : 'Voice Input'}
                >
                  {isVoiceListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                </button>

                <input
                  id="input-chat-message"
                  type="text"
                  placeholder="Ask MNC question or paste code..."
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />

                <button
                  id="btn-chat-send"
                  onClick={() => handleSendMessage()}
                  disabled={!inputMessage.trim() || isTyping}
                  className="rounded-lg bg-blue-600 p-1.5 text-white transition hover:bg-blue-700 disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
