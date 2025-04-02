import { mount } from "@vue/test-utils";

import VAccordionContent from "@/components/common/VAccordionContent.vue";

const headerSlot = "<div>Header Content</div>";
const bodySlot = "<div>Body Content</div>";

describe("VAccordionContent Component", () => {
  test("renders header and body slots", () => {
    const wrapper = mount(VAccordionContent, {
      slots: {
        header: headerSlot,
        body: bodySlot,
      },
    });

    expect(wrapper.html()).toContain("Header Content");
    expect(wrapper.html()).toContain("Body Content");
  });

  test("toggles accordion body visibility on header click", async () => {
    const wrapper = mount(VAccordionContent, {
      slots: {
        header: headerSlot,
        body: bodySlot,
      },
    });

    const header = wrapper.find(".accordion-content--header");
    const body = wrapper.find<HTMLDivElement>(".accordion-content--body");

    expect(getComputedStyle(body.element).maxHeight).toBe("");

    await header.trigger("click");
    expect(getComputedStyle(body.element).maxHeight).not.toBe("0px");

    await header.trigger("click");
    expect(getComputedStyle(body.element).maxHeight).toBe("");
  });

  test("rotates the icon when toggled", async () => {
    const wrapper = mount(VAccordionContent, {
      slots: {
        header: headerSlot,
        body: bodySlot,
      },
    });

    const icon = wrapper.find<HTMLElement>(
      ".accordion-content--header-icon svg",
    );

    expect(icon.element.classList).not.toContain("fa-rotate-180");

    await wrapper.find(".accordion-content--header").trigger("click");
    expect(icon.element.classList).toContain("fa-rotate-180");

    await wrapper.find(".accordion-content--header").trigger("click");
    expect(icon.element.classList).not.toContain("fa-rotate-180");
  });
});
