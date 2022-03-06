/**
 * /posts/articles/2021/github-actions-create-diary => posts/articles/2021/github-actions-create-diary.md
 * @param resolvedUrl
 * @returns href のリンク設定などで使う
 */
export function contentPath(resolvedUrl: string): string {
  // スラッシュがついていたら除去する
  const relative = resolvedUrl.replace(/^\/|\/$/g, '');

  // 拡張子がついていたら除去する
  const relativeFilePath = relative.replace(/\.[^/.]+$/, '');
  return `${relativeFilePath}.md`;
}

/**
 * posts/articles/2021/github-actions-create-diary.md => /posts/articles/2021/github-actions-create-diary
 * @param contentPath
 * @returns href のリンク設定などで使う
 */
export function contentUrl(contentPath: string): string {
  // スラッシュがついていたら除去する
  const relative = contentPath.replace(/^\/|\/$/g, '');

  // 拡張子がついていたら除去する
  const relativeFilePath = relative.replace(/\.[^/.]+$/, '');
  return `/${relativeFilePath}`;
}