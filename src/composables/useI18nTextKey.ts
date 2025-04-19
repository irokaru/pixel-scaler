import { computed, Ref } from "vue";

const useI18nTextKey = (isAnyChecked: Ref<boolean>) => {
  const convertText = computed(() =>
    isAnyChecked.value ? "form.convert-selected" : "form.convert-all",
  );
  const deleteText = computed(() =>
    isAnyChecked.value ? "delete-selected" : "delete-all",
  );
  const applyText = computed(() =>
    isAnyChecked.value ? "form.apply-selected" : "form.apply-all",
  );

  return {
    convertText,
    deleteText,
    applyText,
  };
};

export default useI18nTextKey;
