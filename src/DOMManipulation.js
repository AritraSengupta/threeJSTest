export class DOMManipulation {
  constructor() {
    throw new Error("to be used as a static class");
  }

  static removeLoader() {
    const loaderAnim = document.getElementById("js-loader");
    loaderAnim && loaderAnim.remove();
  }

  static removeExperiences() {
    const content = document.getElementById("content");
    content.style.display = "none";
  }

  static showExperiences(experiences) {
    const content = document.getElementById("content");
    content.innerHTML = experiences;
    content.style.display = "block";
  }
}

export const texts = {
  button1: "This is button1 text",
  button2: "This is button2 text",
  button3: "This is button3 text"
};
