/**
 * 创建vnode
 * @param tag 当前标签名
 * @param props 当前标签上的属性
 * @param key 唯一标示
 * @param children 子节点
 * @param text 文本节点
 * @returns {{tag: *, props: *, key: *, children: *, text: *}}
 */
export function vnode(tag, props, key, children, text) {
  return {
    tag,
    props,
    key,
    children,
    text
  };
}
