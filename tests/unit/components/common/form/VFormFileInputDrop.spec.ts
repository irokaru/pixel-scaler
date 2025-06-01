import { mount } from "@vue/test-utils";

import VFormFileInputDrop from "@/components/common/form/VFormFileInputDrop.vue";
import { PickerOpts } from "@/constants/imageFile";

import { Jpg1px, Png1px } from "../../../../fixture";

interface CustomWindow extends Window {
  showOpenFilePicker?: (options?: {
    multiple?: boolean;
    types?: {
      description: string;
      accept: { [key: string]: string[] };
    }[];
  }) => Promise<FileSystemFileHandle[]>;
}

declare let window: CustomWindow;

describe("VFormFileInputDrop Component", () => {
  const acceptedTypes: MIMEType[] = ["image/png", "image/jpeg"];
  const pickerOpts = structuredClone(PickerOpts);
  const mockFiles = [
    new File([new Uint8Array(Png1px)], "file1.png", { type: "image/png" }),
    new File([new Uint8Array(Jpg1px)], "file2.jpg", { type: "image/jpeg" }),
    new File(["content"], "file3.txt", { type: "text/plain" }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test.each([
    { hasFileSystemAccess: true, description: "with File System Access API" },
    {
      hasFileSystemAccess: false,
      description: "without File System Access API",
    },
  ])(
    "should handle file drop $description",
    async ({ hasFileSystemAccess: fileSystemAccess }) => {
      if (fileSystemAccess) {
        window.showOpenFilePicker = vi.fn().mockResolvedValue(
          mockFiles.map((file) => ({
            getFile: vi.fn().mockResolvedValue(file),
          })),
        );
      } else {
        delete window.showOpenFilePicker;
      }

      const wrapper = mount(VFormFileInputDrop, {
        slots: {
          default: "this is a drop area",
        },
        props: {
          acceptedTypes,
          pickerOpts,
        },
      });

      const div = wrapper.find<HTMLDivElement>("div");
      const dataTransfer = new DataTransfer();
      for (const file of mockFiles) dataTransfer.items.add(file);

      await div.trigger("drop", {
        dataTransfer,
      });

      const fileChangeEvent = wrapper.emitted("fileChange");
      expect(fileChangeEvent).toBeTruthy();
      expect(fileChangeEvent?.[0][0]).toEqual([
        expect.objectContaining({ name: mockFiles[0].name }),
        expect.objectContaining({ name: mockFiles[1].name }),
      ]);

      const unacceptedFilesEvent = wrapper.emitted("unacceptedFiles");
      expect(unacceptedFilesEvent).toBeTruthy();
      expect(unacceptedFilesEvent?.[0][0]).toEqual([
        expect.objectContaining({ name: mockFiles[2].name }),
      ]);
    },
  );
});
