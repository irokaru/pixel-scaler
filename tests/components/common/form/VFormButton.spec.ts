import { mount } from "@vue/test-utils";

import VFormButton from "@/components/common/form/VFormButton.vue";

describe("VFormButton Component", () => {
  test("renders slot content", () => {
    const wrapper = mount(VFormButton, {
      slots: {
        default: "<span>Click Me</span>",
      },
    });
    expect(wrapper.html()).toContain("<span>Click Me</span>");
  });

  test("emits click event when clicked", async () => {
    const wrapper = mount(VFormButton);
    await wrapper.trigger("click");
    expect(wrapper.emitted()).toHaveProperty("click");
  });
});
