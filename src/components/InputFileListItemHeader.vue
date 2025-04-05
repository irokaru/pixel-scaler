<script lang="ts" setup>
import VFormCheckBox from "./common/VFormCheckBox.vue";

const modelValue = defineModel<boolean>({
  required: true,
});
const emit = defineEmits<{
  click: [];
}>();
</script>

<template>
  <div
    class="input-file-list-item col margin-tb-1"
    data-testid="input-file-list-item__header"
  >
    <div class="input-file-list-item__title">
      <VFormCheckBox
        v-model="modelValue"
        name="all-check"
        @click="emit('click')"
        label=""
      />
    </div>
    <div class="input-file-list-item__ctrl">
      <div class="input-file-list-item__params">
        <div>{{ $t("form.scale-size-percent") }}</div>
        <div>{{ $t("form.original-pixel-size") }}</div>
        <div>{{ $t("form.scale-mode") }}</div>
      </div>
      <div class="input-file-list-item__btn-list">
        <div>{{ $t("form.convert") }}</div>
        <div>{{ $t("form.delete") }}</div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.input-file-list-item {
  display: grid;
  grid-template-columns: 2fr auto auto;
  gap: 1rem;
  align-items: center;

  &__checkbox {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem; // チェックボックス用の固定幅
  }

  &__title {
    position: relative;
    min-width: 0; // グリッドの幅を超えないようにする
  }

  &__ctrl {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    justify-content: flex-end;
  }

  &__params {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;

    input {
      min-width: 3.5rem; // 必要最低限の幅を確保（縮小）
      width: 3.5rem; // 固定幅にする
    }
  }

  &__btn-list {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }
}
</style>
