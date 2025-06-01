import { mount } from "@vue/test-utils";

import VFormRadio from "@/components/common/form/VFormRadio.vue";

describe("VFormRadio Component", () => {
  test("renders radio options correctly", () => {
    const options = [
      { label: "Option 1", value: "option1", checked: false },
      { label: "Option 2", value: "option2", checked: true },
      { label: "Option 3", value: "option3", checked: false },
    ];
    const wrapper = mount(VFormRadio, {
      props: {
        name: "radioGroup",
        options,
        modelValue: options[1].value,
      },
    });

    const radioOptions = wrapper.findAll(".radio");
    expect(radioOptions.length).toBe(options.length);

    for (const [index, option] of options.entries()) {
      expect(radioOptions[index].text()).toBe(option.label);
      expect(radioOptions[index].find("input").element.value).toBe(
        option.value,
      );
      expect(radioOptions[index].find("input").element.checked).toBe(
        option.checked,
      );
    }
  });

  test("emits update:modelValue event when radio option is changed", async () => {
    const wrapper = mount(VFormRadio, {
      props: {
        name: "radioGroup",
        options: [
          { label: "Option 1", value: "option1" },
          { label: "Option 2", value: "option2" },
          { label: "Option 3", value: "option3" },
        ],
        modelValue: "option2",
      },
    });

    const radioOption = wrapper.find<HTMLLabelElement>(".radio:nth-child(3)");
    await radioOption.find("input").trigger("change");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["option3"]);
  });
});
