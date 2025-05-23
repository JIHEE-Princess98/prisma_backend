export const getKoreaTime = () => {
  const now = new Date();
  const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC+9
  return koreaTime;
};
