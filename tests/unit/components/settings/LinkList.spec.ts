import { mount } from "@vue/test-utils";

import LinkList from "@/components/settings/LinkList.vue";
import { links } from "@/constants/link";

describe("LinkList.vue", () => {
  const factory = (props = {}) => {
    return mount(LinkList, {
      props: {
        ...props,
      },
      global: {
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });
  };

  test("renders all links correctly", () => {
    const wrapper = factory();

    const linkElements = wrapper.findAll("a");
    expect(linkElements.length).toBe(links.length);

    for (const [index, link] of links.entries()) {
      const linkElement = linkElements[index];
      expect(linkElement.attributes("href")).toBe(link.url);
      expect(linkElement.text()).toContain(wrapper.vm.$t(link.textKey));
    }
  });

  test("opens links in a new tab", () => {
    const wrapper = factory();

    const linkElements = wrapper.findAll("a");
    for (const linkElement of linkElements) {
      expect(linkElement.attributes("target")).toBe("_blank");
    }
  });
});
