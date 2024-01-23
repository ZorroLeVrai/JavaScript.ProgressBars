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

const pgBarContainer = new ProgressBarContainer(pgBarParameters);
pgBarContainer.addProgressBar({title:"AA", startDT: new Date(2024,0,23,0,0,0), endDT: new Date(2024,0,24,0,0,0), nbDecimals: 4});
pgBarContainer.addProgressBar({title:"BBBBBBBBBBBB", startDT: new Date(2024,0,23,0,0,0), endDT: new Date(2024,0,24,0,0,0), nbDecimals: 2});
pgBarContainer.start();