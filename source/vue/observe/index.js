import {observe} from './observer'
import Watcher from './watcher';
import Dep from './dep';

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
  const computed = vm.$options.computed;
  let watchers = vm.$computedWatchers = Object.create(null); // 用来记录计算属性watcher

  for (let key in computed) {
    const userDef = computed[key];

    // 实例话计算属性watcher。lazy参数表示这是一个计算属性watcher。计算属性watcher默认刚开始不会执行userDef。
    watchers[key] = new Watcher(vm, userDef, () => {}, {lazy: true});

    // 将计算属性挂载到vm上
    Object.defineProperty(vm, key, {
      get: createComputedGetter(vm, key),
    });
  }
}

function createComputedGetter(vm, key) {
  const watcher = vm.$computedWatchers[key];

  return () => {
    if (watcher) {
      if (watcher.dirty) { // 如果dirty是false，页面不需要重新计算属性值中的方法
        watcher.evaluate(); // 如果页面取值，并且dirty是true的话，就会调用watcher中的get方法重新计算。
      }
      // fullName dep = [firstNameDep, lastNameDep]  如果要刷新页面，需要再加入渲染watcher。
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value;
    }
  };
}

/*
* 初始化watch
* watch内部是通过Watcher实现的
* */
function initWatch(vm) {
  const watch = vm.$options.watch;
  for (let key in watch) {
    let userDef = watch[key];
    let handler = userDef;
    if (userDef.handler) {
      handler = userDef.handler;
    }
    createWatcher(vm, key, handler, {immediate: userDef.immediate});
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
