import { watch, ref } from "vue";

import { ResultDisplayStyleType } from "@/@types/form";
import { StorageKey } from "@/constants/displayStyle";
import {
  getLocalStorage,
  setLocalStorage,
} from "@/core/infrastructure/storage";
import { isResultDisplayStyle } from "@/guards/form";

const useDisplayStyle = () => {
  const stored = getLocalStorage(StorageKey);
  const displayStyle = ref<ResultDisplayStyleType>(
    isResultDisplayStyle(stored) ? stored : "grid",
  );
  watch(displayStyle, (newValue) => {
    setLocalStorage(StorageKey, newValue);
  });

  return { displayStyle };
};

export default useDisplayStyle;
