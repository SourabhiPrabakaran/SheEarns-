import React, { useState } from 'react';
import { PageId } from '../types';
import { INDEPENDENCE_QUESTIONS, NCW_HELPLINE_URL, IndependenceQuestion } from '../data/independenceData';
import { ShieldCheck, ArrowLeft, ExternalLink, RotateCcw, HeartHandshake } from 'lucide-react';

interface IndependencePageProps {
  onNavigate: (page: PageId) => void;
}

type AnswerValue = 'yes' | 'sometimes' | 'no';

export const IndependencePage: React.FC<IndependencePageProps> = ({ onNavigate }) => {
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSelect = (questionId: number, value: AnswerValue) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const isComplete = INDEPENDENCE_QUESTIONS.every((q: IndependenceQuestion) => answers[q.id]);

  const noCount = Object.values(answers).filter(v => v === 'no').length;
  const sometimesCount = Object.values(answers).filter(v => v === 'sometimes').length;

  const getReflectionText = () => {
    if (noCount === 0 && sometimesCount === 0) {
      return "Your responses suggest you currently have independent access across all the areas we asked about. Continuing to maintain full autonomy over your accounts, records, and emergency cash provides a strong foundation for lifelong financial confidence.";
    }
    if (noCount >= 3 || (noCount + sometimesCount) >= 4) {
      return "Your responses indicate that there may be significant areas where your independent access to money or financial information could be strengthened. Many people find that even small, discrete steps toward greater personal access — taken whenever it feels safe to do so — make a profound difference in independence.";
    }
    return "Your responses indicate that while you have independence in some areas, there are one or more key spots where your personal access to financial resources could be expanded. Building awareness is the first positive step toward securing your peace of mind.";
  };

  const handleRetake = () => {
    setAnswers({});
    setIsSubmitted(false);
  };

  return (
    <div className="min-h-screen bg-transparent text-[#1e191b] px-4 sm:px-6 py-12 pb-24 text-left">
      <div className="max-w-xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#f2ebe0] text-stone-800 border border-[#e5dcd3] text-xs font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-stone-700" />
            <span>Private & Confidential</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl text-[#1e191b] font-normal tracking-tight">
            Financial Independence <span className="italic font-serif text-[#762e50]">Check</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            A private space for gentle self-reflection. There are no right or wrong answers — only information that belongs entirely to you.
          </p>
        </div>

        {/* Questionnaire Form */}
        {!isSubmitted ? (
          <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-[#ece6de] space-y-6">
            <div className="space-y-6">
              {INDEPENDENCE_QUESTIONS.map((q: IndependenceQuestion) => {
                const selected = answers[q.id];
                return (
                  <div key={q.id} className="space-y-3 pb-5 border-b border-[#ece6de] last:border-0 last:pb-0">
                    <p className="text-xs sm:text-sm font-semibold text-[#1e191b] leading-snug">
                      {q.id}. {q.question}
                    </p>
                    <div className="flex gap-2">
                      {(['yes', 'sometimes', 'no'] as AnswerValue[]).map(option => (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleSelect(q.id, option)}
                          className={`flex-1 py-2 rounded-full text-xs font-medium capitalize transition-all border ${
                            selected === option
                              ? 'bg-[#1e191b] text-white border-[#1e191b] shadow-xs'
                              : 'bg-[#faf8f5] text-stone-700 border-[#ece6de] hover:bg-stone-100'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              disabled={!isComplete}
              onClick={() => setIsSubmitted(true)}
              className={`w-full py-3.5 rounded-full font-medium text-xs sm:text-sm transition-all shadow-xs ${
                isComplete
                  ? 'bg-[#1e191b] hover:bg-black text-white cursor-pointer hover:scale-[1.01]'
                  : 'bg-stone-200 text-stone-400 cursor-not-allowed'
              }`}
            >
              {isComplete ? 'See Reflection' : 'Answer all 5 questions to continue'}
            </button>
          </div>
        ) : (
          /* Results View */
          <div className="bg-white rounded-3xl p-6 sm:p-8 card-shadow border border-[#ece6de] space-y-6">
            {/* Reflection Callout */}
            <div className="p-6 rounded-2xl bg-[#faf8f5] border border-[#ece6de]">
              <div className="flex items-center gap-2 mb-2 text-[#1e191b] font-display font-bold text-base">
                <HeartHandshake className="w-4 h-4 text-[#762e50]" />
                <span>Reflection Insight</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed font-normal">
                {getReflectionText()}
              </p>
            </div>

            {/* Gentle Next Steps */}
            <div className="space-y-3">
              <h3 className="font-display font-bold text-[#1e191b] text-base">
                Gentle next steps you might consider:
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-600">
                <li className="flex items-start gap-2">
                  <span className="text-[#762e50] font-bold">•</span>
                  <span><strong>Build an independent emergency fund:</strong> Kept in your own separate, liquid savings account.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#762e50] font-bold">•</span>
                  <span><strong>Maintain digital & physical copies:</strong> Ensure personal access to identification, bank statements, and tax records.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#762e50] font-bold">•</span>
                  <span><strong>Understand your financial rights:</strong> Learn about individual account ownership, nomination rights, and credit reports.</span>
                </li>
              </ul>
            </div>

            {/* Helpline / Verified Support Link */}
            <div className="pt-3 border-t border-[#ece6de] space-y-2">
              <a
                href={NCW_HELPLINE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#1e191b] hover:bg-black text-white font-medium rounded-full transition text-xs sm:text-sm shadow-xs"
              >
                <span>Explore Verified Helplines & Resources</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <p className="text-[11px] text-stone-500 text-center">
                Direct link to verified Indian public helplines including the National Commission for Women (NCW).
              </p>
            </div>

            {/* Retake Button */}
            <div className="text-center pt-2">
              <button
                onClick={handleRetake}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-[#1e191b] transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Retake reflection</span>
              </button>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center">
          <button
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-[#1e191b] transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
      </div>
    </div>
  );
};
