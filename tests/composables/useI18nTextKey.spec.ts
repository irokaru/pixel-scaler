import { ref } from "vue";

import useI18nTextKey from "@/composables/useI18nTextKey";

describe("useI18nTextKey", () => {
  test.each<{
    description: string;
    isAnyChecked: boolean;
    expectedConvertText: string;
    expectedDeleteText: string;
    expectedApplyText: string;
    expectedDownloadZipText: string;
    expectedDownloadFileText: string;
  }>([
    {
      description: "should return correct text keys when isAnyChecked is true",
      isAnyChecked: true,
      expectedConvertText: "form.convert-selected",
      expectedDeleteText: "delete-selected",
      expectedApplyText: "form.apply-selected",
      expectedDownloadZipText: "convert.download-zip-selected",
      expectedDownloadFileText: "convert.download-selected",
    },
    {
      description: "should return correct text keys when isAnyChecked is false",
      isAnyChecked: false,
      expectedConvertText: "form.convert-all",
      expectedDeleteText: "delete-all",
      expectedApplyText: "form.apply-all",
      expectedDownloadZipText: "convert.download-zip-all",
      expectedDownloadFileText: "convert.download-all",
    },
  ])(
    "$description",
    ({
      isAnyChecked,
      expectedConvertText,
      expectedDeleteText,
      expectedApplyText,
      expectedDownloadZipText,
      expectedDownloadFileText,
    }) => {
      const isChecked = ref(isAnyChecked);
      const {
        convertText,
        deleteText,
        applyText,
        downloadZipText,
        downloadFileText,
      } = useI18nTextKey(isChecked);

      expect(convertText.value).toBe(expectedConvertText);
      expect(deleteText.value).toBe(expectedDeleteText);
      expect(applyText.value).toBe(expectedApplyText);
      expect(downloadZipText.value).toBe(expectedDownloadZipText);
      expect(downloadFileText.value).toBe(expectedDownloadFileText);
    },
  );
});
