/**
 * Changes the value of the Open Graph Protocol (OGP) meta tag.
 *
 * @param property - The property attribute of the meta tag.
 * @param content - The new content value for the meta tag.
 */
export const createOrChangeOgpValue = (property: string, content: string) => {
  const meta = document.querySelector(`meta[property="${property}"]`);
  meta
    ? meta.setAttribute("content", content)
    : createOgpTag(property, content);
};

/**
 * Changes the value of the Open Graph Protocol (OGP) meta tags.
 *
 * @param values - An array of objects containing the property and content values.
 */
export const createOrChangeOgpValues = (
  values: { property: string; content: string }[],
) => {
  for (const { property, content } of values) {
    createOrChangeOgpValue(property, content);
  }
};

/**
 * Creates a new Open Graph Protocol (OGP) meta tag with the specified property and content values.
 *
 * @param property - The property attribute of the meta tag.
 * @param content - The content attribute of the meta tag.
 */
const createOgpTag = (property: string, content: string) => {
  const meta = document.createElement("meta");
  meta.setAttribute("property", property);
  meta.setAttribute("content", content);
  document.head.append(meta);
};
