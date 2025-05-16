import { CustomErrorObject } from "@/@types/error";
import useGlobalError from "@/composables/useGlobalError";
import { GlobalErrors } from "@/globalErrors";

describe("useGlobalError", () => {
  beforeEach(() => {
    GlobalErrors.value = [];
  });

  test("should add an error to GlobalErrors", () => {
    const { addError } = useGlobalError();
    const error: CustomErrorObject = {
      uuid: "123",
      kind: "file",
      code: "test",
      params: {},
    };

    addError(error);

    expect(GlobalErrors.value).toHaveLength(1);
    expect(GlobalErrors.value[0]).toEqual(error);
  });

  test("should clear all errors if no targetKinds are provided", () => {
    const { addError, clearErrors } = useGlobalError();
    addError({ uuid: "123", kind: "unknown", code: "unknown", params: {} });
    addError({ uuid: "456", kind: "scale", code: "error", params: {} });

    clearErrors();

    expect(GlobalErrors.value).toHaveLength(0);
  });

  test("should clear only errors matching the targetKinds", () => {
    const { addError, clearErrors } = useGlobalError();
    addError({ uuid: "123", kind: "unknown", code: "unknown", params: {} });
    addError({ uuid: "456", kind: "scale", code: "error", params: {} });

    clearErrors(["scale"]);

    expect(GlobalErrors.value).toHaveLength(1);
    expect(GlobalErrors.value[0].kind).toBe("unknown");
  });

  test("should delete a specific error by uuid", () => {
    const { addError, deleteOneError } = useGlobalError();
    addError({ uuid: "123", kind: "unknown", code: "unknown", params: {} });
    addError({ uuid: "456", kind: "scale", code: "error", params: {} });

    deleteOneError("123");

    expect(GlobalErrors.value).toHaveLength(1);
    expect(GlobalErrors.value[0].uuid).toBe("456");
  });
});
