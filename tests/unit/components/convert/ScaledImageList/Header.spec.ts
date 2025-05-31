import { shallowMount } from "@vue/test-utils";

import Header from "@/components/convert/ScaledImageList/Header.vue";
import { ResultDisplayStyles } from "@/constants/form";
import * as system from "@/core/system";

const isWebMock = vi.spyOn(system, "isWeb").mockReturnValue(true);

describe("ScaledImageList/Header", () => {
  const defaultProps = {
    isAnyChecked: false,
    displayStyle: ResultDisplayStyles.Grid,
    modelValue: false,
    outputPath: "",
    outputPathError: "",
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
  describe("Display controls", () => {
    test("renders VFormRadio with correct props", () => {
      const wrapper = factory();
      const radio = wrapper.findComponent({ name: "VFormRadio" });
      expect(radio.exists()).toBe(true);
      expect(radio.props("name")).toBe("displayStyle");
      expect(radio.props("enableI18n")).toBe(true);
    });
  });

  describe("Checkbox control", () => {
    test("renders VFormCheckBox and emits toggleAllChecked on click", async () => {
      const wrapper = factory();
      const checkbox = wrapper.findComponent({ name: "VFormCheckBox" });
      expect(checkbox.exists()).toBe(true);

      await checkbox.trigger("click");
      expect(wrapper.emitted("toggleAllChecked")).toBeTruthy();
    });
  });

  describe("Button controls", () => {
    test("emits downloadZip when in web environment", async () => {
      isWebMock.mockReturnValue(true);
      const wrapper = factory();
      const button = wrapper.findAllComponents({ name: "VFormButton" }).at(0);
      expect(button!.exists()).toBe(true);

      await button!.trigger("click");
      expect(wrapper.emitted("downloadZip")).toBeTruthy();
    });

    test("emits downloadAll when not in web environment", async () => {
      isWebMock.mockReturnValue(false);
      const wrapper = factory();
      const button = wrapper.findAllComponents({ name: "VFormButton" }).at(0);
      expect(button!.exists()).toBe(true);

      await button!.trigger("click");
      expect(wrapper.emitted("downloadAll")).toBeTruthy();
    });

    test("emits deleteAll on delete button click", async () => {
      const wrapper = factory();
      const buttons = wrapper.findAllComponents({ name: "VFormButton" });
      const deleteButton = buttons!.at(buttons.length - 1);
      expect(deleteButton!.exists()).toBe(true);

      await deleteButton!.trigger("click");
      expect(wrapper.emitted("deleteAll")).toBeTruthy();
    });
  });
});
