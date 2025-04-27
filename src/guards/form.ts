import { ResultDisplayStyleType } from "@/@types/form";
import { ResultDisplayStyles } from "@/constants/form";

export const isResultDisplayStyle = (
  value: unknown,
): value is ResultDisplayStyleType => {
  return (
    typeof value === "string" &&
    (value === ResultDisplayStyles.Grid || value === ResultDisplayStyles.List)
  );
};
