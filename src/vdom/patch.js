/**
 * 将虚拟节点vnode渲染成真实节点
 * @param vnode 虚拟节点
 * @param container 容器
 * @returns {*} 返回渲染出的真实节点
 */
export function render(vnode, container) {
  const el = createElement(vnode);
  container.appendChild(el);
  return el;
}

/**
 * 根据虚拟节点渲染出真实节点
 * @param vnode 例：vnode = {tag: 'ul', props: {id: 'container', style: {background: 'red'}}, children}
 * @returns {*} 返回渲染出来的真实节点
 */
export function createElement(vnode) {
  const {tag, children} = vnode
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag);
    updateProperties(vnode);
    children.forEach(child => {
      return render(child, vnode.el);
    });
  } else {
    vnode.el = document.createTextNode(vnode.text); // 不考虑component，此处默认为文本节点
  }
  return vnode.el;
}

/**
 * 用老节点属性更新新节点
 * @param vnode 例：vnode = {tag: 'ul', el: ul#container, props: {id: 'container', style: {background: 'red'}}, children}
 * @param oldProps 例：oldProps = {class:'panel', style:{background: 'red'}}
 */
function updateProperties(vnode, oldProps = {}) {
  let el = vnode.el; // 真实dom节点
  let newProps = vnode.props || {};

  let newStyle = newProps.style || {};
  let oldStyle = oldProps.style || {}

  for (let key in oldStyle) {
    if (!newStyle[key]) {
      el.style[key] = '';
    }
  }
  for (let key in oldProps) {
    if (!newProps[key]) {
      delete el[key]; // 如果新的中没有这个属性 => 直接删除掉dom上的这个属性
    }
  }
  for (let key in newProps) {
    switch (key) {
      case 'style':
        for (let styleName in newProps[key]) {
          el.style[styleName] = newProps[key][styleName];
        }
        break;
      case 'class':
        el.className = newProps.class;
        break;
      default:
        el[key] = newProps[key];
        break;
    }
  }
}

export function patch(oldVnode, newVnode) {
  // 1) 首先比对标签是否一致【标签不一致 => 拿到当前元素的父级节点, 直接拿当前新节点替换掉老节点】
  if (oldVnode.tag !== newVnode.tag) {
    oldVnode.el.parentNode.replaceChild(createElement(newVnode), oldVnode.el)
  } else if (!oldVnode.tag) {
    // 2）比较文本【标签一致 但可能都是undefined】
    if (oldVnode.text !== newVnode.text) {
      oldVnode.el.textContent = newVnode.text; // 如果内容不一致 直接用当前新元素中的内容替换文本节点
    }
  }

  // 标签一样 但可能属性不一样
  let el = newVnode.el = oldVnode.el; // 标签一样 => 复用即可
  updateProperties(newVnode, oldVnode.props); // 做属性的比对

  // 比较子节点【1、老节点有孩子 && 新节点也有孩子  2、老节点有孩子 && 新节点没孩子  3、老节点没孩子 && 新节点有孩子】
  let oldChildren = oldVnode.children || [];
  let newChildren = newVnode.children || [];

  if (oldChildren.length && newChildren.length) { // 1、老节点有孩子 && 新节点也有孩子 => updateChildren函数比较子节点
    updateChildren(el, oldChildren, newChildren);
  } else if (oldChildren.length) {  // 2、老节点有孩子 && 新节点没孩子 => 删除el的子节点
    el.innerHTML = '';
  } else if (newChildren.length) {  // 3、老节点没孩子 && 新节点有孩子 => 将新节点的子节点真是化之后添加到el上
    for (let i = 0; i < newChildren.length; i++) {
      const child = newChildren[i];
      el.appendChild(createElement(child)); // 将当前新的子节点append到老的节点中即可
    }
  }
}

/**
 * 递归比对子节点
 * vue使用双指针比对方式，并且增加了很多优化策略，因为浏览器中最常见的操作dom的方法：开头插入、结尾插入、正序、倒序
 * @param parent
 * @param oldChildren
 * @param newChildren
 */
