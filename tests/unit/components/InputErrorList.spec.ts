import { mount } from "@vue/test-utils";

import { CustomErrorObject, ErrorKind } from "@/@types/error";
import InputErrorList from "@/components/InputErrorList.vue";

describe("InputErrorList", () => {
  const defaultErrors: CustomErrorObject[] = [
    { uuid: "1", kind: "input", code: "error.required", params: {} },
    { uuid: "2", kind: "input", code: "error.server", params: {} },
  ];

  const defaultKinds: ErrorKind[] = ["input"];

  const factory = (props = {}) => {
    return mount(InputErrorList, {
      props: {
        errors: defaultErrors,
        kinds: defaultKinds,
        ...props,
      },
      global: {
        mocks: {
          $t: (msg: string) => msg,
        },
      },
    });
  };

  test("renders filtered errors based on kinds", () => {
    const wrapper = factory();

    expect(wrapper.findAll(".input-error-list__item").length).toBe(2);
    expect(wrapper.text()).toContain("error.required");
  });

  test("emits deleteOneError when an error is closed", async () => {
    const wrapper = factory();

    const closableItem = wrapper.findComponent({ name: "VClosableItem" });
    await closableItem.vm.$emit("close");

    const emitted = wrapper.emitted("deleteOneError");
    expect(emitted).toBeTruthy();
    expect(emitted!.length).toBe(1);
    expect(emitted![0]).toEqual(["1"]);
  });

  test("emits deleteAllErrors when delete button is clicked", async () => {
    const wrapper = factory();

    await wrapper
      .find(".input-error-list__header-button .v-form-button")
      .trigger("click");
    expect(wrapper.emitted("deleteAllErrors")).toBeTruthy();
  });

  test("does not render if there are no filtered errors", () => {
    const wrapper = factory({ errors: [] });

    expect(wrapper.find(".input-error-list").exists()).toBe(false);
  });

  test("does not render if there are kind no matched errors", () => {
    const wrapper = factory({ kinds: ["unknown"] });

    expect(wrapper.find(".input-error-list").exists()).toBe(false);
  });
});
