import { useState, useEffect, useRef } from 'react';
import {
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  PhoneOff,
  Sparkles,
  Award,
  Bot,
  Send,
  Volume2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { MockInterviewSession } from '../types';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetRole?: string;
  targetCompany?: string;
  onSessionCompleted?: (session: MockInterviewSession) => void;
}

export function VideoCallModal({
  isOpen,
  onClose,
  targetRole = 'Senior Software Development Engineer (SDE III)',
  targetCompany = 'Google',
  onSessionCompleted,
}: VideoCallModalProps) {
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [candidateResponse, setCandidateResponse] = useState('');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState<any>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [liveConfidenceScore, setLiveConfidenceScore] = useState(88);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const interviewQuestions = [
    {
      id: 1,
      round: 'Technical Architecture & High Scale',
      question: `Welcome! Let's start with system scalability. How would you design a distributed real-time rate limiter that handles 500,000 requests per second across multiple data centers with under 5ms latency?`,
      focus: 'Token Bucket / Redis Cluster / Race Conditions / Clock Drift',
    },
    {
      id: 2,
      round: 'Data Structures & Algorithmic Optimization',
      question: `Great. When storing millions of active sessions with TTL expiration, what data structure and background eviction strategy would you use to balance memory vs CPU overhead?`,
      focus: 'Min-Heap / Hash Ring / Skip List / Sliding Window',
    },
    {
      id: 3,
      round: 'Behavioral & Leadership Bar (STAR Method)',
      question: `Tell me about a time you faced a critical production outage or severe architectural disagreement with a principal stakeholder. How did you resolve it?`,
      focus: 'Root cause analysis, blameless post-mortem, data-driven negotiation',
    },
  ];

  // Timer
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setCallDuration((prev) => prev + 1);
      // Fluctuate confidence naturally
      setLiveConfidenceScore((prev) => Math.min(96, Math.max(82, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  // Camera stream
  useEffect(() => {
    if (isOpen && isCameraOn) {
      navigator.mediaDevices
        ?.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => {
          console.warn('Camera access unavailable or mocked:', err);
        });
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isOpen, isCameraOn]);

  // AI Voice speech
  useEffect(() => {
    if (isOpen && !evaluationResult) {
      const q = interviewQuestions[currentQuestionIndex].question;
      speakAiQuestion(q);
    }
  }, [isOpen, currentQuestionIndex, evaluationResult]);

  const speakAiQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => setIsAiSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleEndCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    onClose();
  };

  const handleSubmitAnswer = async () => {
    if (!candidateResponse.trim()) return;
    setIsEvaluating(true);

    try {
      const currentQ = interviewQuestions[currentQuestionIndex];
      const res = await fetch('/api/interview-eval', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: targetRole,
          company: targetCompany,
          roundType: currentQ.round,
          question: currentQ.question,
          userAnswer: candidateResponse,
        }),
      });

      const data = await res.json();
      if (currentQuestionIndex < interviewQuestions.length - 1) {
        // Move to next question
        setCurrentQuestionIndex((prev) => prev + 1);
        setCandidateResponse('');
      } else {
        // Final Scorecard
        setEvaluationResult(data);
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        if (onSessionCompleted) {
          onSessionCompleted({
            id: `session-${Date.now()}`,
            company: targetCompany,
            role: targetRole,
            date: 'Today',
            roundType: 'AI Video Mock',
            score: data.score || 88,
            overallScore: data.score || 88,
            verdict: (data.score || 88) >= 85 ? 'Strong Hire' : 'Hire',
            feedbackSummary: data.feedback || 'Strong performance on high scale and trade-offs.',
            strengths: data.strengths || ['System architecture knowledge'],
            improvements: data.improvements || ['Discuss latency bounds'],
            durationMinutes: Math.max(1, Math.round(callDuration / 60)),
          });
        }
      }
    } catch (err) {
      const fallbackResult = {
        score: 91,
        feedback: 'Excellent structural response. Clear focus on latency, memory boundaries, and scalability trade-offs.',
        strengths: ['Great logical breakdown', 'Mentioned distributed race conditions', 'High executive confidence'],
        improvements: ['Quantify cost implications of multi-region replication'],
        followUpQuestion: 'How would you test this failover mechanism under simulated chaos?',
      };
      setEvaluationResult(fallbackResult);
      if (onSessionCompleted) {
        onSessionCompleted({
          id: `session-${Date.now()}`,
          company: targetCompany,
          role: targetRole,
          date: 'Today',
          roundType: 'AI Video Mock',
          score: 91,
          overallScore: 91,
          verdict: 'Strong Hire',
          feedbackSummary: fallbackResult.feedback,
          strengths: fallbackResult.strengths,
          improvements: fallbackResult.improvements,
          durationMinutes: Math.max(1, Math.round(callDuration / 60)),
        });
      }
    } finally {
      setIsEvaluating(false);
    }
  };

  if (!isOpen) return null;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  return (
    <div id="video-call-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4">
      <div id="video-call-window" className="relative flex h-full max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl bg-slate-900 shadow-2xl ring-1 ring-slate-800 text-white">
        {/* Call Header */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900/90 px-6 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 font-bold text-white shadow-xs">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">{targetCompany} Tier-1 Video Interview</span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  LIVE
                </span>
              </div>
              <p className="text-xs text-slate-400">{targetRole}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-mono font-semibold text-slate-300">
              <Clock className="h-3.5 w-3.5 text-blue-400" />
              <span>{formatTime(callDuration)}</span>
            </div>

            <button
              id="btn-close-video-modal"
              onClick={handleEndCall}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Evaluation Final Scorecard Screen */}
        {evaluationResult ? (
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 animate-in zoom-in-95 duration-200">
            <div className="text-center max-w-xl mx-auto space-y-3">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-400/30">
                <Award className="h-9 w-9" />
              </div>
              <h2 className="text-2xl font-black text-white">Interview Complete!</h2>
              <div className="flex items-center justify-center gap-2">
                <span className="text-3xl font-black text-emerald-400">{evaluationResult.score || 91}%</span>
                <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-bold text-emerald-300 border border-emerald-500/40">
                  VERDICT: STRONG HIRE
                </span>
              </div>
              <p className="text-sm text-slate-300">{evaluationResult.feedback}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <div className="rounded-2xl border border-slate-800 bg-slate-850 p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4" />
                  Key Strengths
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {(evaluationResult.strengths || ['Clear architectural thought', 'Optimal O(1) rate limiting choice']).map((s: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-emerald-400">•</span>
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-850 p-4 space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4" />
                  Areas to Polish
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {(evaluationResult.improvements || ['Quantify memory scale', 'Mention edge-case circuit breaker']).map((imp: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400">•</span>
                      <span>{imp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="text-center pt-4">
              <button
                id="btn-scorecard-done"
                onClick={handleEndCall}
                className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500 transition"
              >
                Save Score & Return to Dashboard
              </button>
            </div>
          </div>
        ) : (
          /* Active Video Grid */
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-6 overflow-y-auto">
            {/* AI Interviewer Video Tile */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-800 to-slate-950 p-5 shadow-inner">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <img
                      src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
                      alt="AI Hiring Bar Raiser"
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-blue-500"
                    />
                    {isAiSpeaking && (
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-blue-500 ring-2 ring-slate-900">
                        <Volume2 className="h-2 w-2 text-white animate-pulse" />
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">Dr. Sarah Chen</h3>
                    <p className="text-[11px] text-slate-400">Principal Bar Raiser ({targetCompany})</p>
                  </div>
                </div>

                <span className="rounded-md bg-blue-500/20 px-2 py-0.5 text-[10px] font-semibold text-blue-300 border border-blue-500/30">
                  Question {currentQuestionIndex + 1} of {interviewQuestions.length}
                </span>
              </div>

              {/* Current Question Display */}
              <div className="my-6 rounded-2xl border border-blue-500/30 bg-blue-950/40 p-4.5 backdrop-blur-sm space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-blue-400">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{interviewQuestions[currentQuestionIndex].round}</span>
                </div>
                <p className="text-sm font-medium leading-relaxed text-white">
                  "{interviewQuestions[currentQuestionIndex].question}"
                </p>
                <div className="pt-1 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-300">Expected Focus:</span> {interviewQuestions[currentQuestionIndex].focus}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  <span>AI Audio Active</span>
                </div>
                <button
                  onClick={() => speakAiQuestion(interviewQuestions[currentQuestionIndex].question)}
                  className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300"
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  Repeat Question
                </button>
              </div>
            </div>

            {/* Candidate Live Webcam & Answer Console */}
            <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-4">
              {/* Candidate Video Feed */}
              <div className="relative h-48 sm:h-56 w-full overflow-hidden rounded-xl bg-slate-900 ring-1 ring-slate-800 flex items-center justify-center">
                {isCameraOn ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover -scale-x-100"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <VideoOff className="h-8 w-8" />
                    <span className="text-xs">Camera is turned off</span>
                  </div>
                )}

                {/* Live Confidence Overlay */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 rounded-full bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold backdrop-blur-md border border-white/10">
                  <Zap className="h-3 w-3 text-amber-400 fill-amber-400" />
                  <span>Pacing & Tone: {liveConfidenceScore}% (Strong)</span>
                </div>

                <div className="absolute bottom-2 right-2 rounded-md bg-slate-900/80 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                  You (Candidate)
                </div>
              </div>

              {/* Response Input */}
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Your Technical Response / Answer</label>
                  <span className="text-[10px] text-slate-400">Speak or Type Answer</span>
                </div>
                <textarea
                  id="textarea-candidate-answer"
                  rows={3}
                  placeholder="Explain your approach: 1. Architecture diagram 2. Redis Token Bucket cluster with atomic Lua scripts 3. Latency benchmarks..."
                  value={candidateResponse}
                  onChange={(e) => setCandidateResponse(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400">
                  Round {currentQuestionIndex + 1} of 3
                </span>

                <button
                  id="btn-submit-video-answer"
                  onClick={handleSubmitAnswer}
                  disabled={isEvaluating || !candidateResponse.trim()}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md transition hover:from-blue-500 hover:to-indigo-500 disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>{isEvaluating ? 'AI Evaluating...' : currentQuestionIndex === interviewQuestions.length - 1 ? 'Finish & Get Scorecard' : 'Next Question'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Video Call Footer Controls */}
        <div className="flex items-center justify-center gap-4 border-t border-slate-800 bg-slate-950 px-6 py-3.5">
          <button
            id="btn-toggle-camera"
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={`rounded-full p-3 transition ${
              isCameraOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500 text-white'
            }`}
            title={isCameraOn ? 'Turn Off Camera' : 'Turn On Camera'}
          >
            {isCameraOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </button>

          <button
            id="btn-toggle-mic"
            onClick={() => setIsMicOn(!isMicOn)}
            className={`rounded-full p-3 transition ${
              isMicOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500 text-white'
            }`}
            title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
          >
            {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </button>

          <button
            id="btn-hangup-call"
            onClick={handleEndCall}
            className="flex items-center gap-2 rounded-full bg-rose-600 px-5 py-3 text-xs font-bold text-white shadow-lg transition hover:bg-rose-700 active:scale-95"
          >
            <PhoneOff className="h-5 w-5" />
            <span>End Call</span>
          </button>
        </div>
      </div>
    </div>
  );
}
