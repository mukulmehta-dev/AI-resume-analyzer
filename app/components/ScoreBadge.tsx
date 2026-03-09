interface ScoreBadgeProps {
  score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
  let badgeColor = '';
  let badgeText = '';

  if (score > 85) {
    badgeColor = 'bg-badge-green text-green-600';
    badgeText = 'Strong';
  } else if (score > 75) {
    badgeColor = 'bg-badge-blue text-blue-600';
    badgeText = 'Very Good';
  } else if (score > 60) {
    badgeColor = 'bg-badge-yellow text-yellow-600';
    badgeText = 'Good';
  } else {
    badgeColor = 'bg-badge-red text-red-600';
    badgeText = 'Needs Work';
  }

  return (
    <div className={`px-3 py-1 rounded-full ${badgeColor}`}>
      <p className="text-sm font-medium">{badgeText}</p>
    </div>
  );
};

export default ScoreBadge;