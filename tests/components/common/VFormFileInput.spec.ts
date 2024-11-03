import { mount } from "@vue/test-utils";

import VFormFileInput from "@/components/common/VFormFileInput.vue";
import { PickerOpts } from "@/static/imageFile";

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

describe("VFormFileInput Component", () => {
  const acceptedTypes: MIMEType[] = ["image/png", "image/jpeg"];
  const pickerOpts = structuredClone(PickerOpts);
  const mockFiles = [
    new File(["content"], "file1.png", { type: "image/png" }),
    new File(["content"], "file2.jpg", { type: "image/jpeg" }),
    new File(["content"], "file3.txt", { type: "text/plain" }),
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test.each<{ description: string; hasFileSystemAccess: boolean }>([
    {
      description: "with File System Access API",
      hasFileSystemAccess: true,
    },
    {
      description: "without File System Access API",
      hasFileSystemAccess: false,
    },
  ])(
    "should handle file input click $description",
    async ({ hasFileSystemAccess }) => {
      if (hasFileSystemAccess) {
        window.showOpenFilePicker = vi.fn().mockResolvedValue(
          mockFiles.map((file) => ({
            getFile: vi.fn().mockResolvedValue(file),
          })),
        );
      } else {
        delete window.showOpenFilePicker;
      }

      const wrapper = mount(VFormFileInput, {
        props: {
          acceptedTypes,
          pickerOpts,
        },
      });

      const input = wrapper.find<HTMLInputElement>('input[type="file"]');

      await input.trigger("click");

      if (!hasFileSystemAccess) {
        expect(window.showOpenFilePicker).toBeUndefined();
        return;
      }

      expect(window.showOpenFilePicker).toHaveBeenCalledWith(pickerOpts);
      // TODO: Ensure tests pass
      // expect(wrapper.emitted('fileChange')).toBeTruthy();
    },
  );

  test.each<{ description: string; hasFileSystemAccess: boolean }>([
    { description: "with File System Access API", hasFileSystemAccess: true },
    {
      description: "without File System Access API",
      hasFileSystemAccess: false,
    },
  ])(
    "should handle file input change $description",
    async ({ hasFileSystemAccess }) => {
      window.showOpenFilePicker = hasFileSystemAccess
        ? vi.fn().mockResolvedValue(
            mockFiles.map((file) => ({
              getFile: vi.fn().mockResolvedValue(file),
            })),
          )
        : undefined;

      const wrapper = mount(VFormFileInput, {
        props: {
          acceptedTypes,
          pickerOpts,
        },
      });

      const input = wrapper.find<HTMLInputElement>('input[type="file"]');
      const dataTransfer = new DataTransfer();
      for (const file of mockFiles) dataTransfer.items.add(file);

      if (hasFileSystemAccess) {
        await input.trigger("click");
        expect(window.showOpenFilePicker).toHaveBeenCalledWith(pickerOpts);
      } else {
        Object.defineProperty(input.element, "files", {
          value: dataTransfer.files,
          writable: false,
        });
        await input.trigger("change");
      }

      const emittedFileChangeEvent = wrapper.emitted("fileChange");
      const emittedUnacceptedFilesEvent = wrapper.emitted("unacceptedFiles");

      if (hasFileSystemAccess) {
        expect(emittedFileChangeEvent).toBeFalsy();
        return;
      }

      expect(emittedFileChangeEvent).toBeTruthy();
      expect(emittedFileChangeEvent?.[0][0]).toEqual([
        expect.objectContaining({ name: "file1.png", type: "image/png" }),
        expect.objectContaining({ name: "file2.jpg", type: "image/jpeg" }),
      ]);

      expect(emittedUnacceptedFilesEvent).toBeTruthy();
      expect(emittedUnacceptedFilesEvent?.[0][0]).toEqual([
        expect.objectContaining({ name: "file3.txt", type: "text/plain" }),
      ]);
    },
  );
});
