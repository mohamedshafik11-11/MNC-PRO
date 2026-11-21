import { useState } from 'react';
import {
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Star,
  PlayCircle,
  TrendingUp,
  Sparkles,
  Zap,
  ChevronRight,
  ExternalLink,
  Lock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CourseItem, UserProfile } from '../types';

interface SkillsCoursesViewProps {
  courses: CourseItem[];
  user: UserProfile;
}

export function SkillsCoursesView({ courses, user }: SkillsCoursesViewProps) {
  const [activeTab, setActiveTab] = useState<'courses' | 'skills'>('courses');
  const [courseList, setCourseList] = useState<CourseItem[]>(courses);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);

  const handleCompleteModule = (courseId: string) => {
    setCourseList((prev) =>
      prev.map((c) => {
        if (c.id === courseId) {
          const nextVal = Math.min(c.totalModules, c.completedModules + 1);
          if (nextVal === c.totalModules) {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          }
          return { ...c, completedModules: nextVal };
        }
        return c;
      })
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header with Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-blue-600" />
            Skills Matrix & MNC Courses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            System Design, LeetCode patterns, STAR behavioral mastery, and aptitude screening roadmaps.
          </p>
        </div>

        <div className="flex items-center rounded-2xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition ${
              activeTab === 'courses'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span>MNC Courses ({courseList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('skills')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-1.5 text-xs font-bold transition ${
              activeTab === 'skills'
                ? 'bg-white text-blue-600 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-300'
            }`}
          >
            <Award className="h-3.5 w-3.5" />
            <span>Skill Matrix</span>
          </button>
        </div>
      </div>

      {/* Courses Tab */}
      {activeTab === 'courses' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {courseList.map((course) => {
            const progressPercent = Math.round((course.completedModules / course.totalModules) * 100);

            return (
              <div
                key={course.id}
                className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-xs transition hover:border-blue-400 hover:shadow-md dark:border-slate-800 dark:bg-slate-850 space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-900">
                      {course.category}
                    </span>
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <Star className="h-3.5 w-3.5 fill-amber-400" />
                      <span>{course.rating}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      Focused for: <strong className="text-slate-700 dark:text-slate-200">{course.companyFocus}</strong>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">By {course.instructor}</p>
                  </div>

                  {/* Skills Taught */}
                  <div className="flex flex-wrap gap-1">
                    {course.skillsTaught.map((skill, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span>{course.completedModules} of {course.totalModules} Lessons</span>
                      <span>{progressPercent}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2">
                  <span className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Clock className="h-3.5 w-3.5" />
                    {course.duration}
                  </span>

                  <button
                    id={`btn-complete-lesson-${course.id}`}
                    onClick={() => handleCompleteModule(course.id)}
                    className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-blue-500 transition shadow-xs"
                  >
                    <PlayCircle className="h-3.5 w-3.5" />
                    <span>{progressPercent === 100 ? 'Completed' : 'Continue Lesson'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Skills Matrix Tab */}
      {activeTab === 'skills' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {user.skills.map((skill, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-850 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
                    <Zap className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">{skill.name}</h3>
                    <p className="text-[10px] text-slate-400">MNC Verified Proficiency</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{skill.level}%</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
              </div>

              <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className="h-2 rounded-full bg-blue-600"
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
                <span>Percentile: Top {100 - skill.level + 2}%</span>
                <span className="text-blue-600 dark:text-blue-400 font-semibold">Tier-1 Cleared</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
