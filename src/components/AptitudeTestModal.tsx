import { useState, useEffect } from 'react';
import {
  X,
  BrainCircuit,
  Clock,
  CheckCircle2,
  XCircle,
  Sparkles,
  Award,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Lightbulb,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AptitudeQuestion } from '../types';
import { APTITUDE_QUESTION_BANK } from '../data/mockData';

interface AptitudeTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScoreSaved?: (score: number) => void;
}

export function AptitudeTestModal({ isOpen, onClose, onScoreSaved }: AptitudeTestModalProps) {
  const [questions, setQuestions] = useState<AptitudeQuestion[]>(APTITUDE_QUESTION_BANK);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: number }>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState(600); // 10 minutes
  const [showAiExplanation, setShowAiExplanation] = useState(false);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');

  // Countdown timer
  useEffect(() => {
    if (!isOpen || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitTest();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isSubmitted]);

  if (!isOpen) return null;

  const currentQ = questions[currentIndex];

  const handleSelectOption = (optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionIndex,
    }));
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correct += 1;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const handleSubmitTest = () => {
    setIsSubmitted(true);
    const scoreObj = calculateScore();
    if (scoreObj.percentage >= 70) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
    if (onScoreSaved) {
      onScoreSaved(scoreObj.percentage);
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setCurrentIndex(0);
    setTimeRemainingSeconds(600);
  };

  const scoreData = calculateScore();

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div id="aptitude-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div id="aptitude-test-window" className="relative flex h-full max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-slate-800 text-slate-900 dark:text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50/80 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600 font-bold text-white shadow-sm shadow-purple-500/20">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  MNC Pro Rapid Aptitude Challenge
                </h3>
                <span className="rounded-md bg-purple-100 px-2 py-0.5 text-[10px] font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  10-Min Sprint
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Quantitative, Logical Reasoning & Core CS Screening Bank
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {!isSubmitted && (
              <div className="flex items-center gap-2 rounded-xl bg-purple-50 px-3.5 py-1.5 font-mono text-sm font-bold text-purple-900 border border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800">
                <Clock className="h-4 w-4 text-purple-600" />
                <span>{formatTimer(timeRemainingSeconds)}</span>
              </div>
            )}

            <button
              id="btn-close-aptitude"
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {isSubmitted ? (
          /* Result & Solutions Screen */
          <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
            <div className="text-center max-w-lg mx-auto space-y-3">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600 dark:bg-purple-950 dark:text-purple-300">
                <Award className="h-9 w-9" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                Aptitude Test Completed!
              </h2>
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-4xl font-black text-purple-600 dark:text-purple-400">
                  {scoreData.percentage}%
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  ({scoreData.correct}/{scoreData.total} Correct)
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                {scoreData.percentage >= 80
                  ? '🎉 Outstanding! You cleared the Tier-1 MNC initial screening cutoff with high speed percentile.'
                  : 'Good effort! Review the AI 10-second mental math shortcuts below to maximize speed.'}
              </p>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  id="btn-retake-aptitude"
                  onClick={handleRestart}
                  className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Retake Test</span>
                </button>
                <button
                  id="btn-finish-aptitude"
                  onClick={onClose}
                  className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-500"
                >
                  Return to Dashboard
                </button>
              </div>
            </div>

            {/* Answer Solutions List */}
            <div className="space-y-4 max-w-3xl mx-auto pt-4 border-t border-slate-200 dark:border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-amber-500" />
                Step-by-Step AI Solutions & Speed Math Shortcuts
              </h3>

              {questions.map((q, idx) => {
                const userAns = selectedAnswers[q.id];
                const isCorrect = userAns === q.correctAnswerIndex;

                return (
                  <div
                    key={q.id}
                    className={`rounded-2xl border p-4.5 space-y-3 ${
                      isCorrect
                        ? 'border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20'
                        : 'border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        Q{idx + 1}. {q.question}
                      </span>
                      <span
                        className={`shrink-0 flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-bold ${
                          isCorrect
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-300'
                        }`}
                      >
                        {isCorrect ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 dark:text-slate-300">
                      <span className="font-semibold">Correct Choice:</span> {q.options[q.correctAnswerIndex]}
                    </div>

                    {/* AI Explanation Box */}
                    <div className="rounded-xl bg-white p-3 text-xs dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                      <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-semibold">
                        <Sparkles className="h-3.5 w-3.5" />
                        <span>AI Step-by-Step Explanation</span>
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{q.explanation}</p>

                      <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-semibold pt-1 border-t border-slate-100 dark:border-slate-700">
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                        <span>10-Second Shortcut Trick:</span>
                        <span className="font-normal">{q.speedShortcutTip}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Question Interface */
          <div className="flex-1 flex flex-col justify-between p-6 sm:p-8 overflow-y-auto">
            <div className="space-y-6 max-w-3xl mx-auto w-full">
              {/* Question Progress Dots */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-md bg-purple-100 px-2 py-0.5 text-xs font-bold text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                    {currentQ.category}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Difficulty: <strong className="text-slate-800 dark:text-slate-200">{currentQ.difficulty}</strong>
                  </span>
                </div>

                <span className="text-xs font-bold text-slate-500">
                  Question {currentIndex + 1} of {questions.length}
                </span>
              </div>

              {/* Question text */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5 dark:border-slate-800 dark:bg-slate-850">
                <h4 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-relaxed">
                  {currentQ.question}
                </h4>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      id={`btn-aptitude-option-${optIdx}`}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm font-semibold transition ${
                        isSelected
                          ? 'border-purple-600 bg-purple-50 text-purple-900 ring-2 ring-purple-500/20 dark:border-purple-500 dark:bg-purple-950/60 dark:text-purple-100'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-purple-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                            isSelected
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>
                      {isSelected && <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-4 dark:border-slate-800 max-w-3xl mx-auto w-full">
              <button
                id="btn-aptitude-prev"
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-50 disabled:opacity-40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Previous</span>
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  id="btn-submit-aptitude-test"
                  onClick={handleSubmitTest}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md transition hover:from-purple-500 hover:to-indigo-500"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Submit & View Solutions</span>
                </button>
              ) : (
                <button
                  id="btn-aptitude-next"
                  onClick={() => setCurrentIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                  className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white shadow-md transition hover:bg-purple-500"
                >
                  <span>Next Question</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
