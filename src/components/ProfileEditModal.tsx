import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Save,
  Building2,
  DollarSign,
  Linkedin,
  MapPin,
  Mail,
  Plus,
  Trash2,
  Sparkles,
  Camera,
  CheckCircle2,
  ShieldCheck,
  Github,
  Globe,
  Briefcase,
  Upload,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { UserProfile } from '../types';
import { calculateAtsScore } from '../utils/storage';
import { AvatarUploadModal } from './AvatarUploadModal';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updated: UserProfile) => void;
}

export function ProfileEditModal({ isOpen, onClose, user, onSave }: ProfileEditModalProps) {
  const [formData, setFormData] = useState<UserProfile>({ ...user });
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState(85);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  // Synchronize formData whenever modal opens or user prop updates
  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...user,
        skills: user.skills ? JSON.parse(JSON.stringify(user.skills)) : [],
      });
      setSaveSuccessMsg(false);
    }
  }, [isOpen, user]);

  if (!isOpen) return null;

  const liveAtsScore = calculateAtsScore(formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const finalizedProfile: UserProfile = {
      ...formData,
      atsScore: liveAtsScore,
      stats: {
        ...formData.stats,
        // Update profile score dynamically
        mncReadinessPercentage: Math.max(
          formData.stats?.mncReadinessPercentage || 80,
          Math.min(98, Math.round((liveAtsScore + (formData.stats?.aptitudeScoreAvg || 88)) / 2))
        ),
      },
    };

    onSave(finalizedProfile);
    setSaveSuccessMsg(true);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });

    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return;
    const trimmed = newSkillName.trim();
    if (formData.skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      return; // Already present
    }
    setFormData((prev) => ({
      ...prev,
      skills: [...prev.skills, { name: trimmed, level: newSkillLevel, verified: true }],
    }));
    setNewSkillName('');
  };

  const handleRemoveSkill = (skillName: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s.name !== skillName),
    }));
  };

  return (
    <div
      id="profile-edit-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
    >
      <div
        id="profile-edit-window"
        className="relative flex h-full max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-slate-900/10 dark:bg-slate-900 dark:ring-slate-800 text-slate-900 dark:text-white"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-600 font-bold text-white shadow-xs">
              <User className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Edit MNC Candidate Profile</h3>
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                  <ShieldCheck className="h-3 w-3" />
                  Auto-Persisted
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update career goals, target CTC, skills matrix & verified links
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live ATS preview pill */}
            <div className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>Projected ATS: {liveAtsScore}%</span>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {saveSuccessMsg && (
            <div className="rounded-2xl bg-emerald-500 p-3 text-xs font-bold text-white shadow-md flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Profile saved & permanently synchronized to persistent storage!</span>
            </div>
          )}

          {/* Avatar & Basic Info */}
          <div className="flex items-center gap-4">
            <div
              className="relative group cursor-pointer"
              onClick={() => setIsAvatarModalOpen(true)}
              title="Click to change profile picture (File upload, Camera, Presets)"
            >
              <img
                src={formData.avatar}
                alt={formData.name}
                className="h-16 w-16 rounded-2xl object-cover ring-2 ring-blue-500/40 group-hover:ring-blue-600 transition"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=250&auto=format&fit=crop&q=80';
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAvatarModalOpen(true);
                }}
                className="absolute -bottom-1 -right-1 rounded-full bg-blue-600 p-1.5 text-white shadow-md hover:bg-blue-500 transition group-hover:scale-110"
                title="Update Profile Picture"
              >
                <Camera className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
                <input
                  id="input-edit-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
                <input
                  id="input-edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Role & Target Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Role / Title</label>
              <input
                id="input-edit-target-role"
                type="text"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value, title: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Dream Target MNC</label>
              <input
                id="input-edit-target-company"
                type="text"
                value={formData.targetCompany}
                onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          {/* Location, Experience & Compensation */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Location</label>
              <input
                id="input-edit-location"
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Years Experience</label>
              <input
                id="input-edit-experience-years"
                type="number"
                min="0"
                max="30"
                value={formData.experienceYears || 5}
                onChange={(e) => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Annual CTC</label>
              <input
                id="input-edit-target-ctc"
                type="text"
                value={formData.targetCtc}
                onChange={(e) => setFormData({ ...formData, targetCtc: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Online Presence & Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">LinkedIn Profile</label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0A66C2]" />
                <input
                  id="input-edit-linkedin"
                  type="text"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">GitHub / Code Portfolio</label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-700 dark:text-slate-300" />
                <input
                  id="input-edit-github"
                  type="text"
                  value={formData.githubUrl}
                  onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  placeholder="https://github.com/username"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Executive Summary / ATS High-Impact Bio
            </label>
            <textarea
              id="textarea-edit-bio"
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              placeholder="Highlight technical specialties, scale metrics (RPS, users), and primary frameworks..."
            />
          </div>

          {/* Skills Management */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                Verified Technical Skills ({formData.skills.length})
              </label>
              <span className="text-[11px] text-slate-400">Add or adjust proficiency levels</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800 dark:border-blue-900/50 dark:bg-blue-950 dark:text-blue-200"
                >
                  <span>
                    {skill.name} ({skill.level}%)
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill.name)}
                    className="text-blue-400 hover:text-rose-600 transition"
                    title={`Remove ${skill.name}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>

            {/* Add skill input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="New technical skill (e.g. Distributed Caching, Redis Lua, Kafka)"
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-slate-400">{newSkillLevel}%</span>
                <input
                  type="range"
                  min="60"
                  max="100"
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(Number(e.target.value))}
                  className="w-20 cursor-pointer accent-blue-600"
                />
              </div>
              <button
                type="button"
                onClick={handleAddSkill}
                className="rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white hover:bg-blue-500 transition"
              >
                Add Skill
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              id="btn-save-profile"
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:from-blue-500 hover:to-indigo-500 transition active:scale-95"
            >
              <Save className="h-4 w-4" />
              <span>Save & Persist Profile Changes</span>
            </button>
          </div>
        </form>

        {/* Dedicated Avatar Picture Upload Modal */}
        <AvatarUploadModal
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
          currentAvatar={formData.avatar}
          onSaveAvatar={(newUrl) => {
            setFormData((prev) => ({ ...prev, avatar: newUrl }));
          }}
        />
      </div>
    </div>
  );
}
