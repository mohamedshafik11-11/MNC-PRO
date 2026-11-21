import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Camera,
  Upload,
  Check,
  Sparkles,
  User,
  Image as ImageIcon,
  RotateCcw,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  onSaveAvatar: (newAvatarUrl: string) => void;
}

const PRESET_AVATARS = [
  {
    id: 'av-1',
    label: 'Senior Tech Lead (Professional)',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-2',
    label: 'Principal Cloud Architect',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-3',
    label: 'Staff Software Engineer',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-4',
    label: 'Distributed Systems Lead',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-5',
    label: 'Engineering Manager',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-6',
    label: 'AI & ML Researcher',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-7',
    label: 'Full Stack Tech Lead',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=250&auto=format&fit=crop&q=80',
  },
  {
    id: 'av-8',
    label: 'Software Architect',
    url: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=250&auto=format&fit=crop&q=80',
  },
];

export function AvatarUploadModal({
  isOpen,
  onClose,
  currentAvatar,
  onSaveAvatar,
}: AvatarUploadModalProps) {
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'camera' | 'url'>('upload');
  const [selectedAvatar, setSelectedAvatar] = useState<string>(currentAvatar);
  const [urlInput, setUrlInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedAvatar(currentAvatar);
      setUrlInput('');
    } else {
      stopCamera();
    }
  }, [isOpen, currentAvatar]);

  // Clean up camera stream on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const startCamera = async () => {
    try {
      stopCamera();
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 400 }, height: { ideal: 400 }, facingMode: 'user' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      alert('Unable to access camera. Please check camera permissions or upload an image file.');
    }
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(videoRef.current, 0, 0, 256, 256);
    const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
    setSelectedAvatar(dataUrl);
    stopCamera();
    setActiveTab('upload');
  };

  // Process file upload with client-side canvas compression (max 256x256)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        canvas.width = 256;
        canvas.height = 256;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          setIsProcessing(false);
          return;
        }

        // Center crop square
        const startX = (img.width - size) / 2;
        const startY = (img.height - size) / 2;

        ctx.drawImage(img, startX, startY, size, size, 0, 0, 256, 256);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);

        setSelectedAvatar(compressedDataUrl);
        setIsProcessing(false);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleApplyUrl = () => {
    if (!urlInput.trim()) return;
    setSelectedAvatar(urlInput.trim());
    setUrlInput('');
  };

  const handleSaveAndConfirm = () => {
    onSaveAvatar(selectedAvatar);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      id="avatar-upload-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div
        id="avatar-upload-window"
        className="relative flex h-full max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-slate-800 text-slate-900 dark:text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white shadow-xs">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Update Profile Picture</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Upload custom photo, select from executive presets, or use webcam
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Live Preview Bar */}
        <div className="flex items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50/50 px-6 py-4 dark:from-slate-850 dark:to-slate-800 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <img
              src={selectedAvatar}
              alt="Avatar Preview"
              className="h-16 w-16 rounded-2xl object-cover ring-2 ring-blue-500 shadow-md bg-white dark:bg-slate-800"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80';
              }}
            />
            <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white dark:ring-slate-900">
              <Check className="h-3 w-3" />
            </span>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900 dark:text-white">Active Avatar Preview</span>
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Optimized
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Permanently compressed & persisted to local storage. Displays across candidate ATS cards and mock interviews.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-100/60 px-6 py-2 dark:border-slate-800 dark:bg-slate-950/60">
          <button
            onClick={() => {
              stopCamera();
              setActiveTab('upload');
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'upload'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <Upload className="h-3.5 w-3.5" />
            <span>Upload File</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setActiveTab('preset');
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'preset'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Executive Presets</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('camera');
              startCamera();
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'camera'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <Camera className="h-3.5 w-3.5" />
            <span>Webcam Photo</span>
          </button>

          <button
            onClick={() => {
              stopCamera();
              setActiveTab('url');
            }}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition ${
              activeTab === 'url'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-800 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400'
            }`}
          >
            <ImageIcon className="h-3.5 w-3.5" />
            <span>Image URL</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* TAB 1: File Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-300 bg-blue-50/40 p-8 text-center transition hover:border-blue-500 hover:bg-blue-50/70 dark:border-blue-900 dark:bg-blue-950/20"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-md">
                  <Upload className="h-6 w-6" />
                </div>
                <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">
                  Click to Browse Photo from Computer
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Supports JPG, PNG, WEBP. Automatically centered & compressed to high-res avatar.
                </p>
                <button
                  type="button"
                  className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-500"
                >
                  Select Photo File
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              {isProcessing && (
                <p className="text-center text-xs font-bold text-blue-600 animate-pulse">
                  Optimizing & compressing avatar...
                </p>
              )}
            </div>
          )}

          {/* TAB 2: Executive Presets */}
          {activeTab === 'preset' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Choose a pre-rendered Tier-1 executive profile avatar:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PRESET_AVATARS.map((av) => {
                  const isSelected = selectedAvatar === av.url;
                  return (
                    <div
                      key={av.id}
                      onClick={() => setSelectedAvatar(av.url)}
                      className={`group cursor-pointer relative flex flex-col items-center rounded-2xl border p-2.5 transition text-center ${
                        isSelected
                          ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/30 dark:bg-blue-950/40'
                          : 'border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-slate-850'
                      }`}
                    >
                      <img
                        src={av.url}
                        alt={av.label}
                        className="h-16 w-16 rounded-xl object-cover shadow-2xs group-hover:scale-105 transition"
                      />
                      <span className="mt-2 text-[10px] font-semibold text-slate-700 dark:text-slate-300 line-clamp-1">
                        {av.label}
                      </span>
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 rounded-full bg-blue-600 p-0.5 text-white">
                          <Check className="h-3 w-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: Webcam Camera */}
          {activeTab === 'camera' && (
            <div className="space-y-4 text-center">
              <div className="relative mx-auto flex h-64 w-64 items-center justify-center overflow-hidden rounded-3xl bg-slate-950 ring-2 ring-blue-500">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="h-full w-full object-cover transform -scale-x-100"
                />
              </div>

              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={handleCaptureSnapshot}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-500"
                >
                  <Camera className="h-4 w-4" />
                  <span>Take Snapshot</span>
                </button>

                <button
                  type="button"
                  onClick={startCamera}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Restart Camera</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Image URL */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Direct Image Web Address (HTTPS)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/my-profile-pic.jpg"
                    className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={handleApplyUrl}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900"
                  >
                    Apply URL
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3.5 dark:border-slate-800 dark:bg-slate-900/90">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300"
          >
            Cancel
          </button>

          <button
            id="btn-confirm-save-avatar"
            type="button"
            onClick={handleSaveAndConfirm}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:from-blue-500 hover:to-indigo-500 active:scale-95"
          >
            <Check className="h-4 w-4" />
            <span>Apply & Save Profile Picture</span>
          </button>
        </div>
      </div>
    </div>
  );
}
