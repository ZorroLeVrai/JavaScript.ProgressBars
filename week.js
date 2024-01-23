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

function getWeekDateTime() {
  const today = new Date();
  const weekDay = today.getDay();
  const startWeekDate = addTime(today, {nbDays: -1*weekDay+1});
  const endWeekDate = addTime(today, {nbDays: -1*weekDay+8});
  const startWeek = new Date(startWeekDate.getFullYear(), startWeekDate.getMonth(), startWeekDate.getDate(), 0, 0, 0, 0);
  const endWeek = new Date(endWeekDate.getFullYear(), endWeekDate.getMonth(), endWeekDate.getDate(), 0, 0, 0, 0);
  return [startWeek, endWeek];
}

function getWeekDaysDateTime() {
  const today = new Date();
  const weekDay = today.getDay();
  const startWeekDate = addTime(today, {nbDays: -1*weekDay+1});
  const endWeekDaysDate = addTime(today, {nbDays: -1*weekDay+5});
  const startWeekDays = new Date(startWeekDate.getFullYear(), startWeekDate.getMonth(), startWeekDate.getDate(), 0, 0, 0, 0);
  const endWeekDays = new Date(endWeekDaysDate.getFullYear(), endWeekDaysDate.getMonth(), endWeekDaysDate.getDate(), 18, 0, 0, 0);
  return [startWeekDays, endWeekDays];
}

function getWeekEndDateTime() {
  const today = new Date();
  const weekDay = today.getDay();
  const startWeekEndDate = addTime(today, {nbDays: -1*weekDay+5});
  const endWeekDate = addTime(today, {nbDays: -1*weekDay+8});
  const startWeekEnd = new Date(startWeekEndDate.getFullYear(), startWeekEndDate.getMonth(), startWeekEndDate.getDate(), 18, 0, 0, 0);
  const endWeekEnd = new Date(endWeekDate.getFullYear(), endWeekDate.getMonth(), endWeekDate.getDate(), 0, 0, 0, 0);
  return [startWeekEnd, endWeekEnd];
}

const pgBarContainer = new ProgressBarContainer(pgBarParameters);
pgBarContainer.addProgressBar({title:"Week", getDateTime: getWeekDateTime, nbDecimals: 2, reloadProgress: true});
pgBarContainer.addProgressBar({title:"Week Days", getDateTime: getWeekDaysDateTime, nbDecimals: 2, reloadProgress: true});
pgBarContainer.addProgressBar({title:"Week End", getDateTime: getWeekEndDateTime, nbDecimals: 2, reloadProgress: true});
pgBarContainer.start();