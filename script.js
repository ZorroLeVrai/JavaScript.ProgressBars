const pgBarParameters = {
  pgContainerId: "pg-container",
  showPgBar: true,
  pgBarBounded: false,
  displayPeriodRatio: true,
  prefixPeriodRatio: "1‰:",
  periodRatio: 1/1000,
  updateIntervalInMs: 100
};

const pgBarContainer = new ProgressBarContainer(pgBarParameters);
pgBarContainer.addProgressBar("AA", new Date(2024,0,23,0,0,0), new Date(2024,0,24,0,0,0),4);
pgBarContainer.addProgressBar("BBBBBBBBBBBB", new Date(2024,0,23,0,0,0), new Date(2024,0,24,0,0,0),2);
pgBarContainer.start();