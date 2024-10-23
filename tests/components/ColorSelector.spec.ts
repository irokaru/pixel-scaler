import { mount } from "@vue/test-utils";
import { ref } from "vue";

import ColorSelector from "@/components/ColorSelector.vue";
import { getAllColors } from "@/services/colorService";

describe("ColorSelector", () => {
  test("renders the correct number of color boxes", () => {
    const wrapper = mount(ColorSelector, {
      props: {
        modelValue: "red",
      },
    });

    const colorBoxes = wrapper.findAll(".color-box");
    expect(colorBoxes.length).toBe(Object.keys(getAllColors()).length);
  });

  test("updates the modelValue when a color box is clicked", async () => {
    const themeColorKey = ref("red");
    const wrapper = mount(ColorSelector, {
      props: {
        modelValue: themeColorKey.value,
        "onUpdate:modelValue": (newValue: string) => {
          themeColorKey.value = newValue;
        },
      },
    });

    const colorBox = wrapper.findAll(".color-box").at(5);
    await colorBox?.trigger("click");

    expect(themeColorKey.value).toBe("blue_dark");
  });
});
