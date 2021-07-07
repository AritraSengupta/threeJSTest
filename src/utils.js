export function calculatePoints(resume) {
  return Object.keys(resume).reduce(
    (prev, curr) => prev + resume[curr].points,
    0
  );
}

export function createCoin(value) {
  const innerHTML = `
    <div class="coin_container">
      <div class="coin">
        <div class="face heads">
          ${value}
        </div>
        <div class="face tails">
          ${value}
        </div>
      </div>
    </div>
  `;

  const elem = document.createElement("span");
  elem.innerHTML = innerHTML;
  return elem;
}

export function animateScore(obj, start, end, duration, totalScore, callback) {
  let startTimestamp = null;
  const step = timestamp => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const updatedScore = Math.floor(progress * (end - start) + start);
    obj.innerHTML = `Score: ${updatedScore} / ${totalScore}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
    if (updatedScore === end) {
      callback && callback();
    }
  };
  window.requestAnimationFrame(step);
}
