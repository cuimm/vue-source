import {query} from './utils/dom'
import {initState} from './observe'
import Watcher from './observe/watcher'
import Compiler from './compiler'

function Vue(options) {
  this._init(options);
}

Vue.prototype._init = function (options) {
  const vm = this;
  vm.$options = options;
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
    vm._update();
  };

  new Watcher(vm, updateComponent);
};

Vue.prototype._update = function () {
  console.log('刷新页面.............');
  new Compiler(this.$el, this);
};

export default Vue;
