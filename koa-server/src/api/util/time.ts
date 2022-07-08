export const now = () => new Date();

export const addMilliseconds = (date: Date, milliseconds: number) => {
  date.setMilliseconds(date.getMilliseconds() + milliseconds);
  return date;
};
export const addSeconds = (date: Date, seconds: number) => {
  date.setSeconds(date.getSeconds() + seconds);
  return date;
};
export const addMinutes = (date: Date, minutes: number) => {
  date.setMinutes(date.getMinutes() + minutes);
  return date;
};
export const addHours = (date: Date, hours: number) => {
  date.setHours(date.getHours() + hours);
  return date;
};
export const addDays = (date: Date, days: number) => {
  date.setDate(date.getDate() + days);
  return date;
};
