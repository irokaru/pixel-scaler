import { ref } from "vue";

import { CustomErrorObject } from "./@types/error";

export const GlobalErrors = ref<CustomErrorObject[]>([]);
