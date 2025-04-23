import { mount } from "@vue/test-utils";

import VFormSelectBox from "@/components/common/VFormSelectBox.vue";

describe("VFormSelectBox Component", () => {
  const options = [
    { label: "Option 1", value: 1 },
    { label: "Option 2", value: 2 },
    { label: "Option 3", value: 3 },
  ];

  test("renders options correctly", () => {
    const wrapper = mount(VFormSelectBox, {
      props: {
        id: "test-select",
        name: "test-select",
        options,
        modelValue: 2,
      },
    });

    const renderedOptions = wrapper.findAll("option");
    expect(renderedOptions.length).toBe(options.length);

    for (const [index, option] of options.entries()) {
      expect(renderedOptions[index].text()).toBe(option.label);
      expect(renderedOptions[index].attributes("value")).toBe(
        option.value.toString(),
      );
    }
  });

  test("binds modelValue correctly", async () => {
    const wrapper = mount(VFormSelectBox, {
      props: {
        id: "test-select",
        name: "test-select",
        options,
        modelValue: 2,
      },
    });

    const select = wrapper.find("select");
    expect((select.element as HTMLSelectElement).value).toBe("2");

    await select.setValue("3");
    expect(wrapper.emitted()["update:modelValue"][0]).toEqual([3]);
  });
});
