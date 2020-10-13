/**
 * 渲染vnode为真实节点
 * @param vnode
 * @param container
 */
export function render(vnode, container) {
  const el = createElm(vnode);
  container.appendChild(el);
}

function createElm(vnode) {
  let {tag, props, key, children, text} = vnode;
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    updateProperties(vnode);
    children.forEach(child => render(child, vnode.el))
  } else {
    vnode.el = document.createTextNode(text);  // 文本节点
  }
  return vnode.el;
}

function updateProperties(vnode, oldProps = {}) {
  let newProps = vnode.props || {};
  let el = vnode.el;

  let newStyle = newProps.styles || {};
  let oldStyle = oldProps.style || {};

  for (let key in oldStyle) {
    if (!newProps[key]) {
      el.style[key] = '';
    }
  }
  for (let key in oldProps) {
    if (!newProps[key]) {
      delete el[key];
    }
  }
  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if (key === 'class') {
      el.className = newProps.class;
    } else {
      el[key] = newProps[key];
    }
  }
}

export function patch(oldVNode, newVNode) {
  console.log('patch', oldVNode, newVNode);
  // 1）先比较标签是否一致
  if (oldVNode.tag !== newVNode.tag) {
    // const newNode = createElm(newVNode);
    oldVNode.el.parentNode.replaceChild(newVNode.el);
  }
}
