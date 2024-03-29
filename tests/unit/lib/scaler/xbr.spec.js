import { calcScalePers } from "../../../../src/lib/scaler/xbr";

describe('calcScalePers', () => {
  test('return org number when scalePer is lower or equal than max value', () => {
    const suites = [
      // expect, scalePer, max
      [[100], 100, 400],
      [[400], 400, 400],
    ];

    for (const [expectValue, scalePer, max] of suites) {
      expect(calcScalePers(scalePer, max)).toEqual(expectValue);
    }
  });

  test('return array when scalePer is higher than max', () => {
    const suites = [
      // expect, scalePer, max
      [[400, 125], 500, 400],
      [[200, 200, 150], 600, 200],
      [[150, 150, 150, 150, 150, 104.66666666666666], 800, 150],
    ];

    for (const [expectValue, scalePer, max] of suites) {
      expect(calcScalePers(scalePer, max)).toEqual(expectValue);
    }
  });

  test('throw error then invalid scaleper value', () => {
    const suites = [
      // scalePer, max
      [0.1, 10],
      [0, 1],
      [-1, 1],
    ];

    for (const [scalePer, max] of suites) {
      expect(() => calcScalePers(scalePer, max)).toThrowError('invalid scalePer value');
    }
  });

  test('throw error then invalid max value', () => {
    const suites = [
      // scalePer, max
      [1, 0.1],
      [1, 0],
      [1, -1],
    ];

    for (const [scalePer, max] of suites) {
      expect(() => calcScalePers(scalePer, max)).toThrowError('invalid max value');
    }
  });
});
