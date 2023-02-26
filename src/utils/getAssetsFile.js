// 获取assets静态资源
export const getAssetsFile = (url) => {
  // console.log(new URL(`../assets/images/emoji/${url}`, import.meta.url))
  return new URL(`../assets/images/emoji/${url}`, import.meta.url).href
}
