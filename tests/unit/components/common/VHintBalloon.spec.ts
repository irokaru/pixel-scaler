import { mount } from "@vue/test-utils";

import VHintBalloon from "@/components/common/VHintBalloon.vue";

describe("VHintBalloon Component", () => {
  test.each<"top" | "bottom">(["top", "bottom"])(
    "renders the component and applies the correct pos class when position is %s",
    (position) => {
      const wrapper = mount(VHintBalloon, {
        props: {
          position,
        },
        slots: {
          default: "Test Hint Content",
        },
      });

      expect(wrapper.find(".hint-balloon").exists()).toBe(true);
      expect(wrapper.find(".hint-balloon-content").text()).toBe(
        "Test Hint Content",
      );
      expect(wrapper.find(".hint-balloon-content").classes()).toContain(
        `hint-balloon-content-position--${position}`,
      );
    },
  );

  test("renders the FontAwesomeIcon correctly", () => {
    const wrapper = mount(VHintBalloon, {
      props: {
        position: "top",
      },
    });

    expect(wrapper.find(".hint-icon").exists()).toBe(true);
    expect(wrapper.findComponent({ name: "FontAwesomeIcon" }).exists()).toBe(
      true,
    );
  });
});
