// tests/components/ScaledImageListItem.spec.ts
import { mount } from "@vue/test-utils";

import { ImageEntry } from "@/@types/convert";
import ItemListView from "@/components/convert/ScaledImageList/ItemListView.vue";
import { ScaleMode } from "@/constants/form";

describe("ScaledImageList/ItemListView", () => {
  // helper to build a mock ImageEntry
  const makeEntry = (overrides?: Partial<ImageEntry>): ImageEntry => {
    const baseImage = {
      uuid: "u1",
      data: new File([""], "foo.png"),
      imageData: new ImageData(1, 1),
      width: 10,
      height: 10,
      originalPixelSize: 2,
      url: "http://example.com/foo.png",
      status: "scaled" as const,
    };
    const baseSettings = {
      scaleSizePercent: 150,
      scaleMode: ScaleMode.Smooth,
    };
    return {
      image: { ...baseImage, ...overrides?.image },
      settings: { ...baseSettings, ...overrides?.settings },
      errors: [],
      ...overrides,
    };
  };

  const factory = (props = {}) => {
    return mount(ItemListView, {
      props: {
        scaledImage: makeEntry(),
        checked: false,
        hasOutputPathError: false,
        ...props,
      },
      global: {
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });
  };

  describe("Rendering", () => {
    test("computes checkbox id and name via getId()", () => {
      const wrapper = factory();

      const id = `checked-scaled-150-2-${ScaleMode.Smooth}-foo.png`;
      const checkbox = wrapper.find(`input[type="checkbox"]`);
      expect(checkbox.attributes("id")).toBe(id);
      expect(checkbox.attributes("name")).toBe(id);
    });

    test("displays scale percent, original pixel, and scale mode", () => {
      const wrapper = factory();

      const texts = wrapper.text();
      expect(texts).toContain("150%");
      expect(texts).toContain("2px");
      expect(texts).toContain(ScaleMode.Smooth);
    });
  });

  describe("Emits", () => {
    test("emits 'download' when download button clicked", async () => {
      const wrapper = factory();

      await wrapper
        .findAllComponents({ name: "VFormButton" })
        .at(0)!
        .trigger("click");
      expect(wrapper.emitted("download")).toBeTruthy();
      expect(wrapper.emitted("download")!.length).toBe(1);
    });

    test("emits 'delete' when delete button clicked", async () => {
      const wrapper = factory();

      await wrapper
        .findAllComponents({ name: "VFormButton" })
        .at(1)!
        .trigger("click");
      expect(wrapper.emitted("delete")).toBeTruthy();
      expect(wrapper.emitted("delete")!.length).toBe(1);
    });
  });
});
