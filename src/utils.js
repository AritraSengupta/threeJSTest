export function calculatePoints(resume) {
  return Object.keys(resume).reduce(
    (prev, curr) => prev + resume[curr].points,
    0
  );
}
