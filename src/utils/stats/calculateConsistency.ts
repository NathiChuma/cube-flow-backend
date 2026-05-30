import average from './average';
import { ConsistencyStats, Solve } from '../../types';

const calculateConsistency = (solves: Solve[]): ConsistencyStats => {
  const validSolves = solves.filter((s) => !s.dnf);

  if (validSolves.length === 0) {
    return { excellent: 0, good: 0, fair: 0, poor: 0 };
  }

  const times = validSolves.map((s) => s.time);
  const avg = average(times);

  let excellent = 0;
  let good = 0;
  let fair = 0;
  let poor = 0;

  times.forEach((time) => {
    const diffSeconds = Math.abs(time - avg) / 1000;

    if (diffSeconds <= 1) excellent++;
    else if (diffSeconds <= 2) good++;
    else if (diffSeconds <= 4) fair++;
    else poor++;
  });

  const total = times.length;

  return {
    excellent: Math.round((excellent / total) * 100),
    good: Math.round((good / total) * 100),
    fair: Math.round((fair / total) * 100),
    poor: Math.round((poor / total) * 100),
  };
};

export default calculateConsistency;
