export type AuthProvider = 'google' | 'apple' | 'twitter' | 'social' | 'email';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  title: string;
  bio: string;
  targetCompany: string;
  targetRole: string;
  targetCtc: string;
  experienceYears: number;
  location: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  resumeFileName: string;
  atsScore: number;
  skills: { name: string; level: number; verified: boolean }[];
  influenceRank: string;
  profileScore: number;
  verifiedAuthMethod: AuthProvider;
  stats: {
    appliedJobs: number;
    interviewsScheduled: number;
    aptitudeScoreAvg: number;
    weeklyTasksDone: number;
    streakDays: number;
    mncReadinessPercentage: number;
  };
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'Onsite';
  salary: string;
  type: 'Full-time' | 'Contract' | 'Internship';
  experience: string;
  atsMatchScore: number;
  tags: string[];
  description: string;
  keyRequirements: string[];
  hiringRounds: string[];
  postedAgo: string;
  applicantsCount: number;
  isApplied?: boolean;
  featured?: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  category: 'Resume' | 'Certificate' | 'Offer Letter' | 'Assignment' | 'Transcript';
  fileSize: string;
  uploadedAt: string;
  atsScore?: number;
  tags: string[];
  url?: string;
}

export interface SkillCategory {
  category: string;
  skills: {
    name: string;
    level: number;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    topMncMatch: string[];
  }[];
}

export interface CourseItem {
  id: string;
  title: string;
  companyFocus: string;
  instructor: string;
  totalModules: number;
  completedModules: number;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  rating: number;
  category: 'DSA & Algorithms' | 'System Design' | 'Behavioral & STAR' | 'Cloud & DevOps' | 'Aptitude & Quant';
  skillsTaught: string[];
  isEnrolled: boolean;
}

export interface WeeklyTaskItem {
  id: string;
  title: string;
  category: 'Aptitude' | 'Coding' | 'System Design' | 'Resume & LinkedIn' | 'Mock Interview' | 'LinkedIn' | 'Mock';
  priority: 'High' | 'Medium' | 'Low';
  estimatedMinutes?: number;
  completed: boolean;
  dueDate: string;
  points: number;
}

export type WeeklyTask = WeeklyTaskItem;

export interface InterviewReviewItem {
  id: string;
  company: string;
  role: string;
  date: string;
  roundType?: string;
  type?: 'AI Video Mock' | 'AI Voice Coach' | 'Aptitude Round' | 'Technical Round 1' | string;
  score?: number;
  overallScore?: number;
  verdict: 'Strong Hire' | 'Hire' | 'Needs Practice' | string;
  keyFeedback?: string;
  feedbackSummary?: string;
  strengths: string[];
  improvements: string[];
  durationMinutes?: number;
}

export type MockInterviewSession = InterviewReviewItem;

export interface AptitudeQuestion {
  id: string;
  category: 'Quantitative' | 'Logical Reasoning' | 'Verbal Ability' | 'Core CS Fundamentals';
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  speedShortcutTip: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
}

export interface MasterPromptTemplate {
  id: string;
  title: string;
  description: string;
  companyTarget: string;
  role: string;
  promptText: string;
  tags: string[];
}

export interface CompanyIntelligence {
  id: string;
  name: string;
  logo: string;
  industry: string;
  hq: string;
  website: string;
  careersUrl: string;
  githubOrg: string;
  overview: string;
  openSourceProjects: {
    name: string;
    description: string;
    stars?: string;
    language: string;
    url: string;
  }[];
  techStack: string[];
  salaryBands: {
    level: string;
    role: string;
    base: string;
    totalComp: string;
  }[];
  hiringProcess: {
    roundName: string;
    description: string;
    focus: string;
  }[];
  activeRoles: {
    title: string;
    location: string;
    experience: string;
    salary: string;
    workMode: 'Remote' | 'Hybrid' | 'Onsite';
    tags: string[];
  }[];
  source: 'Google Knowledge & Open Source' | 'Verified MNC Registry';
  lastSyncedAt: string;
}

