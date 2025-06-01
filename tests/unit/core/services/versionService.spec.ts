import { Tag } from "@/core/@types/github";
import { fetchTags } from "@/core/infrastructure/github";
import {
  getLatestVersion,
  isLatestVersion,
} from "@/core/services/versionService";
import { getAppCurrentVersion } from "@/core/system";

vi.mock("@/core/infrastructure/github");
vi.mock("@/core/system");

describe("isLatestVersion", () => {
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
    vi.mocked(fetchTags).mockResolvedValue(mockTags as Tag[]);
    vi.mocked(getAppCurrentVersion).mockReturnValue(localVersion);

    const isLatest = await isLatestVersion();

    expect(isLatest).toBe(expectedIsLatest);
  });
});

describe("getLatestVersion", () => {
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
    vi.mocked(fetchTags).mockResolvedValue(mockTags as Tag[]);

    const latestVersion = await getLatestVersion();

    expect(fetchTags).toHaveBeenCalledWith(
      import.meta.env.GIT_ORG,
      import.meta.env.GIT_REPO,
    );
    expect(latestVersion).toBe(expectedVersion);
  });
});
