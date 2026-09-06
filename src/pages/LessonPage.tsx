import { PageId } from '../types';
import { useUser } from '../context/UserContext';
import { useSheAI } from '../context/SheAIContext';
import { LESSON_CONTENTS, LessonData } from '../data/lessonContents';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Sparkles,
  Lightbulb,
  Check,
  TrendingUp,
  Award
} from 'lucide-react';

interface LessonPageProps {
  moduleId: string; // 'm1', 'm2', 'm3'
  onNavigate: (page: PageId) => void;
}

export const LessonPage: React.FC<LessonPageProps> = ({ moduleId, onNavigate }) => {
  const { user, scoreData, toggleModule, isModuleCompleted } = useUser();
  const { openAssistant } = useSheAI();
  const lesson: LessonData | undefined = LESSON_CONTENTS[moduleId] || LESSON_CONTENTS['m1'];
  const isCompleted = isModuleCompleted(lesson.id);

  return (
    <div className="min-h-screen bg-transparent text-[#1e191b] px-4 sm:px-6 py-10 pb-24 text-left">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Navigation & Back Button */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#ece6de] hover:border-stone-400 text-stone-700 hover:text-[#1e191b] text-xs sm:text-sm font-sans font-medium transition cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Learning</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-500 hidden sm:inline">
              Financial Literacy Impact:
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf5f7] border border-[#e9d0dc] text-[#762e50] text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>+10 Points to Literacy</span>
            </span>
          </div>
        </div>

        {/* Lesson Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 card-shadow border border-[#ece6de] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                {lesson.category}
              </span>
              <span className="flex items-center gap-1 text-xs text-stone-500 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>{lesson.time}</span>
              </span>
            </div>

            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>Completed</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full bg-[#faf8f5] text-stone-600 border border-[#ece6de]">
                <Circle className="w-3.5 h-3.5 text-stone-400" />
                <span>In Progress</span>
              </span>
            )}
          </div>

          <h1 className="font-display text-3xl sm:text-4xl text-[#1e191b] font-normal leading-tight tracking-tight">
            {lesson.title}
          </h1>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed font-normal">
            {lesson.overview}
          </p>
        </div>

        {/* Contextual Ask SheAI Entry Point */}
        <div className="p-4 sm:p-5 rounded-2xl bg-[#faf5f7] border border-[#e9d0dc] flex items-center justify-between gap-4 card-shadow">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-[#762e50] shrink-0" />
            <span className="text-xs sm:text-sm text-stone-800 font-medium">
              Need this explained differently?
            </span>
          </div>
          <button
            type="button"
            onClick={() => openAssistant(`Can you explain "${lesson.title}" in simple, beginner-friendly terms?`)}
            className="text-xs sm:text-sm font-semibold text-[#762e50] hover:text-[#521f37] inline-flex items-center gap-1 cursor-pointer transition"
          >
            <span>Ask SheAI</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Main Educational Content Sections */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 card-shadow border border-[#ece6de] space-y-8">
          {lesson.sections.map((section, idx) => (
            <div key={idx} className="space-y-3 pb-6 border-b border-stone-100 last:border-b-0 last:pb-0">
              <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1e191b]">
                {section.heading}
              </h2>
              <div className="space-y-3 text-stone-700 text-sm sm:text-base leading-relaxed">
                {section.paragraphs.map((p, pIdx) => (
                  <p key={pIdx} className="whitespace-pre-line">
                    {p}
                  </p>
                ))}
              </div>

              {section.tips && (
                <div className="p-4 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-1.5 mt-3">
                  <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#762e50]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Key Rule</span>
                  </div>
                  <ul className="space-y-1 text-xs sm:text-sm text-stone-700">
                    {section.tips.map((tip, tIdx) => (
                      <li key={tIdx} className="flex items-start gap-2">
                        <span className="text-[#762e50] font-bold">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Practical Example Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 card-shadow border border-[#ece6de] space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#f2ebe0] text-stone-800 border border-[#e5dcd3] text-xs font-medium">
            <BookOpen className="w-3.5 h-3.5 text-stone-700" />
            <span>Practical Walkthrough</span>
          </div>

          <h3 className="font-display text-2xl font-normal text-[#1e191b]">
            {lesson.practicalExample.scenarioTitle}
          </h3>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {lesson.practicalExample.background}
          </p>

          <div className="grid sm:grid-cols-2 gap-3 pt-2">
            {lesson.practicalExample.breakdown.map((item, bIdx) => (
              <div
                key={bIdx}
                className="p-4 rounded-2xl bg-[#faf8f5] border border-[#ece6de] space-y-1"
              >
                <span className="text-[11px] font-medium text-stone-500 block uppercase tracking-wider">
                  {item.label}
                </span>
                <span className="font-display text-base font-bold text-[#1e191b] block">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#faf5f7] border border-[#e9d0dc] text-xs sm:text-sm text-stone-800 leading-relaxed flex items-start gap-2.5">
            <span className="text-[#762e50] font-bold shrink-0 text-base mt-0.5">💡</span>
            <p>
              <strong className="text-[#1e191b]">The Lesson:</strong> {lesson.practicalExample.lessonLearned}
            </p>
          </div>
        </div>

        {/* Key Takeaways Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 card-shadow border border-[#ece6de] space-y-4">
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-[#762e50]" />
            <h3 className="font-display text-xl sm:text-2xl font-bold text-[#1e191b]">
              Key Takeaways
            </h3>
          </div>

          <div className="space-y-2.5 pt-1">
            {lesson.keyTakeaways.map((takeaway, kIdx) => (
              <div
                key={kIdx}
                className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#faf8f5] border border-[#ece6de]"
              >
                <div className="w-5 h-5 rounded-full bg-stone-200 text-stone-800 flex items-center justify-center shrink-0 text-xs mt-0.5 font-bold">
                  {kIdx + 1}
                </div>
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-medium">
                  {takeaway}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Actionable "Try This" / "Your Next Step" Section */}
        <div className="bg-[#1e191b] text-white rounded-3xl p-6 sm:p-10 card-shadow border border-[#352c31] space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2f252a] text-[#dbc38e] border border-[#44363d] text-xs font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Actionable Exercise</span>
          </div>

          <h3 className="font-display text-2xl sm:text-3xl font-normal text-white tracking-tight">
            Try This: Your Next Step
          </h3>

          <div className="grid sm:grid-cols-2 gap-4 pt-1">
            {lesson.nextSteps.map((step, sIdx) => (
              <div
                key={sIdx}
                className="p-5 rounded-2xl bg-[#262023] border border-[#382e33] space-y-2 text-left"
              >
                <h4 className="font-display font-bold text-white text-base">
                  {step.title}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Mark Complete & Score Impact Section */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-[#ece6de] text-center space-y-5">
          <div className="space-y-1">
            <h3 className="font-display text-xl font-bold text-[#1e191b]">
              Ready to claim your progress?
            </h3>
            <p className="text-xs sm:text-sm text-stone-600">
              Completing this lesson adds <strong>+10 points</strong> to your Financial Literacy component and updates your live SheScore immediately.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <button
              onClick={() => toggleModule(lesson.id)}
              className={`px-8 py-3.5 rounded-full text-xs sm:text-sm font-sans font-medium transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                isCompleted
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-[#1e191b] hover:bg-black text-white hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {isCompleted ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Module Completed (+10 pts)</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Complete (+10 pts)</span>
                </>
              )}
            </button>

            <button
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3.5 rounded-full bg-white border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs sm:text-sm font-sans font-medium transition cursor-pointer"
            >
              Back to Dashboard
            </button>
          </div>

          <p className="text-[11px] text-stone-400">
            Current SheScore: <strong className="text-stone-700">{scoreData.displayScore}</strong> ({scoreData.status}) • Completed Modules: {(user.completedModules || []).length} of 3
          </p>
        </div>
      </div>
    </div>
  );
};
