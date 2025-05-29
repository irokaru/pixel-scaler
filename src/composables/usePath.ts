import { ref, watch } from "vue";

import { OutputPathStorageKey } from "@/constants/form";
import {
  getLocalStorage,
  setLocalStorage,
} from "@/core/infrastructure/storage";

const usePath = () => {
  const stored = getLocalStorage(OutputPathStorageKey);
  const outputPath = ref<string>(stored || "");
  watch(outputPath, (newValue) => {
    setLocalStorage(OutputPathStorageKey, newValue);
  });
  return { outputPath };
};

export default usePath;
