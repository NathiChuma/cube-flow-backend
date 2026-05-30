const average = (arr: number[]): number => {
  if (!arr.length) return 0;
  return arr.reduce((sum, val) => sum + val, 0) / arr.length;
};

export default average;
