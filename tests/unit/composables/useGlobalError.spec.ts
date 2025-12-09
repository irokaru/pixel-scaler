import { createPinia, setActivePinia } from "pinia";

import useGlobalError from "@/composables/useGlobalError";
import { FileError } from "@/models/errors/FileError";
import { ScaleError } from "@/models/errors/ScaleError";
import { UnknownError } from "@/models/errors/UnknownError";
import { useErrorStore } from "@/stores/errorStore";

describe("useGlobalError", () => {
  let errorStore: ReturnType<typeof useErrorStore>;

  beforeEach(() => {
    setActivePinia(createPinia());
    errorStore = useErrorStore();
  });

  test("should add an error to GlobalErrors", () => {
    const { addError, GlobalErrors } = useGlobalError();
    const error = new FileError("test-error", { filename: "test.png" });

    addError(error);

    expect(GlobalErrors.value).toHaveLength(1);
    expect(GlobalErrors.value[0].kind).toBe("file");
    expect(errorStore.errors).toHaveLength(1);
  });

  test("should clear all errors", () => {
    const { addError, clearErrors, GlobalErrors } = useGlobalError();
    addError(new UnknownError("unknown"));
    addError(new ScaleError("error", { filename: "test.png" }));

    clearErrors();

    expect(GlobalErrors.value).toHaveLength(0);
    expect(errorStore.errors).toHaveLength(0);
  });

  test("should delete a specific error by uuid", () => {
    const { addError, deleteOneError, GlobalErrors } = useGlobalError();
    const error1 = new UnknownError("unknown");
    const error2 = new ScaleError("error", { filename: "test.png" });

    addError(error1);
    addError(error2);

    const uuid1 = GlobalErrors.value[0].uuid;

    deleteOneError(uuid1);

    expect(GlobalErrors.value).toHaveLength(1);
    expect(GlobalErrors.value[0].uuid).not.toBe(uuid1);
    expect(errorStore.errors).toHaveLength(1);
  });
});
