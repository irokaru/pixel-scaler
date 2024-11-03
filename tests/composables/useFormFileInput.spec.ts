import useFormFileInput from "@/composables/useFormFileInput";
import { AcceptedTypes, PickerOpts } from "@/static/imageFile";

const setPickedFiles = (files: File[]) => {
  window.showOpenFilePicker = vi.fn().mockResolvedValue(
    files.map((file) => ({
      getFile: vi.fn().mockResolvedValue(file),
    })),
  );
};

const ACCEPTED_FILES = [
  new File(["content"], "file1.png", { type: "image/png" }),
  new File(["content"], "file2.jpg", { type: "image/jpeg" }),
];
const UNACCEPTED_FILES = [
  new File(["content"], "file3.txt", { type: "text/plain" }),
];

describe("getFilesFromFilePicker", () => {
  test.each<{
    description: string;
    pickedFiles: File[];
    expectedFiles: File[];
    expectedUnacceptedFiles: File[];
  }>([
    {
      description: "should return the picked files",
      pickedFiles: ACCEPTED_FILES,
      expectedFiles: ACCEPTED_FILES,
      expectedUnacceptedFiles: [],
    },
    {
      description: "should return the picked files and unaccepted files",
      pickedFiles: [...ACCEPTED_FILES, ...UNACCEPTED_FILES],
      expectedFiles: ACCEPTED_FILES,
      expectedUnacceptedFiles: UNACCEPTED_FILES,
    },
    {
      description: "should return an empty object when no files are picked",
      pickedFiles: [],
      expectedFiles: [],
      expectedUnacceptedFiles: [],
    },
  ])(
    "$description",
    async ({ pickedFiles, expectedFiles, expectedUnacceptedFiles }) => {
      setPickedFiles(pickedFiles);

      const { getFilesFromFilePicker } = useFormFileInput({
        acceptedTypes: AcceptedTypes,
        pickerOpts: PickerOpts,
      });
      await expect(getFilesFromFilePicker()).resolves.toEqual({
        files: expectedFiles,
        unacceptedFiles: expectedUnacceptedFiles,
      });
    },
  );

  test("should return an empty object when no accepted types", async () => {
    setPickedFiles(ACCEPTED_FILES);

    const { getFilesFromFilePicker } = useFormFileInput({
      acceptedTypes: [],
      pickerOpts: PickerOpts,
    });
    await expect(getFilesFromFilePicker()).resolves.toEqual({
      files: [],
      unacceptedFiles: ACCEPTED_FILES,
    });
  });
});

describe("getFilesFromEvent", () => {
  test.each<{
    description: string;
    files: File[] | undefined;
    expectedFiles: File[];
    expectedUnacceptedFiles: File[];
  }>([
    {
      description: "should return the files from the event",
      files: ACCEPTED_FILES,
      expectedFiles: ACCEPTED_FILES,
      expectedUnacceptedFiles: [],
    },
    {
      description: "should return the files and unaccepted files",
      files: [...ACCEPTED_FILES, ...UNACCEPTED_FILES],
      expectedFiles: ACCEPTED_FILES,
      expectedUnacceptedFiles: UNACCEPTED_FILES,
    },
    {
      description: "should return an empty object when no files are selected",
      files: [],
      expectedFiles: [],
      expectedUnacceptedFiles: [],
    },
    {
      description:
        "should return an empty object when files are canceled select",
      files: undefined,
      expectedFiles: [],
      expectedUnacceptedFiles: [],
    },
  ])("$description", ({ files, expectedFiles, expectedUnacceptedFiles }) => {
    const event = new Event("change");
    Object.defineProperty(event, "target", {
      writable: true,
      value: { files },
    });

    const { getFilesFromEvent } = useFormFileInput({
      acceptedTypes: AcceptedTypes,
      pickerOpts: PickerOpts,
    });
    expect(getFilesFromEvent(event)).toEqual({
      files: expectedFiles,
      unacceptedFiles: expectedUnacceptedFiles,
    });
  });
});

describe("getFilesFromDragEvent", () => {
  test.each<{
    description: string;
    items: File[] | undefined;
    expectedFiles: File[];
    expectedUnacceptedFiles: File[];
  }>([
    {
      description: "should return the files from the event",
      items: ACCEPTED_FILES,
      expectedFiles: ACCEPTED_FILES,
      expectedUnacceptedFiles: [],
    },
    {
      description: "should return the files and unaccepted files",
      items: [...ACCEPTED_FILES, ...UNACCEPTED_FILES],
      expectedFiles: ACCEPTED_FILES,
      expectedUnacceptedFiles: UNACCEPTED_FILES,
    },
    {
      description: "should return an empty object when no files are selected",
      items: [],
      expectedFiles: [],
      expectedUnacceptedFiles: [],
    },
    {
      description:
        "should return an empty object when files are canceled select",
      items: undefined,
      expectedFiles: [],
      expectedUnacceptedFiles: [],
    },
  ])("$description", ({ items, expectedFiles, expectedUnacceptedFiles }) => {
    const event = new DragEvent("drop");
    const dataTransfer = new DataTransfer();
    if (items) {
      for (const item of items) dataTransfer.items.add(item);
    }

    Object.defineProperty(event, "dataTransfer", {
      writable: true,
      value: dataTransfer,
    });

    const { getFilesFromDragEvent } = useFormFileInput({
      acceptedTypes: AcceptedTypes,
      pickerOpts: PickerOpts,
    });
    expect(getFilesFromDragEvent(event)).toEqual({
      files: expectedFiles,
      unacceptedFiles: expectedUnacceptedFiles,
    });
  });

  test("should return the files and not return the string items", () => {
    const event = new DragEvent("drop");
    const dataTransfer = new DataTransfer();
    for (const item of ACCEPTED_FILES) dataTransfer.items.add(item);
    dataTransfer.items.add("string item", "string");

    Object.defineProperty(event, "dataTransfer", {
      writable: true,
      value: dataTransfer,
    });

    const { getFilesFromDragEvent } = useFormFileInput({
      acceptedTypes: AcceptedTypes,
      pickerOpts: PickerOpts,
    });
    expect(getFilesFromDragEvent(event)).toEqual({
      files: ACCEPTED_FILES,
      unacceptedFiles: [],
    });
  });
});
