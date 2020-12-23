import {vnode} from "@src/vdom/create-element";

/**
 * 创建vnode
 * @param tag
 * @param props
 * @param children
 * @returns {{tag: *, props: *, key: *, children: *, text: *}}
 */
export default function h(tag, props = {}, ...children) {
  const key = props.key;
  key && delete props.key;

  children = children.map(child => {
    if (typeof child === 'object') {
      return child;
    } else {
      return vnode(undefined, undefined, undefined, undefined, child);
    }
  });

  return vnode(tag, props, key, children, undefined);
}
