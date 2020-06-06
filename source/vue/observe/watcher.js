/*
* 每个Watcher实例都对应一个唯一的标识
* */
let id = 0;

/*
* Watcher
* vm: 当前组件Vue实例
* expOrFn: 监控表达式。传入的可能是一个表达式，也可能是一个函数
* cb: 回调函数。vm.$watch('message', cb)
* options: 一些其他参数
* */
class Watcher {
  constructor(vm, expOrFn, cb, options) {
    this.vm = vm;
    this.expOrFn = expOrFn;
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn;
    }
    this.cb = cb;
    this.options = options;
    this.id = id++;

    this.get();
  }
  get() {
    this.getter();
  }
}

export default Watcher;
