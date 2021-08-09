// 递归遍历树结构，返回form的数据
export function getTreeItem(data, ext, form) {
  return data.map((item) => {
    if (item.ext === ext) {
      return Object.assign(item, form)
    }
    if (item.children) {
      // eslint-disable-next-line
      item.children = getTreeItem(item.children, ext, form)
    }
    return item
  })
}
// 寻找是否有指定的ext
export function getTreeId(tree, ext) {
  return tree.every((item) => {
    if (item.ext === ext) {
      return true
    }
    if (item.children && item.children.length) {
      getTreeId(tree.children, ext)
    }
    return false
  })
}
// 获取第一个最终节点
export function getFirstChild(data) {
  for (const item of data) {
    if (!item.children || !item.children.length) {
      return item
    }
    return getFirstChild(item.children)
  }
}
