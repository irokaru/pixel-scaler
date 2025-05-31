import { invoke } from "@tauri-apps/api/core";
import { normalize } from "@tauri-apps/api/path";
import { open } from "@tauri-apps/plugin-dialog";
import { exists } from "@tauri-apps/plugin-fs";
import { ref, Ref, watch } from "vue";

import { vueI18n } from "@/core/plugins/i18n";
import { isWeb } from "@/core/system";

const usePathSelector = (path: Ref<string>) => {
  return isWeb() ? usePathSelectorWeb() : usePathSelectorStandalone(path);
};

const usePathSelectorStandalone = (path: Ref<string>) => {
  const error = ref<string>("");
  const allowedRoot = ref<string>("");

  const hasError = () => {
    return error.value !== "";
  };

  // NOTE: fetch and normalize allowed root dir (default = home)
  const resolveAllowedRoot = async () => {
    const dir = await invoke<string>("get_home_dir");
    allowedRoot.value = await normalize(dir);
  };

  const browseDir = async () => {
    const selected = await open({
      directory: true,
      multiple: false,
      defaultPath: path.value || undefined,
      title: vueI18n.global.t("path-selector.title"),
    });

    if (selected && typeof selected === "string") {
      path.value = selected;
    }
  };

  const validatePath = async (value: string) => {
    if (!allowedRoot.value) await resolveAllowedRoot();

    if (!value) {
      error.value = "path-selector.empty-path";
      return;
    }

    const normPath = await normalize(value);

    const isInRoot =
      normPath === allowedRoot.value ||
      normPath.startsWith(allowedRoot.value + "/") ||
      normPath.startsWith(allowedRoot.value + "\\");

    if (!isInRoot) {
      error.value = "path-selector.path-not-in-allowed-root";
      return;
    }

    const existsPath = await exists(value);
    if (!existsPath) {
      error.value = "path-selector.path-does-not-exist";
      return;
    }

    error.value = "";
  };

  watch(
    path,
    (newValue) => {
      validatePath(newValue);
    },
    { immediate: true },
  );

  return {
    error,
    hasError,
    browseDir,
  };
};

const usePathSelectorWeb = () => {
  const error = ref<string>("");
  const hasError = () => false;
  const browseDir = () => Promise.resolve();

  return {
    error,
    hasError,
    browseDir,
  };
};

export default usePathSelector;
