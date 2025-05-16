import { shallowMount } from "@vue/test-utils";

import Header from "@/components/convert/InputFileList/Header.vue";
import { ScaleMode } from "@/constants/form";

describe("InputFileList/Header", () => {
  const defaultProps = {
    isAnyChecked: false,
    modelValue: false,
    originalPixelSize: 1,
    scaleMode: ScaleMode.Smooth,
    scaleSizePercent: 200,
  };

  const factory = (props = {}) => {
    return shallowMount(Header, {
      props: {
        ...defaultProps,
        ...props,
      },
      global: {
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });
  };

  describe("Render", () => {
    test("should render root element", () => {
      const wrapper = factory();
      expect(
        wrapper
          .find('[data-testid="input-file-list-item-header__header"]')
          .exists(),
      ).toBe(true);
    });
  });

  describe("Select All Checkbox", () => {
    test("should reflect v-model value correctly", async () => {
      const wrapper = factory({ modelValue: false });
      const checkBox = wrapper.findComponent({ name: "VFormCheckBox" });
      expect(checkBox.exists()).toBe(true);
      expect(checkBox.props("modelValue")).toBe(false);

      await wrapper.setProps({ modelValue: true });
      expect(checkBox.props("modelValue")).toBe(true);
    });

    test("should emits toggleAllChecked when checkbox is clicked", async () => {
      const wrapper = factory();

      const checkBox = wrapper.findComponent({ name: "VFormCheckBox" });
      await checkBox.trigger("click");
      const emitted = wrapper.emitted("toggleAllChecked");
      expect(emitted).toBeTruthy();
      expect(emitted!.length).toBe(1);
      expect(emitted![0]).toEqual([]);
    });
  });

  describe("Scale Size Input", () => {
    test("should bind scaleSizePercent value correctly", () => {
      const wrapper = factory({ scaleSizePercent: 500 });

      const input = wrapper
        .findAllComponents({ name: "VFormInput" })
        .find((input) => input.attributes("name") === "scaleSizePercent");
      expect(input).toBeTruthy();
      expect(input!.props("modelValue")).toBe(500);
      expect(input!.attributes("min")).toBeDefined();
      expect(input!.attributes("max")).toBeDefined();
    });
  });

  describe("Original Pixel Size Input", () => {
    test("should bind originalPixelSize value correctly", () => {
      const wrapper = factory({ originalPixelSize: 5 });

      const input = wrapper
        .findAllComponents({ name: "VFormInput" })
        .find((input) => input.attributes("name") === "originalPixelSize");
      expect(input).toBeTruthy();
      expect(input!.props("modelValue")).toBe(5);
      expect(input!.attributes("min")).toBeDefined();
      expect(input!.attributes("max")).toBeDefined();
    });
  });

  describe("Scale Mode SelectBox", () => {
    test("should bind scaleMode value correctly", () => {
      const wrapper = factory({ scaleMode: ScaleMode.Nearest });

      const selectBox = wrapper.findComponent({ name: "VFormSelectBox" });
      expect(selectBox.exists()).toBe(true);
      expect(selectBox.props("modelValue")).toBe(ScaleMode.Nearest);
      expect(selectBox.props("options")).toBeDefined();
    });
  });

  describe("Apply Button", () => {
    test("should emitted apply when apply button is clicked", async () => {
      const wrapper = factory();

      const button = wrapper.findComponent({ name: "VFormButton" });
      expect(button.exists()).toBe(true);

      await button.trigger("click");

      const emitted = wrapper.emitted("apply");
      expect(emitted).toBeTruthy();
      expect(emitted!.length).toBe(1);
      expect(emitted![0]).toEqual([]);
    });
  });
});