function updateChildren(parent, oldChildren, newChildren) {
  let oldStartIndex = 0;
  let oldStartVnode = oldChildren[0];
  let oldEndIndex = oldChildren.length - 1;
  let oldEndVnode = oldChildren[oldEndIndex];

  let newStartIndex = 0;
  let newStartVnode = newChildren[0];
  let newEndIndex = newChildren.length - 1;
  let newEndVnode = newChildren[newEndIndex];

  let oldKeyToIdx = makeIndexByKey(oldChildren);
  // 双指针比对
  while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
    if (!oldStartVnode) {
      oldStartVnode = oldChildren[++oldStartIndex];
    } else if (!oldEndVnode) {
      oldEndVnode = oldChildren[--oldEndIndex];
    } else if (isSameVnode(oldStartVnode, newStartVnode)) { // 头头比对 abcd -> abcdef
      console.log('头头比对');
      patch(oldStartVnode, newStartVnode);
      oldStartVnode = oldChildren[++oldStartIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else if (isSameVnode(oldEndVnode, newEndVnode)) { // 尾尾比对 abcd -> efabcd
      console.log('尾尾比对');
      patch(oldEndVnode, newEndVnode);
      oldEndVnode = oldChildren[--oldEndIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldStartVnode, newEndVnode)) { // 头尾比对 abcd -> dcba
      console.log('头尾比对');
      patch(oldStartVnode, newEndVnode);
      parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling); // 将老得头节点插入到老节点的下一个兄弟节点之前
      oldStartVnode = oldChildren[++oldStartIndex];
      newEndVnode = newChildren[--newEndIndex];
    } else if (isSameVnode(oldEndVnode, newStartVnode)) {  // 尾头比对
      console.log('尾头比对');
      patch(oldEndVnode, newStartVnode);
      parent.insertBefore(oldEndVnode.el, oldStartVnode.el); // 将老的尾节点插入到老的头节点之前
      oldEndVnode = oldChildren[--oldEndIndex];
      newStartVnode = newChildren[++newStartIndex];
    } else { // abcd->ecafn ==> e(abcd)->e(cafn) ==> ec(abd)->ec(afn) ==> eca(bd)->eca(fn) ==> ecaf(bd)->ecaf(n) ==> ecafn(bd)->ecafn ===> 删除老节点中多余的bd节点
      // 先拿新节点的第一项，去老节点中匹配，如果匹配不到直接将这个节点插入到老节点开头的第一项；如果能查到，则直接移动老节点
      // 可能老节点中会有剩余，如有剩余则直接删除掉老节点中的剩余节点
      let moveIndex = oldKeyToIdx[newStartVnode.key];
      if (moveIndex === undefined) {
        // 老节点中没有找到对应的key
        parent.insertBefore(createElement(newStartVnode), oldStartVnode.el);
      } else {
        // 移动元素
        const vnodeToMove = oldChildren[moveIndex];
        oldChildren[moveIndex] = undefined;
        patch(vnodeToMove, newStartVnode);
        parent.insertBefore(vnodeToMove.el, oldStartVnode.el);
      }
      newStartVnode = newChildren[++newStartIndex];
    }
  }

  // abcd -> abcdef || abcd -> efabcd 有可能往前面插入，也可能由后面插入
  if (newStartIndex <= newEndIndex) {
    for (let i = newStartIndex; i <= newEndIndex; i++) {
      // parent.appendChild(createElement(newChildren[i]));
      const referenceNode = newChildren[newEndIndex + 1] === null ? null : newChildren[newEndIndex + 1].el;
      parent.insertBefore(createElement(newChildren[i]), referenceNode)
    }
  }

  // 老节点中有剩余节点 -> 直接删除 abcd -> ecafn -> e(abcd)->e(cafn)
  if (oldStartIndex <= oldEndIndex) {
    for (let i = oldStartIndex; i <= oldEndIndex; i++) {
      let child = oldChildren[i];
      if (child !== undefined) {
        parent.removeChild(child.el);
      }
    }
  }
}

/**
 * 判断两个节点是否值得比较【相同节点才值得比较】
 * Vue中比对：key值 && 标签tag && 是否都是注释节点 && 是否都定义了data && 当前标签都input的时候,type必须相同
 * @param oldVnode
 * @param newVnode
 * @returns {boolean}
 */
function isSameVnode(oldVnode, newVnode) {
  return (oldVnode.key === newVnode.key)  // key值
      && (oldVnode.tag === newVnode.tag)  // 标签名
  // && (oldVnode.isComment === newVnode.isComment)  // 是否为注释节点
  // && (isDef(oldVnode.data) === isDef(newVnode.data))  // // 是否都定义了data，data包含一些具体信息，例如onclick , style
  // && sameInputType(oldVnode, newVnode)   // 当标签是<input>的时候，type必须相同
}

/**
 * 记录节点key的位置
 * @param children {key: index, a:0, b:1, c:2, ...}
 */
function makeIndexByKey(children) {
  let map = {};
  children.forEach((child, index) => {
    map[child.key] = index;
  });
  return map;
}


// var insertedNode = parentNode.insertBefore(newNode, referenceNode);
// insertedNode 被插入节点(newNode)
// parentNode 新插入节点的父节点
// newNode 用于插入的节点
// referenceNode newNode 将要插在这个节点之前
// 如果 referenceNode 为 null 则 newNode 将被插入到子节点的末尾。(insertBefore(newNode, null) = appendChild)


// https://juejin.cn/post/6844903607913938951
// https://github.com/vuejs/vue/blob/dev/src/core/vdom/patch.js
