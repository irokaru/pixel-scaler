import { open } from "@tauri-apps/plugin-dialog";
import { exists } from "@tauri-apps/plugin-fs";
import { defineStore } from "pinia";
import { computed, ref, watch } from "vue";

import { OutputPathStorageKey } from "@/constants/form";
import {
  getLocalStorage,
  setLocalStorage,
} from "@/core/infrastructure/storage";
import { isWeb } from "@/core/system";

const useOutputPathStore = defineStore("outputPathStore", () => {
  const outputPath = ref<string>(getLocalStorage(OutputPathStorageKey) || "");
  const error = ref<string>("");
  const isWebVal = isWeb();

  const hasError = computed(() => error.value !== "");

  watch(outputPath, (newValue) => {
    if (isWebVal) return;
    setLocalStorage(OutputPathStorageKey, newValue);
    validatePath(newValue);
  });

  const browseDir = async () => {
    if (isWebVal) return;

    const selected = await open({
      directory: true,
      multiple: false,
      defaultPath: outputPath.value || undefined,
      title: "Select Output Directory",
    });

    if (selected && typeof selected === "string") {
      outputPath.value = selected;
    }
  };

  const validatePath = async (value: string) => {
    if (isWebVal) return;

    if (!value) {
      error.value = "path-selector.empty-path";
      return;
    }

    const existsPath = await exists(value);
    if (!existsPath) {
      error.value = "path-selector.path-does-not-exist";
      return;
    }

    // NOTE: Clear error if validation passes
    error.value = "";
  };

  // NOTE: throw callback error when settings watch immediate option
  validatePath(outputPath.value);

  return {
    outputPath,
    error,
    hasError,
    browseDir,
    validatePath,
  };
});

export default useOutputPathStore;
