import { test } from "@playwright/test";

import { ConvertOptsList } from "../constants/params";
import { ConvertOpts } from "../types";

type ConversionField = {
  name: string;
  convert: (opts: ConvertOpts) => Promise<void>;
  verify: (opts: ConvertOpts) => Promise<void>;
};

export const testConversion = async (field: ConversionField) => {
  for (const opts of ConvertOptsList) {
    await test.step(`convert ${field.name} with: scale=${opts.scaleSizePercent}%, pixel=${opts.originalPixelSize}, mode=${opts.scaleMode}`, async () =>
      await field.convert(opts));

    await test.step(`verify converted ${field.name} conversion result`, async () =>
      await field.verify(opts));
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
