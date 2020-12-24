import {query} from './utils/dom'
import {initState} from './observe'
import Watcher from './observe/watcher'
import Compiler from './compiler'
import {h, patch, render} from './vdom'

function Vue(options) {
  this._init(options);
}

Vue.prototype._init = function (options) {
  const vm = this;
  vm.$options = options;
  // 数据劫持：data、computed、watcher处理
  initState(vm);
  // 挂载
  if (vm.$options.el) {
    vm.$mount();
  }
};

Vue.prototype.$mount = function () {
  let vm = this;
  let el = vm.$options.el;
  el = vm.$el = query(el);
  const updateComponent = () => {
    // vm._update();
    vm._update(vm._render()); // 接入vdom
  };

  new Watcher(vm, updateComponent);
};

// 使用DocumentFragment渲染 性能低
// Vue.prototype._update = function () {
//   console.log('刷新页面.............');
//   new Compiler(this.$el, this);
// };

/**
 * 视图渲染
 * @param vnode 要渲染的虚拟节点
 * @private
 */
Vue.prototype._update = function (vnode) {
  const vm = this;
  const el = vm.$el;
  if (!vm.preVnode) {
    vm.preVnode = vnode; // 保留第一个渲染的vnode
    render(vnode, el); // 渲染虚拟节点，将虚拟节点插入到el中
  } else {
    vm.$el = patch(vm.preVnode, vnode); // vue更新 -> 调用patch进行节点的比对
  }
};

Vue.prototype._render = function() {
  const vm = this;
  const render = vm.$options.render; // 用户提供的render函数
  const vnode = render.call(vm, h); // 让用户提供的render方法执行，将render中的this指向当前vue实例，并提供h方法（h方法的功能是生成vnode）
  return vnode;
};

Vue.prototype.$watch = function (expr, callback, options) {
  const vm = this;
  new Watcher(vm, expr, callback, options);
};

export default Vue;
