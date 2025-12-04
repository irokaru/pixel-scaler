import { computed } from "vue";

import { useErrorStore } from "@/stores/errorStore";

const useGlobalError = () => {
  const errorStore = useErrorStore();

  const GlobalErrors = computed(() => errorStore.errors);

  const addError = (error: unknown) => {
    errorStore.addError(error);
  };

  const clearErrors = () => {
    errorStore.clearErrors();
  };

  const deleteOneError = (uuid: string) => {
    errorStore.deleteOneError(uuid);
  };

  return {
    GlobalErrors,
    addError,
    clearErrors,
    deleteOneError,
  };
};

export default useGlobalError;
