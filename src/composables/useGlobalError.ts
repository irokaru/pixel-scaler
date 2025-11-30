import { computed } from "vue";

import { CustomErrorObject, ErrorKind } from "@/@types/error";
import useImageEntryStore from "@/stores/imageEntryStore";

const useGlobalError = () => {
  const store = useImageEntryStore();

  const GlobalErrors = computed(() => store.errors);

  const addError = (error: CustomErrorObject) => {
    store.addError(error);
  };

  const clearErrors = (targetKinds: ErrorKind[] = []) => {
    store.clearErrors(targetKinds);
  };

  const deleteOneError = (uuid: string) => {
    store.deleteOneError(uuid);
  };

  return {
    GlobalErrors,
    addError,
    clearErrors,
    deleteOneError,
  };
};

export default useGlobalError;
