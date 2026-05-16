import type { CompilerOptions } from "vue/compiler-sfc";

type NodeTransform = NonNullable<CompilerOptions["nodeTransforms"]>[number];

/**
 * Removes `data-testid` attributes from a given node's properties.
 * This function filters out both static (`data-testid`) and dynamic (`:data-testid`) attributes
 * from the `props` array of the provided node, if applicable.
 *
 * @param node - The node to process. This is a Vue compiler template node transform.
 *               If the node's type is not 1, the function will return without making changes.
 */
export const removeDataTestAttrs: NodeTransform = (node) => {
  if (node.type !== 1) return;

  node.props = node.props.filter((prop) => {
    if (prop.type === 6) return prop.name !== "data-testid";
    if (prop.type === 7) return prop.rawName !== ":data-testid";
    return true;
  });
};
