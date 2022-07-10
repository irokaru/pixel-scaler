/**
 * return number between 100 to 400 array by split scalePer
 * @param {number} scalePer (100-)
 * @return {number[]} (100-400)[]
 */
export const calcScalePers = (scalePer, max = 400) => {
  if (!Number.isInteger(scalePer) || scalePer <= 0) throw new Error('invalid scalePer value');
  if (!Number.isInteger(max) || max <= 0) throw new Error('invalid max value');

  const div = scalePer / max;

    if (div <= 0) return [scalePer];

  const result = Array(parseInt(div)).fill(max);

  return Number.isInteger(div) ? result : [...result, scalePer % max];
};
