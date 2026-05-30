const formatMs = (ms: number | null | undefined): number | null => {
  if (ms == null || isNaN(ms)) return null;
  return Number((ms / 1000).toFixed(2));
};

export default formatMs;
