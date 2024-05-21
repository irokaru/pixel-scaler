import { fetchTags } from "../core/infrastructure/github";
import { getAppVersion } from "../core/system";

export const isLatestVersion = async (): Promise<boolean> => {
  const latestVersion = await getLatestVersion();
  return compareVersions(getAppVersion(), latestVersion) >= 0;
};

export const getLatestVersion = async (): Promise<string> => {
  const versions = await fetchTags(
    import.meta.env.GIT_ORG,
    import.meta.env.GIT_REPO,
  );

  if (versions.length === 0) return "";

  const latestVersionInGithub = versions.sort((a, b) =>
    compareVersions(b.name, a.name),
  )[0];
  return latestVersionInGithub.name;
};

const compareVersions = (a: string, b: string): number => {
  const aParts = a.split(".");
  const bParts = b.split(".");
  for (const [i, aPart_] of aParts.entries()) {
    const aPart = Number.parseInt(aPart_);
    const bPart = Number.parseInt(bParts[i]);
    if (aPart < bPart) {
      return -1;
    }
    if (aPart > bPart) {
      return 1;
    }
  }
  return 0;
};
