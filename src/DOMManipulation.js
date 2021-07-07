import data from "./data";
import { animateScore, calculatePoints, createCoin } from "./utils";
export class DOMManipulation {
  constructor() {
    this.controlShown = false;
    this.resumeShown = false;
    this.collections = {};
    this.currentAnimations = {};
    this.totalScore = calculatePoints(data.resume);
    this.currentScore = calculatePoints(this.collections);
    this.hideControls();
    this.hideResume();
    this.updateScore();
    document.addEventListener("click", e => {
      if (e.target.id === "show-resume") {
        this.resumeShown ? this.hideResume() : this.showResume();
      } else if (e.target.id === "show-controls") {
        this.controlShown ? this.hideControls() : this.showControls();
      }
    });
  }

  showResume() {
    this.resetScreen();
    const elem = document.getElementById("resume");
    elem.style.display = "block";
    elem.innerText = JSON.stringify(this.collections);
    this.resumeShown = true;
  }

  hideResume() {
    const elem = document.getElementById("resume");
    elem.style.display = "none";
    this.resumeShown = false;
  }

  showControls() {
    this.resetScreen();
    const elem = document.getElementById("controls");
    elem.style.display = "block";
    elem.innerText = JSON.stringify(data.controls);
    this.controlShown = true;
  }

  hideControls() {
    const elem = document.getElementById("controls");
    elem.style.display = "none";
    this.controlShown = false;
  }

  updateScore(callback) {
    const name = "updateScore";
    if (this.currentAnimations[name]) return; //animation running
    this.currentAnimations[name] = true;
    const updatedScore = calculatePoints(this.collections);
    const elem = document.getElementById("score");
    animateScore(
      elem,
      this.currentScore,
      updatedScore,
      1000,
      this.totalScore,
      () => {
        this.currentAnimations[name] = false;
        callback && callback();
      }
    );
    this.currentScore = updatedScore;
  }

  removeLoader() {
    const loaderAnim = document.getElementById("js-loader");
    loaderAnim && loaderAnim.remove();
  }

  resetScreen() {
    this.hideResume();
    this.hideControls();
  }

  animateAchievement(message, callback) {
    const name = "animateAchievement";
    if (this.currentAnimations[name]) return; //animation running
    this.currentAnimations[name] = true;
    const elem = document.getElementById("achievement");
    elem.style.display = "block";
    elem.innerText = message;
    setTimeout(() => {
      this.currentAnimations[name] = false;
      elem.style.display = "none";
      elem.innerText = "";
      callback && callback();
    }, 1500);
  }

  animateCoin(value, callback) {
    const name = "animateCoin";
    if (this.currentAnimations[name]) return; //animation running
    this.currentAnimations[name] = true;
    const coin = createCoin(value);
    document.body.appendChild(coin);
    // Let the animation run
    setTimeout(() => {
      // remove from DOM and call callback
      this.currentAnimations[name] = false;
      coin && coin.remove();
      callback && callback();
    }, 3100);
  }
}

export const texts = {
  button1: "This is button1 text",
  button2: "This is button2 text",
  button3: "This is button3 text"
};
