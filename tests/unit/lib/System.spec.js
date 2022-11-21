import { isElectron, isUnite, isWeb, version } from "../../../src/lib/System";

const OLD_ENV = process.env;

describe('version', () => {
  test('can get version string', () => {
    expect(version()).not.toBe('');
  });
});

describe('isWeb', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {...OLD_ENV};
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('return true when IS_ELECTRON env has zero', () => {
    process.env.IS_ELECTRON = '0';
    expect(isWeb()).toBeTruthy();
  });

  test('return true when IS_ELECTRON env doesnt exists', () => {
    delete process.env.IS_ELECTRON;
    expect(isWeb()).toBeTruthy();
  });

  test('return false when IS_ELECTRON env has not zero', () => {
    process.env.IS_ELECTRON = '1';
    expect(isWeb()).toBeFalsy();
  });
});

describe('isElectron', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {...OLD_ENV};
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('return false when IS_ELECTRON env has zero', () => {
    process.env.IS_ELECTRON = '0';
    expect(isElectron()).toBeFalsy();
  });

  test('return false when IS_ELECTRON env doesnt exists', () => {
    delete process.env.IS_ELECTRON;
    expect(isElectron()).toBeFalsy();
  });

  test('return true when IS_ELECTRON env has not zero', () => {
    process.env.IS_ELECTRON = '1';
    expect(isElectron()).toBeTruthy();

    process.env.IS_ELECTRON = 'true';
    expect(isElectron()).toBeTruthy();

    process.env.IS_ELECTRON = 'OK';
    expect(isElectron()).toBeTruthy();
  });
});


describe('isUnite', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {...OLD_ENV};
  });

  afterAll(() => {
    process.env = OLD_ENV;
  });

  test('return false when VUE_APP_IS_UNITE env has zero', () => {
    process.env.VUE_APP_IS_UNITE = '0';
    expect(isUnite()).toBeFalsy();
  });

  test('return false when VUE_APP_IS_UNITE env doesnt exists', () => {
    delete process.env.VUE_APP_IS_UNITE;
    expect(isUnite()).toBeFalsy();
  });

  test('return false when not VUE_APP_IS_UNITE env has not zero', () => {
    process.env.IS_UNITE = '1';
    expect(isUnite()).toBeFalsy();
  });

  test('return true when VUE_APP_IS_UNITE env has not zero', () => {
    process.env.VUE_APP_IS_UNITE = '1';
    expect(isUnite()).toBeTruthy();

    process.env.VUE_APP_IS_UNITE = 'true';
    expect(isUnite()).toBeTruthy();

    process.env.VUE_APP_IS_UNITE = 'OK';
    expect(isUnite()).toBeTruthy();
  });
});
