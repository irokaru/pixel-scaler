/**
 * GitHubからタグ情報を得る
 * @returns {Promise<{name: string, zipball_url: string, tarball_url: string}[]>}
 */
export const fetchTags = async () => {
  try {
    const response = await fetch('https://api.github.com/repos/irokaru/pixel-scaler/tags');
    if (!response.ok) throw new Error();
    return await response.json();
  } catch {
    return [];
  }
};
