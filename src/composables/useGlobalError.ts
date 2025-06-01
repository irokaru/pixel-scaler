import { CustomErrorObject, ErrorKind } from "@/@types/error";
import { GlobalErrors } from "@/globalErrors";

const useGlobalError = () => {
  const addError = (error: CustomErrorObject) => {
    GlobalErrors.value.push(error);
  };

  const clearErrors = (targetKinds: ErrorKind[] = []) => {
    GlobalErrors.value =
      targetKinds.length > 0
        ? GlobalErrors.value.filter(
            (error) => !targetKinds.includes(error.kind),
          )
        : [];
  };

  const deleteOneError = (uuid: string) => {
    GlobalErrors.value = GlobalErrors.value.filter(
      (error) => error.uuid !== uuid,
    );
  };

  return {
    GlobalErrors,
    addError,
    clearErrors,
    deleteOneError,
  };
};

export default useGlobalError;
