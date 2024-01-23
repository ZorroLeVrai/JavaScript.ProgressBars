const ONE_DAY_IN_MS = 86_400_000;
const ONE_HOUR_IN_MS = 3_600_000;
const ONE_MINUTE_IN_MS = 60_000;
const ONE_SECOND_IN_MS = 1_000;

class Progress {
  constructor({startDT,
      endDT,
      maxValue = 100,
      bounded = false}) {
    this.startDT = startDT;
    this.endDT = endDT;
    this.wholePeriod = this.endDT - this.startDT;
    this.maxValue = maxValue;
    this.bounded = bounded;
  }

  getProgress() {
    let result = getRatio(this);
    if (this.bounded) {
      if (result < 0)
        result = 0;
      else if (result > 1)
        result = 1;
    }
    return this.maxValue*result;

    function getRatio(self) {
      const currentDT = new Date();
      const currentPeriod = currentDT - self.startDT;
      return currentPeriod / self.wholePeriod;
    }
  }

  getWholePeriodInMs(ratio = 1) {
    return ratio * this.wholePeriod;
  }
}

class ProgressBar {
  constructor({
      title,
      startDT,
      endDT,
      maxValue = 100,
      valueSign = "%",
      nbDecimals = 2,
      bounded = false,
      displayPeriodRatio = true,
      prefixPeriodRatio = "1‰:",
      periodRatio = 1/1000}) {
    this.title = title;
    this.progress = new Progress({startDT, endDT, maxValue, bounded});
    this.maxValue = maxValue;
    this.valueSign = valueSign;
    this.nbDecimals = nbDecimals;
    this.displayPeriodRatio = displayPeriodRatio;
    this.prefixPeriodRatio = prefixPeriodRatio;
    this.periodRatio = periodRatio;

    this.progressBarElement = null;
    this.progressBarTextElement = null;
  }

  getPeriodPerMilleText(prefix, ratio) {
    const periodPerMilleInMs = this.progress.getWholePeriodInMs(ratio);
    const periodNbDecimals = 1;

    let periodInfo = "";
    if (periodPerMilleInMs > ONE_DAY_IN_MS)
      periodInfo = `${(periodPerMilleInMs / ONE_DAY_IN_MS).toFixed(periodNbDecimals)} days`;
    else if (periodPerMilleInMs > ONE_HOUR_IN_MS)
      periodInfo = `${(periodPerMilleInMs / ONE_HOUR_IN_MS).toFixed(periodNbDecimals)} hours`;
    else if (periodPerMilleInMs > ONE_MINUTE_IN_MS)
      periodInfo = `${(periodPerMilleInMs / ONE_MINUTE_IN_MS).toFixed(periodNbDecimals)} minutes`;
    else if (periodPerMilleInMs > ONE_SECOND_IN_MS)
      periodInfo = `${(periodPerMilleInMs / ONE_SECOND_IN_MS).toFixed(periodNbDecimals)} seconds`;
    else
      periodInfo = `${periodPerMilleInMs.toFixed(periodNbDecimals)} ms`;

    return `${prefix} ${periodInfo}`;
  }

  addProgressElement(container) {
    // Create first span element
    const titleSpan = document.createElement("span");
    titleSpan.className = "flex-content-min padding-min margin-hor-s";

    const textDiv = document.createElement("div");
    textDiv.textContent = this.title;
    const additionalTextDiv = document.createElement("div");
    additionalTextDiv.className = "center-text small-font";
    additionalTextDiv.textContent = this.displayPeriodRatio ? this.getPeriodPerMilleText(this.prefixPeriodRatio, this.periodRatio) : " ";

    titleSpan.appendChild(textDiv);
    titleSpan.appendChild(additionalTextDiv);

    // Create second span element
    const pgSpan = document.createElement("span");
    pgSpan.className = "flex-content-max flex-column padding-min margin-hor-s";

    // Create progress element
    this.progressBarElement = document.createElement("progress");
    this.progressBarElement.className = "pg-bar w-100";
    this.progressBarElement.max = this.maxValue;    

    // Create span inside the second span
    this.progressBarTextElement = document.createElement("span");
    this.progressBarTextElement.className = "center-text";

    // Append elements to the DOM
    pgSpan.appendChild(this.progressBarElement);
    pgSpan.appendChild(this.progressBarTextElement);
    container.appendChild(titleSpan);
    container.appendChild(pgSpan);

    this.updateProgress();
  }

