import { test } from "@playwright/test";

import { ConvertOptionsList } from "../constants/parameters";
import { ConvertOptions } from "../types";

type ConversionField = {
  name: string;
  convert: (options: ConvertOptions) => Promise<void>;
  verify: (options: ConvertOptions) => Promise<void>;
};

export const testConversion = async (field: ConversionField) => {
  for (const options of ConvertOptionsList) {
    await test.step(`convert ${field.name} with: scale=${options.scaleSizePercent}%, pixel=${options.originalPixelSize}, mode=${options.scaleMode}`, async () =>
      await field.convert(options));

    await test.step(`verify converted ${field.name} conversion result`, async () =>
      await field.verify(options));
  }
};

type ValidationField = {
  name: string;
  valid: number[];
  invalidMin: number[];
  invalidMax: number[];
  min: number;
  max: number;
  set: (value: number) => Promise<void>;
  expect: (value: number) => Promise<void>;
};

export const testInputValidation = async (field: ValidationField) => {
  for (const valid of field.valid) {
    await test.step(`input valid ${field.name} (${valid})`, async () => {
      await field.set(valid);
      await field.expect(valid);
    });
  }

  for (const invalid of field.invalidMin) {
    await test.step(`input invalid (min) ${field.name} (${invalid})`, async () => {
      await field.set(invalid);
      await field.expect(field.min);
    });
  }

  for (const invalid of field.invalidMax) {
    await test.step(`input invalid (max) ${field.name} (${invalid})`, async () => {
      await field.set(invalid);
      await field.expect(field.max);
    });
  }
};
