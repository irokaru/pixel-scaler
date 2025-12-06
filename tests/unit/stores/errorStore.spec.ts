import { createPinia, setActivePinia } from "pinia";

import { UnknownError } from "@/models/errors/UnknownError";
import { useErrorStore } from "@/stores/errorStore";

describe("errorStore", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  describe("addError", () => {
    test("should add error to the store", () => {
      const store = useErrorStore();
      const error = new UnknownError("Test error");

      store.addError(error);

      expect(store.errors).toHaveLength(1);
      expect(store.errors[0].code).toBe("error.unknown.unknown");
    });

    test("should add multiple errors", () => {
      const store = useErrorStore();
      const error1 = new UnknownError("Error 1");
      const error2 = new UnknownError("Error 2");

      store.addError(error1);
      store.addError(error2);

      expect(store.errors).toHaveLength(2);
      expect(store.errors[0].code).toBe("error.unknown.unknown");
      expect(store.errors[1].code).toBe("error.unknown.unknown");
    });
  });

  describe("deleteOneError", () => {
    test("should delete error by uuid", () => {
      const store = useErrorStore();
      const error1 = new UnknownError("Error 1");
      const error2 = new UnknownError("Error 2");
      const error3 = new UnknownError("Error 3");

      store.addError(error1);
      store.addError(error2);
      store.addError(error3);

      const uuidToDelete = store.errors[1].uuid;
      store.deleteOneError(uuidToDelete);

      expect(store.errors).toHaveLength(2);
      expect(store.errors.find((e) => e.uuid === uuidToDelete)).toBeUndefined();
    });

    test("should do nothing if uuid not found", () => {
      const store = useErrorStore();
      const error = new UnknownError("Error");

      store.addError(error);
      store.deleteOneError("non-existent-uuid");

      expect(store.errors).toHaveLength(1);
    });
  });

  describe("clearErrors", () => {
    test("should clear all errors", () => {
      const store = useErrorStore();
      store.addError(new UnknownError("Error 1"));
      store.addError(new UnknownError("Error 2"));

      store.clearErrors();

      expect(store.errors).toHaveLength(0);
    });

    test("should work when there are no errors", () => {
      const store = useErrorStore();

      store.clearErrors();

      expect(store.errors).toHaveLength(0);
    });
  });
});