  truncateFixedNumber(num, nbDecimals) {
    const strNum = num.toString();
    const pointIndex = strNum.indexOf(".");    
    return nbDecimals ? strNum.substring(0, pointIndex + nbDecimals + 1) : strNum.substring(0, pointIndex + nbDecimals);
  }

  updateProgress() {
    const currentProgressValue = this.progress.getProgress();
    this.progressBarElement.value = currentProgressValue;
    //this.progressBarTextElement.textContent = `${currentProgressValue.toFixed(this.nbDecimals)}${this.valueSign}`;
    this.progressBarTextElement.textContent = `${this.truncateFixedNumber(currentProgressValue, this.nbDecimals)}${this.valueSign}`;
  }

  showProgressBar(show) {
    const hideClass = "display-none";

    if (show)
      this.progressBarElement.classList.remove(hideClass);
    else
      this.progressBarElement.classList.add(hideClass);
  }
}

class ProgressBarContainer {
  constructor({
      pgContainerId,
      showPgBar = true,
      maxValue = 100,
      valueSign = "%",
      nbDecimals = 2,
      pgBarBounded = false,
      displayPeriodRatio = true,
      prefixPeriodRatio = "1‰:",
      periodRatio = 1/1000,
      updateIntervalInMs = 100
    }) {
    const pgContainerElement = document.getElementById(pgContainerId);
    this.hideShowButton = this.createHideShowButton();
    this.pgNavContainer = this.createNavElement(pgContainerElement, this.hideShowButton);
    this.showPgBar = showPgBar;
    this.maxValue = maxValue;
    this.valueSign = valueSign;
    this.nbDecimals = nbDecimals;
    this.pgBarBounded = pgBarBounded;
    this.displayPeriodRatio = displayPeriodRatio;
    this.prefixPeriodRatio = prefixPeriodRatio;
    this.periodRatio = periodRatio;
    this.updateIntervalInMs = updateIntervalInMs;

    this.progressBarLst = [];
  }

  getHideShowCaption() {
    const action = this.showPgBar ? "Cacher" : "Afficher";
    return `${action}`;
  }

  handleHideShowButton() {
    this.showPgBar = !this.showPgBar;
    this.hideShowProgressBars();
    this.hideShowButton.textContent = this.getHideShowCaption();
  }

  createHideShowButton() {
    const hideShowButton = document.createElement("button");
    hideShowButton.textContent = this.getHideShowCaption();
    hideShowButton.addEventListener("click", () => this.handleHideShowButton());
    return hideShowButton;
  }

  createNavElement(container, hideShowButton) {
    //Create general nav
    const pgNav = document.createElement("nav");
    pgNav.className = "flex-grid-progressbar border-min";

    container.appendChild(hideShowButton);
    container.appendChild(pgNav);
    return pgNav;
  }

  addProgressBar({title, startDT, endDT, nbDecimals = null, maxValue = null, valueSign = null}) {
    if (nbDecimals === null)
      nbDecimals = this.nbDecimals;
    if (maxValue === null)
      maxValue = this.maxValue;
    if (valueSign === null)
      valueSign = this.valueSign;

    const pgBar = new ProgressBar({title, 
      startDT, 
      endDT,
      maxValue: maxValue,
      valueSign: valueSign,
      nbDecimals,
      bounded: this.pgBarBounded,
      displayPeriodRatio: this.displayPeriodRatio,
      prefixPeriodRatio: this.prefixPeriodRatio,
      periodRatio: this.periodRatio});
    this.progressBarLst.push(pgBar);
    pgBar.addProgressElement(this.pgNavContainer);
  }

  updateProgressBars(pgBarLst) {
    for (let pgItem of pgBarLst) {
      pgItem.updateProgress();
    }
  }

  hideShowProgressBars() {
    for (let pgItem of this.progressBarLst) {
      pgItem.showProgressBar(this.showPgBar);
    }
  }

  startUpdateInterval() {
    setInterval(this.updateProgressBars, this.updateIntervalInMs, this.progressBarLst);
  }

  start() {
    this.hideShowProgressBars();
    this.startUpdateInterval();
  }
}

function addTime(date, {nbDays = 0, nbHours = 0, nbMinutes = 0, nbSeconds = 0}) {
  return new Date(date.valueOf() + nbDays * 86_400_000 + nbHours * 3_600_000 + nbMinutes * 60_000 + nbSeconds * 1_000);
}