import React, { useState, useEffect } from 'react';

interface AnimatedNumberProps {
  value: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
  duration = 1000
}) => {
  const [displayValue, setDisplayValue] = useState<number>(value);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    const change = value - startValue;

    if (change === 0) return;

    let frameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(startValue + change * ease));

      if (progress < 1) {
        frameId = requestAnimationFrame(step);
      }
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {displayValue.toLocaleString('en-IN')}
      {suffix}
    </span>
  );
};
