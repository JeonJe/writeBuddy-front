import React, { useMemo } from 'react';
import './ProgressBar.css';

interface ProgressBarProps {
  current: number;
  total: number;
}

type ProgressColor = 'blue' | 'yellow' | 'green' | 'purple';

export const ProgressBar: React.FC<ProgressBarProps> = ({ current, total }) => {
  const { percentage, displayPercentage, color, overGoal } = useMemo(() => {
    const safeTotal = total <= 0 ? 1 : total;
    const raw = (current / safeTotal) * 100;
    const capped = Math.min(raw, 100);
    const over = current > safeTotal;

    const resolvedColor: ProgressColor = (() => {
      if (over) return 'purple';
      if (capped >= 81) return 'green';
      if (capped >= 51) return 'yellow';
      return 'blue';
    })();

    return {
      percentage: capped,
      displayPercentage: Math.round(raw),
      color: resolvedColor,
      overGoal: over,
    };
  }, [current, total]);

  return (
    <div className="progress-container">
      <div className="progress-top">
        <div className="progress-text">
          복습 중 {current}/{total}
          {overGoal ? ` (${displayPercentage}%)` : ''}
        </div>
        <div className="progress-percent">{Math.min(displayPercentage, 100)}%</div>
      </div>

      <div className="progress-bar-wrapper" aria-label="복습 진행률">
        <div className={`progress-bar-fill ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};
