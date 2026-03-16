import { defineStore } from "pinia";
import { computed, ref } from "vue";

import { CustomErrorBase } from "@/core/models/errors/_ErrorBase";
import { UnknownError } from "@/core/models/errors/UnknownError";
import type { CustomErrorObject } from "@/types/error";

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
