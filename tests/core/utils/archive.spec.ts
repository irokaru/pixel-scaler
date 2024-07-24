// archive.test.ts
import JSZip from "jszip";

import { filesToZip } from "@/core/utils/archive";

vi.mock("jszip");

describe("filesToZip", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  const mockFiles = [
    new File(["content1"], "file1.txt"),
    new File(["content2"], "file2.txt"),
  ];

  test("should call jszip.file and jszip.generateAsync with correct parameters", async () => {
    const testBlob = new Blob(["mocked blob"]);

    const mockFileMethod = vi.fn().mockReturnThis();
    const mockGenerateAsyncMethod = vi.fn().mockResolvedValue(testBlob);

    vi.spyOn(JSZip.prototype, "file").mockImplementation(mockFileMethod);
    vi.spyOn(JSZip.prototype, "generateAsync").mockImplementation(
      mockGenerateAsyncMethod,
    );

    const result = await filesToZip(mockFiles);
    expect(mockFileMethod).toHaveBeenCalledTimes(mockFiles.length);
    for (const file of mockFiles) {
      expect(mockFileMethod).toHaveBeenCalledWith(file.name, file);
    }

    expect(mockGenerateAsyncMethod).toHaveBeenCalledTimes(1);
    expect(mockGenerateAsyncMethod).toHaveBeenCalledWith({ type: "blob" });

    expect(result).toEqual(testBlob);
  });

  test("should throw an error when jszip.generateAsync fails", async () => {
    vi.spyOn(JSZip.prototype, "file").mockReturnThis();
    vi.spyOn(JSZip.prototype, "generateAsync").mockRejectedValue(
      new Error("Async generation failed"),
    );

    await expect(filesToZip(mockFiles)).rejects.toThrow(
      "Async generation failed",
    );
  });
});
