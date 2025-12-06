import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { CustomErrorObject } from "@/@types/error";
import { CustomErrorBase } from "@/models/errors/_ErrorBase";
import { UnknownError } from "@/models/errors/UnknownError";

export const useErrorStore = defineStore("error", () => {
  const errors = ref<CustomErrorObject[]>([]);

  const hasErrors = computed(() => errors.value.length > 0);

  const addError = (error: unknown): void => {
    if (error instanceof CustomErrorBase) {
      errors.value.push(error.toObject());
    } else {
      errors.value.push(new UnknownError(error).toObject());
    }
  };

  const clearErrors = (): void => {
    errors.value = [];
  };

  const deleteOneError = (uuid: string): void => {
    errors.value = errors.value.filter((error) => error.uuid !== uuid);
  };

  return {
    errors,
    hasErrors,
    addError,
    clearErrors,
    deleteOneError,
  };
});
