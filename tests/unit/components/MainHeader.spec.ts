import { mount } from "@vue/test-utils";

import MainHeader from "@/components/MainHeader.vue";
import * as system from "@/core/system";

const isUniteMock = vi.spyOn(system, "isUnite");

describe("MainHeader.vue", () => {
  const factory = (props = {}) => {
    return mount(MainHeader, {
      props: {
        ...props,
      },
      global: {
        mocks: {
          $t: (key: string) => key,
        },
      },
    });
  };

  test("renders the image when isUnite() returns true", () => {
    isUniteMock.mockReturnValue(true);

    const wrapper = factory();

    expect(wrapper.find("img").exists()).toBe(true);
    expect(wrapper.find("img").attributes("src")).toBe("/banner.png");
  });

  test("renders the title text when isUnite() returns false", () => {
    isUniteMock.mockReturnValue(false);

    const wrapper = factory();

    expect(wrapper.find("h1").text()).toBe("title");
    expect(wrapper.find("img").exists()).toBe(false);
  });
});
