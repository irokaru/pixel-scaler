import { createPinia, setActivePinia } from "pinia";

import { CustomErrorObject } from "@/@types/error";
import useGlobalError from "@/composables/useGlobalError";
import useImageEntryStore from "@/stores/imageEntryStore";

describe("useGlobalError", () => {
  let store: ReturnType<typeof useImageEntryStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    store = useImageEntryStore();
  });

  test("should add an error to GlobalErrors", () => {
    const { addError, GlobalErrors } = useGlobalError();
    const error: CustomErrorObject = {
      uuid: "123",
      kind: "file",
      code: "test",
      params: {},
    };

    addError(error);

    expect(GlobalErrors.value).toHaveLength(1);
    expect(GlobalErrors.value[0]).toEqual(error);
    expect(store.errors).toHaveLength(1);
  });

  test("should clear all errors if no targetKinds are provided", () => {
    const { addError, clearErrors, GlobalErrors } = useGlobalError();
    addError({ uuid: "123", kind: "unknown", code: "unknown", params: {} });
    addError({ uuid: "456", kind: "scale", code: "error", params: {} });

    clearErrors();

    expect(GlobalErrors.value).toHaveLength(0);
    expect(store.errors).toHaveLength(0);
  });

  test("should clear only errors matching the targetKinds", () => {
    const { addError, clearErrors, GlobalErrors } = useGlobalError();
    addError({ uuid: "123", kind: "unknown", code: "unknown", params: {} });
    addError({ uuid: "456", kind: "scale", code: "error", params: {} });

    clearErrors(["scale"]);

    expect(GlobalErrors.value).toHaveLength(1);
    expect(GlobalErrors.value[0].kind).toBe("unknown");
    expect(store.errors).toHaveLength(1);
  });

  test("should delete a specific error by uuid", () => {
    const { addError, deleteOneError, GlobalErrors } = useGlobalError();
    addError({ uuid: "123", kind: "unknown", code: "unknown", params: {} });
    addError({ uuid: "456", kind: "scale", code: "error", params: {} });

    deleteOneError("123");

    expect(GlobalErrors.value).toHaveLength(1);
    expect(GlobalErrors.value[0].uuid).toBe("456");
    expect(store.errors).toHaveLength(1);
  });
});
