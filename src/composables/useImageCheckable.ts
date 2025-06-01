import { computed, ref, Ref, watch } from "vue";

import { ImageCheckList, PSImageDataObject } from "@/@types/convert";

const useImageCheckable = <T extends { image: PSImageDataObject }>(
  modelValue: Ref<T[]>,
) => {
  const checkedMap = ref<ImageCheckList>({});

  const allChecked = computed({
    get: () =>
      modelValue.value.length > 0 &&
      modelValue.value.every((item) => checkedMap.value[item.image.uuid]),
    set: (val: boolean) => {
      for (const item of modelValue.value) {
        checkedMap.value[item.image.uuid] = val;
      }
    },
  });

  const toggleAllChecked = () => {
    allChecked.value = !allChecked.value;
  };

  const isAnyChecked = computed(() =>
    Object.values(checkedMap.value).some(Boolean),
  );

  watch(
    modelValue,
    (newList) => {
      for (const item of newList) {
        if (!(item.image.uuid in checkedMap.value)) {
          checkedMap.value[item.image.uuid] = false;
        }
      }

      const uuids = new Set(newList.map((item) => item.image.uuid));
      for (const uuid of Object.keys(checkedMap.value)) {
        if (!uuids.has(uuid)) {
          delete checkedMap.value[uuid];
        }
      }
    },
    { immediate: true, deep: true },
  );

  return {
    checkedMap,
    allChecked,
    toggleAllChecked,
    isAnyChecked,
  };
};

export default useImageCheckable;
