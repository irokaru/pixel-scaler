import { ImageCheckList } from "@/@types/convert";
import useImageEntryStore from "@/stores/imageEntryStore";

const useImageConvert = () => {
  const store = useImageEntryStore();

  const convertAnyChecked = async (checkedMap: ImageCheckList) => {
    await store.convertAnyChecked(checkedMap);
  };

  const convertOneByUuid = async (uuid: string): Promise<void> => {
    await store.convertOneByUuid(uuid);
  };

  const convertOne = store.convertOne;

  return {
    convertAnyChecked,
    convertOneByUuid,
    convertOne,
  };
};

export default useImageConvert;
