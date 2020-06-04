import Observer from './observer'
/*
* 初始化data
* */
function initData(vm) {
  let data = vm.$options.data;
  data = vm.$data = typeof data === 'function' ? data.call(vm) : data || {};
  new Observer(data);
}

/*
* 初始化计算属性
* */
function initComputed(vm) {

}

/*
* 初始化watch
* */
function initWatch(vm) {

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
}
