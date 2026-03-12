import React from 'react';

interface Suggestion {
  type: "good" | "improve";
  tip: string;
}

interface ATSProps {
  score: number;
  suggestions: Suggestion[];
}

const ATS: React.FC<ATSProps> = ({ score, suggestions }) => {
  // Softer, more eye-friendly colors based on score range
  const getNeonColor = () => {
    if (score > 85) return '#2dd4bf'; // softer teal
    if (score > 75) return '#60a5fa'; // soft blue
    if (score > 60) return '#fbbf24'; // warm amber
    return '#f472b6'; // soft pink
  };

  const neonColor = getNeonColor();

  const subtitle = score > 85
    ? 'Excellent'
    : score > 75
      ? 'Very Good'
      : score > 60
        ? 'Good'
        : 'Needs Work';

  return (
    <div
      className="bg-[#0a0a0f] rounded-2xl w-full p-6 transition-all duration-300 hover:scale-[1.01]"
      style={{
        border: `1px solid ${neonColor}`,
        boxShadow: `0 0 15px ${neonColor}40`, // reduced opacity
      }}
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img
            src={score > 60 ? '/icons/ats-good.svg' : '/icons/ats-bad.svg'}
            alt="ATS Score Icon"
            className="w-12 h-12"
            style={{ filter: `drop-shadow(0 0 6px ${neonColor})` }} // softer glow
          />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#a78bfa] via-[#60a5fa] to-[#f472b6]">
            ATS Score - {score}/100
          </h2>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2" style={{ color: neonColor, textShadow: `0 0 4px ${neonColor}` }}>
          {subtitle}
        </h3>
        <p className="text-gray-400 mb-4">
          This score represents how well your resume is likely to perform in Applicant Tracking Systems used by employers.
        </p>

        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start gap-3">
              <img
                src={suggestion.type === "good" ? "/icons/check.svg" : "/icons/warning.svg"}
                alt={suggestion.type === "good" ? "Check" : "Warning"}
                className="w-5 h-5 mt-1"
                style={{
                  filter: suggestion.type === "good"
                    ? 'drop-shadow(0 0 4px #2dd4bf)'
                    : 'drop-shadow(0 0 4px #f472b6)'
                }}
              />
              <p className={suggestion.type === "good" ? "text-soft-green" : "text-soft-pink"}>
                {suggestion.tip}
              </p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-gray-500 italic border-t border-[#a78bfa]/20 pt-4">
        Keep refining your resume to improve your chances of getting past ATS filters and into the hands of recruiters.
      </p>

      <style>{`
        .text-soft-green { color: #2dd4bf; text-shadow: 0 0 3px #2dd4bf; }
        .text-soft-pink { color: #f472b6; text-shadow: 0 0 3px #f472b6; }
      `}</style>
    </div>
  );
};

export default ATS;