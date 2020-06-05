import {query} from './utils/dom'
import {initState} from './observe'
import Watcher from './observe/watcher'

function Vue(options) {
  this._init(options)
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
  let el = this.$options.el;
  el = vm.$el = query(el);

  const updateComponent = () => {
    console.log('updateComponent');
  };

  new Watcher(vm, updateComponent);
};

export default Vue
