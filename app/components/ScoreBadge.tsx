type ScoreBadgeProps = {
  score: number;
};

const ScoreBadge = ({ score }: ScoreBadgeProps) => {
  let badgeClass = "bg-badge-red text-red-600";
  let label = "Needs work";

  if (score > 70) {
    badgeClass = "bg-badge-green text-green-600";
    label = "Strong";
  } else if (score > 49) {
    badgeClass = "bg-badge-yellow text-yellow-600";
    label = "Good start";
  }

  return (
    <div
      className={`inline-flex items-center px-2 py-1 rounded-full ${badgeClass}`}
    >
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
};

export default ScoreBadge;
