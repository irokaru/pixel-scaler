import { mount } from "@vue/test-utils";

import VFormInput from "@/components/common/VFormInput.vue";

describe("VFormInput Component", () => {
  test.each<{
    description: string;
    props: {
      type: "number" | "text";
      min: number;
      max: number;
      allowDecimal?: boolean;
      modelValue: number | string;
    };
    inputValue: string;
    expectedValue: number | string;
  }>([
    {
      description: "should allow decimal input when allowDecimal is true",
      props: {
        type: "number",
        min: 0,
        max: 100,
        allowDecimal: true,
        modelValue: 0,
      },
      inputValue: "12.34",
      expectedValue: 12.34,
    },
    {
      description: "should truncate decimal input when allowDecimal is false",
      props: {
        type: "number",
        min: 0,
        max: 100,
        allowDecimal: false,
        modelValue: 0,
      },
      inputValue: "12.34",
      expectedValue: 12,
    },
    {
      description: "should respect max constraint",
      props: {
        type: "number",
        min: 10,
        max: 20,
        allowDecimal: true,
        modelValue: 15,
      },
      inputValue: "25",
      expectedValue: 20,
    },
    {
      description: "should respect min constraint",
      props: {
        type: "number",
        min: 10,
        max: 20,
        allowDecimal: true,
        modelValue: 15,
      },
      inputValue: "5",
      expectedValue: 10,
    },
    {
      description:
        "should handle text input correctly (truncate to max length)",
      props: { type: "text", min: 3, max: 5, modelValue: "" },
      inputValue: "hello world",
      expectedValue: "hello",
    },
    {
      description: "should handle text input correctly (not pad to min length)",
      props: { type: "text", min: 3, max: 5, modelValue: "" },
      inputValue: "hi",
      expectedValue: "hi",
    },
  ])("$description", async ({ props, inputValue, expectedValue }) => {
    const wrapper = mount(VFormInput, { props });
    const input = wrapper.find("input");
    await input.setValue(inputValue);
    input.trigger("blur");
    expect(wrapper.emitted("update:modelValue")?.[0][0]).toBe(expectedValue);
  });
});
