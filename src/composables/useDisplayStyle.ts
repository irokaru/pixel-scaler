import { watch, ref } from "vue";

import { StorageKey } from "@/constants/displayStyle";
import { isResultDisplayStyle } from "@/core/guards/form";
import {
  getLocalStorage,
  setLocalStorage,
} from "@/core/infrastructure/storage";
import { ResultDisplayStyleType } from "@/types/form";

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
