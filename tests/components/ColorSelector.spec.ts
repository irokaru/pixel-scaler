import { mount } from "@vue/test-utils";

import ColorSelector from "@/components/ColorSelector.vue";

describe("ColorSelector", () => {
  it("renders the correct number of color boxes", () => {
    const colors = {
      red: { background: "red" },
      blue: { background: "blue" },
      green: { background: "green" },
    };

    const wrapper = mount(ColorSelector, {
      props: {
        colors,
      },
    });

    const colorBoxes = wrapper.findAll(".color-box");
    expect(colorBoxes.length).toBe(Object.keys(colors).length);
  });

  it('emits the "clicked" event when a color box is clicked', async () => {
    const colors = {
      red: { background: "red" },
      blue: { background: "blue" },
      green: { background: "green" },
    };

    const wrapper = mount(ColorSelector, {
      props: {
        colors,
      },
    });

    const colorBox = wrapper.find(".color-box");
    await colorBox.trigger("click");

    expect(wrapper.emitted("clicked")).toBeTruthy();
    expect(wrapper.emitted("clicked")[0][0]).toBe("red");
  });
});
