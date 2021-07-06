import data from "./data";
import { calculatePoints } from "./utils";
export class DOMManipulation {
  constructor() {
    this.controlShown = false;
    this.resumeShown = false;
    this.collections = {};
    this.totalScore = calculatePoints(data.resume);
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

  updateScore() {
    const currentScore = calculatePoints(this.collections);
    const elem = document.getElementById("score");
    elem.innerText = `Score: ${currentScore}/ ${this.totalScore}`;
  }

  removeLoader() {
    const loaderAnim = document.getElementById("js-loader");
    loaderAnim && loaderAnim.remove();
  }

  resetScreen() {
    this.hideResume();
    this.hideControls();
  }

  animateAchievement(message) {
    const elem = document.getElementById("achievement");
    elem.style.display = "block";
    elem.innerText = message;
    setTimeout(() => {
      elem.style.display = "none";
      elem.innerText = "";
    }, 500);
  }
}

export const texts = {
  button1: "This is button1 text",
  button2: "This is button2 text",
  button3: "This is button3 text"
};
