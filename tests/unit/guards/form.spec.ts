import { ResultDisplayStyles } from "@/constants/form";
import { isResultDisplayStyle } from "@/guards/form";

describe("isResultDisplayStyle", () => {
  test.each([
    { input: ResultDisplayStyles.Grid, expected: true },
    { input: ResultDisplayStyles.List, expected: true },
    { input: "grid", expected: true },
    { input: "list", expected: true },
    { input: "GRID", expected: false },
    { input: "LIST", expected: false },
    { input: "table", expected: false },
    { input: "", expected: false },
    { input: null, expected: false },
    { input: undefined, expected: false },
    { input: 123, expected: false },
    { input: {}, expected: false },
    { input: [], expected: false },
  ])("returns $expected for input: $input", ({ input, expected }) => {
    expect(isResultDisplayStyle(input)).toBe(expected);
  });
});
