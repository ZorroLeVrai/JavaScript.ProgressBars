const pgBarParameters = {
  pgContainerId: "pg-container",
  showPgBar: true,
  pgBarBounded: false,
  maxValue: 100,
  valueSign: "%",
  nbDecimals: 2,
  displayPeriodRatio: true,
  prefixPeriodRatio: "1‰:",
  periodRatio: 1/1000,
  updateIntervalInMs: 100
};

function getMinutePgBarDateTime() {
  const minuteStart = new Date();
  minuteStart.setHours(minuteStart.getHours(), minuteStart.getMinutes(),0,0);
  const minuteEnd = addTime(minuteStart, {nbMinutes: 1});
  return [minuteStart, minuteEnd];
}

function getHourPgBarDateTime() {
  const hourStart = new Date();
  hourStart.setHours(hourStart.getHours(), 0,0,0);
  const hourEnd = addTime(hourStart, {nbHours: 1});
  return [hourStart, hourEnd];
}

function getDayPgDateTime() {
  const today = new Date();
  today.setHours(0,0,0,0);
  const tomorrow = addTime(today, {nbDays: 1});
  return [today, tomorrow];
}

function getMonthDateTime() {
  const today = new Date();
  const startMonth = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
  let endMonth;
  if (today.getMonth() >= 11)
    endMonth = new Date(today.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
  else
    endMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1, 0, 0, 0, 0);
  return [startMonth, endMonth];
}

function getYearDateTime() {
  const today = new Date();
  const startYear = new Date(today.getFullYear(), 0, 1, 0, 0, 0, 0);
  const endYear = new Date(today.getFullYear() + 1, 0, 1, 0, 0, 0, 0);
  return [startYear, endYear];
}

function getCenturyDateTime() {
  const today = new Date();
  const currentYear = today.getFullYear();
  const startCenturyYear = currentYear + 1 - (currentYear % 100);
  const endCenturyYear = startCenturyYear + 100;
  const startCentury = new Date(startCenturyYear, 0, 1, 0, 0, 0, 0);
  const endCentury = new Date(endCenturyYear, 0, 1, 0, 0, 0, 0);
  return [startCentury, endCentury];
}

const [startMonth, endMonth] = getMonthDateTime();
const nbDaysInMonth = (endMonth - startMonth) / 86_400_000;

const [startYear, endYear] = getYearDateTime();
const nbDaysInYear = (endYear - startYear) / 86_400_000;

const pgBarContainer = new ProgressBarContainer(pgBarParameters);
pgBarContainer.addProgressBar({title:"Minute", getDateTime: getMinutePgBarDateTime, nbDecimals: 2, maxValue: 60, valueSign: "/60", reloadProgress: true});
pgBarContainer.addProgressBar({title:"Hour", getDateTime: getHourPgBarDateTime, nbDecimals: 0, maxValue: 60, valueSign: "/60", reloadProgress: true});
pgBarContainer.addProgressBar({title:"Day", getDateTime: getDayPgDateTime, nbDecimals: 0, maxValue: 24, valueSign: "/24", reloadProgress: true});
pgBarContainer.addProgressBar({title:"Month", getDateTime: getMonthDateTime, nbDecimals: 0, maxValue: nbDaysInMonth, valueSign: `/${nbDaysInMonth}`, reloadProgress: true});
pgBarContainer.addProgressBar({title:"Year", getDateTime: getYearDateTime, nbDecimals: 0, maxValue: nbDaysInYear, valueSign: `/${nbDaysInYear}`, reloadProgress: true});
pgBarContainer.addProgressBar({title:"Century", getDateTime: getCenturyDateTime, nbDecimals: 0, maxValue: 100, valueSign: "/100", reloadProgress: true});
pgBarContainer.start();