import { Mock } from "vitest";

import { fetchTags } from "@/core/infrastructure/github";
import { getAppVersion } from "@/core/system";
import { getLatestVersion, isLatestVersion } from "@/services/versionService";

vi.mock("@/core/infrastructure/github");
vi.mock("@/core/system");

describe("isLatestVersion", () => {
  beforeEach(() => {
    (fetchTags as Mock).mockClear();
    (getAppVersion as Mock).mockClear();
  });

  test.each([
    {
      description: "should return true if the local version is the latest",
      mockTags: [{ name: "1.0.0" }, { name: "2.0.0" }],
      localVersion: "2.0.0",
      expectedIsLatest: true,
    },
    {
      description: "should return false if the local version is not the latest",
      mockTags: [{ name: "1.0.0" }, { name: "2.0.0" }],
      localVersion: "1.5.0",
      expectedIsLatest: false,
    },
    {
      description:
        "should return true if the local version and the latest version are the same",
      mockTags: [{ name: "1.0.0" }, { name: "2.0.0" }],
      localVersion: "2.0.0",
      expectedIsLatest: true,
    },
    {
      description: "should return true if there are no versions available",
      mockTags: [],
      localVersion: "1.0.0",
      expectedIsLatest: true,
    },
  ])("$description", async ({ mockTags, localVersion, expectedIsLatest }) => {
    (fetchTags as Mock).mockResolvedValue(mockTags);
    (getAppVersion as Mock).mockReturnValue(localVersion);

    const isLatest = await isLatestVersion();

    expect(isLatest).toBe(expectedIsLatest);
  });
});

describe("getLatestVersion", () => {
  beforeEach(() => {
    (fetchTags as Mock).mockClear();
  });

  test.each<{
    description: string;
    mockTags: { name: string }[];
    expectedVersion: string;
  }>([
    {
      description: "should return the latest version from GitHub",
      mockTags: [{ name: "1.0.0" }, { name: "2.0.0" }, { name: "1.5.0" }],
      expectedVersion: "2.0.0",
    },
    {
      description: "should return an empty string if no versions are available",
      mockTags: [],
      expectedVersion: "",
    },
    {
      description: "should return the only version available",
      mockTags: [{ name: "1.0.0" }],
      expectedVersion: "1.0.0",
    },
  ])("$description", async ({ mockTags, expectedVersion }) => {
    (fetchTags as Mock).mockResolvedValue(mockTags);

    const latestVersion = await getLatestVersion();

    expect(fetchTags).toHaveBeenCalledWith(
      import.meta.env.GIT_ORG,
      import.meta.env.GIT_REPO,
    );
    expect(latestVersion).toBe(expectedVersion);
  });
});
