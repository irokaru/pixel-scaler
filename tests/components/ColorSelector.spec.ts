import { mount } from "@vue/test-utils";
import { nextTick } from "vue";

import ColorSelector from "@/components/ColorSelector.vue";
import { getAllColors } from "@/core/services/colorService";

describe("ColorSelector", () => {
  test("renders the correct number of color boxes", () => {
    const wrapper = mount(ColorSelector);

    const colorBoxes = wrapper.findAll(".color-box");
    expect(colorBoxes.length).toBe(Object.keys(getAllColors()).length);
  });

  test("updates the modelValue when a color box is clicked", async () => {
    const wrapper = mount(ColorSelector);

    const colorBox = wrapper.findAll(".color-box").at(5);
    await colorBox?.trigger("click");

    nextTick();

    expect(document.documentElement.dataset.colorTheme).toBe("blue_dark");
  });
});
