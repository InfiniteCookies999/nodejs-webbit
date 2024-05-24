export default function getTimeAgo(timeStamp) {
  const seconds = Math.floor((new Date() - new Date(timeStamp)) / 1000);

  const pluralize = (time, unit) => {
    const t = Math.floor(time);
    return t + " " + unit + (t > 1 ? "s" : "") + " ago";
  };

  let time = seconds / 3.154e+7;
  if (time > 1) {
    return pluralize(time, "year");
  }
  time = seconds / 2592000;
  if (time > 1) {
    return pluralize(time, "month");
  }
  time = seconds / 86400;
  if (time > 1) {
    return pluralize(time, "day");
  }
  time = seconds / 3600;
  if (time > 1) {
    return pluralize(time, "hour");
  }
  time = seconds / 60;
  if (time > 1) {
    return pluralize(time, "minute");
  }

  return pluralize(time, "second");
}