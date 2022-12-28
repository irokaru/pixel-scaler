import { version } from "../../../src/lib/System";
import { checkVersion } from "../../../src/lib/Version";
import { fetchTags } from "../../../src/infrastructure/GitHub";

jest.mock('../../../src/infrastructure/GitHub');
jest.mock('../../../src/lib/System');

describe('checkVersion', () => {
  test('return empty string when fetched versions is empty array.', async () => {
    fetchTags.mockImplementation(() => []);
    version.mockImplementation(() => '1.2.3');
    expect(await checkVersion()).toBe('');
  });

  test('return empty string when now version is greater than latest version.', async () => {
    fetchTags.mockImplementation(() => [{name: '1.0.0'}]);
    version.mockImplementation(() => '99999.99999.99999');
    expect(await checkVersion()).toBe('');
  });

  test('return latest version string when now version is lower than latest version.', async () => {
    fetchTags.mockImplementation(() => [{name: '1.0.0'}]);
    version.mockImplementation(() => '0.0.0');
    expect(await checkVersion()).toBe('1.0.0');
  });

  test('return latest version when now patch version is lower than latest patch version.', async () => {
    fetchTags.mockImplementation(() => [{name: '1.0.3'}]);
    version.mockImplementation(() => '1.0.2');
    expect(await checkVersion()).toBe('1.0.3');
  });

  test('return latest version when now minor version is lower than latest minor version.', async () => {
    fetchTags.mockImplementation(() => [{name: '1.18.0'}]);
    version.mockImplementation(() => '1.8.5');
    expect(await checkVersion()).toBe('1.18.0');
  });

  test('return latest version when now major version is lower than latest major version.', async () => {
    fetchTags.mockImplementation(() => [{name: '2.2.0'}]);
    version.mockImplementation(() => '1.7.0');
    expect(await checkVersion()).toBe('2.2.0');
  });
});
