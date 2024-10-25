/**
 * Fetches the tags for a given GitHub repository.
 *
 * @param owner - The owner of the repository.
 * @param repo - The name of the repository.
 * @returns A promise that resolves to an array of tags.
 */
export const fetchTags = async (
  owner: string,
  repo: string,
): Promise<Tag[]> => {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/tags`);
  return res.json();
};
