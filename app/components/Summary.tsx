import ScoreGauge from "~/components/ScoreGauge";
import ScoreBadge from "~/components/ScoreBadge";

const Category = ({ title, score }: { title: string; score: number }) => {
  // Neon color mapping based on score
  const getScoreColor = (score: number) => {
    if (score > 70) return "text-neon-green drop-shadow-[0_0_8px_#00ffaa]";
    if (score > 49) return "text-neon-yellow drop-shadow-[0_0_8px_#ffff00]";
    return "text-neon-pink drop-shadow-[0_0_8px_#ff00ff]";
  };

  return (
    <div className="resume-summary w-full">
      <div className="category flex flex-row items-center justify-between bg-[#111] border border-[#a855f7]/30 rounded-2xl p-4 hover:border-[#a855f7] hover:shadow-[0_0_20px_#a855f7] transition-all duration-300">
        <div className="flex flex-row gap-2 items-center">
          <p className="text-2xl text-gray-200 font-medium">{title}</p>
          <ScoreBadge
            score={score}
            
          />
        </div>
        <p className="text-2xl font-mono">
          <span className={getScoreColor(score)}>{score}</span>
          <span className="text-gray-400">/100</span>
        </p>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  return (
    <div className="bg-[#0a0a0f] border border-[#a855f7]/30 rounded-2xl shadow-[0_0_30px_#a855f7]/20 w-full hover:border-[#a855f7] hover:shadow-[0_0_40px_#a855f7] transition-all duration-500">
      <div className="flex flex-row items-center p-4 gap-8 border-b border-[#a855f7]/20">
        <ScoreGauge
          score={feedback.overallScore}
          
        />
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a855f7] via-[#3b82f6] to-[#ec4899]">
            Your Resume Score
          </h2>
          <p className="text-sm text-gray-400">
            This score is calculated based on the variables listed below.
          </p>
        </div>
      </div>

      <div className="p-2 space-y-2">
        <Category title="Tone & Style" score={feedback.toneAndStyle.score} />
        <Category title="Content" score={feedback.content.score} />
        <Category title="Structure" score={feedback.structure.score} />
        <Category title="Skills" score={feedback.skills.score} />
      </div>
    </div>
  );
};

export default Summary;