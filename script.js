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

const pgBarContainer = new ProgressBarContainer(pgBarParameters);
pgBarContainer.addProgressBar({title:"Day", getDateTime: () => [new Date(2024,0,23,0,0,0), new Date(2024,0,24,0,0,0)], nbDecimals: 4});
pgBarContainer.addProgressBar({title:"Minute", getDateTime: getMinutePgBarDateTime, nbDecimals: 2, reloadProgress: true});
pgBarContainer.start();