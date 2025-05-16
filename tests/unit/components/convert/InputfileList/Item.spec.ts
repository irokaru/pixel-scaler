import { shallowMount } from "@vue/test-utils";
import { nextTick } from "vue";

import { ImageEntry } from "@/@types/convert";
import { CustomErrorObject } from "@/@types/error";
import Item from "@/components/convert/InputFileList/Item.vue";
import { ScaleMode } from "@/constants/form";

describe("InputFileList/Item", () => {
  const createImageEntry = (
    uuid: string,
    errors: CustomErrorObject<"scale">[] = [],
  ): ImageEntry => ({
    image: {
      uuid,
      data: new File([""], "test.png"),
      imageData: new ImageData(1, 1),
      width: 100,
      height: 100,
      originalPixelSize: 1,
      url: "http://example.com/test.png",
      status: "loaded",
    },
    settings: {
      scaleSizePercent: 100,
      scaleMode: ScaleMode.Smooth,
    },
    errors,
  });

  const mountItem = (props = {}) =>
    shallowMount(Item, {
      props: {
        modelValue: createImageEntry("1"),
        checked: false,
        ...props,
      },
      global: {
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });

  describe("basic rendering", () => {
    test("renders checkbox, inputs, and buttons correctly", () => {
      const wrapper = mountItem();

      const checked = wrapper.find("[id='checked-test.png']");
      expect(checked.exists()).toBeTruthy();
      expect(checked.attributes("modelvalue")).toBe("false");

      const scaleSizeInput = wrapper.find<HTMLInputElement>(
        "[id='scaleSizePercent-test.png']",
      );
      expect(scaleSizeInput.exists()).toBeTruthy();
      expect(scaleSizeInput.attributes("modelvalue")).toBe("100");

      const originalSizeInput = wrapper.find<HTMLInputElement>(
        "[id='originalPixelSize-test.png']",
      );
      expect(originalSizeInput.exists()).toBeTruthy();
      expect(originalSizeInput.attributes("modelvalue")).toBe("1");

      const scaleModeSelect = wrapper.find<HTMLInputElement>(
        "[id='scaleMode-test.png']",
      );
      expect(scaleModeSelect.exists()).toBeTruthy();
      expect(scaleModeSelect.attributes("modelvalue")).toBe(ScaleMode.Smooth);
    });

    test("does not render error button if no errors", () => {
      const wrapper = mountItem();
      expect(
        wrapper.find('[data-testid="errors-test.png"]').exists(),
      ).toBeFalsy();
    });
  });

  describe("error display", () => {
    test("renders error button and toggles error list", async () => {
      const errorEntry = createImageEntry("1", [
        { uuid: "a", code: "error", params: {}, kind: "scale" },
      ]);

      const wrapper = mountItem({ modelValue: errorEntry });

      const errorsBtn = wrapper.find("[data-testid='errors-test.png']");
      expect(errorsBtn.exists()).toBeTruthy();

      // Initially, error list should be hidden
      expect(
        wrapper.find("[data-testid='errors-list-test.png']").exists(),
      ).toBeFalsy();

      // Click to open error list
      await errorsBtn.trigger("click");
      await nextTick();
      expect(
        wrapper.find("[data-testid='errors-list-test.png']").exists(),
      ).toBeTruthy();
    });

    test("emits clearErrors when clear button clicked", async () => {
      const errorEntry = createImageEntry("1", [
        { uuid: "a", code: "error", params: {}, kind: "scale" },
      ]);

      const wrapper = mountItem({ modelValue: errorEntry });

      await wrapper.find("[data-testid='errors-test.png']").trigger("click");
      await nextTick();

      await wrapper
        .find("[data-testid='clear-errors-test.png']")
        .trigger("click");

      expect(wrapper.emitted("clearErrors")).toBeTruthy();
      expect(wrapper.emitted("clearErrors")?.[0]).toEqual(["1"]);
    });
  });

  describe("button emits", () => {
    test("emits convert event when convert button clicked", async () => {
      const wrapper = mountItem();

      await wrapper
        .getComponent('[data-testid="convert-test.png"]')
        .trigger("click");

      expect(wrapper.emitted("convert")).toBeTruthy();
      expect(wrapper.emitted("convert")?.[0]).toEqual(["1"]);
    });

    test("emits delete event when delete button clicked", async () => {
      const wrapper = mountItem();

      await wrapper
        .getComponent('[data-testid="delete-test.png"]')
        .trigger("click");

      expect(wrapper.emitted("delete")).toBeTruthy();
      expect(wrapper.emitted("delete")?.[0]).toEqual(["1"]);
    });
  });
});
