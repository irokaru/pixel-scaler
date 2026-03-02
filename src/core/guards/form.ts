import { ResultDisplayStyles } from "@/constants/form";
import { ResultDisplayStyleType } from "@/types/form";

export const isResultDisplayStyle = (
  value: unknown,
): value is ResultDisplayStyleType => {
  return (
    typeof value === "string" &&
    (value === ResultDisplayStyles.Grid || value === ResultDisplayStyles.List)
  );
};
