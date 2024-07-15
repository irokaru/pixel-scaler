import { mount } from "@vue/test-utils";

import ColorSelector from "@/components/ColorSelector.vue";
import { getColorSettingsList } from "@/controllers/colorController";

describe("ColorSelector", () => {
  test("renders the correct number of color boxes", () => {
    const wrapper = mount(ColorSelector, {
      props: {
        modelValue: "red",
      },
    });

    const colorBoxes = wrapper.findAll(".color-box");
    expect(colorBoxes.length).toBe(Object.keys(getColorSettingsList()).length);
  });

  test('emits the "clicked" event when a color box is clicked', async () => {
    const wrapper = mount(ColorSelector, {
      props: {
        modelValue: "red",
      },
    });

    const colorBox = wrapper.find(".color-box");
    await colorBox.trigger("click");

    const emittedUpdateModelValue = wrapper.emitted("update:modelValue");
    expect(emittedUpdateModelValue).toBeTruthy();
    expect(emittedUpdateModelValue?.[0][0]).toBe("blue_dark");
  });
});
