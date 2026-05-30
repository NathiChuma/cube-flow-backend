import average from './average';
import { Solve } from '../../types';

const calculateAo = (solves: Solve[], count: number): number | null => {
  const validSolves = solves.filter((s) => !s.dnf).slice(0, count);

  if (validSolves.length < count) return null;

  const times = validSolves
    .map((s) => s.time)
    .sort((a, b) => a - b);

  // Remove best and worst
  times.shift();
  times.pop();

  return average(times);
};

export default calculateAo;
