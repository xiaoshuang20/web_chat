// 获取assets静态资源
export const getAssetsFile = (url) => {
  // public下的默认图片
  if (url.includes('img')) {
    return url
  }
  if (url.includes('avatar/')) {
    return new URL(`../assets/images/${url}`, import.meta.url).href
  }
  return new URL(`../assets/images/emoji/${url}`, import.meta.url).href
}
