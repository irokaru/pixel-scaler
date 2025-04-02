import { mount } from "@vue/test-utils";
import { ref } from "vue";

import VCheckbox from "@/components/common/VFormCheckBox.vue";

describe("VCheckbox.vue", () => {
  test("renders with correct label and initial state", () => {
    const model = ref(false);
    const wrapper = mount(VCheckbox, {
      props: {
        name: "test-checkbox",
        label: "Test Label",
        modelValue: model.value,
      },
    });

    const input = wrapper.find("input");
    const label = wrapper.find("label");

    expect(input.exists()).toBe(true);
    expect(label.text()).toBe("Test Label");
    expect(input.element.checked).toBe(false);
  });

  test.each<{ description: string; initial: boolean; expected: boolean }>([
    {
      description: "toggles check state from false to true",
      initial: false,
      expected: true,
    },
    {
      description: "toggles check state from true to false",
      initial: true,
      expected: false,
    },
  ])("$description", async ({ initial, expected }) => {
    const model = ref(initial);
    const wrapper = mount(VCheckbox, {
      props: {
        name: "test-checkbox",
        label: "Test Label",
        modelValue: model.value,
      },
      modelValue: model,
    });

    const input = wrapper.find("input");

    await input.trigger("click");
    expect(input.element.checked).toBe(expected);
  });

  test.each<{ description: string; disabled: boolean; shouldToggle: boolean }>([
    {
      description: "does not toggle when disabled",
      disabled: true,
      shouldToggle: false,
    },
    {
      description: "toggles when not disabled",
      disabled: false,
      shouldToggle: true,
    },
  ])("$description", async ({ disabled, shouldToggle }) => {
    const model = ref(false);
    const wrapper = mount(VCheckbox, {
      props: {
        name: "test-checkbox",
        label: "Test Label",
        modelValue: model.value,
        disabled,
      },
      modelValue: model,
    });

    const input = wrapper.find("input");

    await input.trigger("click");
    expect(input.element.checked).toBe(shouldToggle);
  });

  test.each<{ description: string; initial: boolean; expected: boolean }>([
    {
      description: "toggles check state when label is clicked (false to true)",
      initial: false,
      expected: true,
    },
    {
      description: "toggles check state when label is clicked (true to false)",
      initial: true,
      expected: false,
    },
  ])("$description", async ({ initial, expected }) => {
    const model = ref(initial);
    const wrapper = mount(VCheckbox, {
      props: {
        name: "test-checkbox",
        label: "Test Label",
        modelValue: model.value,
      },
      modelValue: model,
    });

    const label = wrapper.find("label");

    await label.trigger("click");
    expect(wrapper.find("input").element.checked).toBe(expected);
  });
});
