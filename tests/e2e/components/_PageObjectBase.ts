import { Page } from "@playwright/test";

export abstract class PageObjectBase {
  constructor(protected readonly page: Page) {
    this.page = page;
  }
}
