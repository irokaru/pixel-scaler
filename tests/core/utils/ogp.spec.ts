import {
  createOrChangeOgpValue,
  createOrChangeOgpValues,
} from "@/core/utils/ogp";

describe("createOrChangeOgpValue", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  test("should create a new meta tag if it does not exist", () => {
    createOrChangeOgpValue("og:title", "My Title");
    const meta = document.querySelector('meta[property="og:title"]');
    expect(meta).not.toBeNull();
    expect(meta?.getAttribute("content")).toBe("My Title");
  });

  test("should change the content of an existing meta tag", () => {
    const meta = document.createElement("meta");
    meta.setAttribute("property", "og:title");
    meta.setAttribute("content", "Old Title");
    document.head.append(meta);

    createOrChangeOgpValue("og:title", "New Title");
    expect(meta.getAttribute("content")).toBe("New Title");
  });
});

describe("createOrChangeOgpValues", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
  });

  test("should create new meta tags for each property and content pair", () => {
    createOrChangeOgpValues([
      { property: "og:title", content: "Title 1" },
      { property: "og:description", content: "Description 1" },
      { property: "og:image", content: "Image 1" },
    ]);

    const meta1 = document.querySelector('meta[property="og:title"]');
    const meta2 = document.querySelector('meta[property="og:description"]');
    const meta3 = document.querySelector('meta[property="og:image"]');

    expect(meta1).not.toBeNull();
    expect(meta1?.getAttribute("content")).toBe("Title 1");

    expect(meta2).not.toBeNull();
    expect(meta2?.getAttribute("content")).toBe("Description 1");

    expect(meta3).not.toBeNull();
    expect(meta3?.getAttribute("content")).toBe("Image 1");
  });

  test("should change the content of existing meta tags", () => {
    const meta1 = document.createElement("meta");
    meta1.setAttribute("property", "og:title");
    meta1.setAttribute("content", "Old Title");
    document.head.append(meta1);

    const meta2 = document.createElement("meta");
    meta2.setAttribute("property", "og:description");
    meta2.setAttribute("content", "Old Description");
    document.head.append(meta2);

    createOrChangeOgpValues([
      { property: "og:title", content: "New Title" },
      { property: "og:description", content: "New Description" },
    ]);

    expect(meta1.getAttribute("content")).toBe("New Title");
    expect(meta2.getAttribute("content")).toBe("New Description");
  });
});
