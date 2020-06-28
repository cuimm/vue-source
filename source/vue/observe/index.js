import {observe} from './observer'

/*
* 初始化data
* */
function initData(vm) {
  let data = vm.$options.data;
  data = vm.$data = typeof data === 'function' ? data.call(vm) : data || {};
  //代理$data
  for (let key in data) {
    proxyData(vm, '$data', key);
  }
  observe(data);
}

/*
* 数据代理
* vm.message = vm.$data.message
* */
function proxyData(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newValue) {
      vm[source][key] = newValue;
    },
  });
}

/*
* 初始化计算属性
* */
function initComputed(vm) {

}

/*
* 初始化watch
* watch内部是通过Watcher实现的
* */
function initWatch(vm) {
  const watch = vm.$options.watch;
  for (let key in watch) {
    let userDef = watch[key];
    if (userDef.handler) {
      userDef = userDef.handler;
    }
    createWatcher(vm, key, userDef, {immediate: userDef.immediate});
  }
}

function createWatcher(vm, expr, handler, options) {
  vm.$watch(expr, handler, {user: true, ...options});
}

/*
* 做不同的初始化工作
* */
export const initState = function (vm) {
  const options = vm.$options;
  if (options.data) {
    initData(vm);
  }
  if (options.computed) {
    initComputed(vm);
  }
  if (options.watch) {
    initWatch(vm);
  }
};
