import { mount } from "@vue/test-utils";

import VClosableItem from "@/components/common/VClosableItem.vue";

describe("VClosableItem Component", () => {
  test("renders slot content", () => {
    const wrapper = mount(VClosableItem, {
      slots: {
        default: "<div>Test Content</div>",
      },
    });

    expect(wrapper.html()).toContain("Test Content");
  });

  test("emits 'close' event when close button is clicked", async () => {
    const wrapper = mount(VClosableItem);

    const closeBtn = wrapper.find(".close-btn span");
    await closeBtn.trigger("click");

    expect(wrapper.emitted()).toHaveProperty("close");
    expect(wrapper.emitted("close")?.length).toBe(1);
  });
});
