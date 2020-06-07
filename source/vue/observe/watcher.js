import {pushTarget, popTarget} from './dep'

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

    this.deps = [];
    this.depsId = new Set(); // 保存当前watcher的dep

    this.get();
  }
  get() {
    pushTarget(this); // 渲染watcher dep.target = watcher
    this.getter && this.getter();
    popTarget();
  }
  update() {
    console.log('update');
    this.get();
  }
  /* 同一个watcher不应该重复记录dep => 相互记忆 */
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.deps.push(id);
      this.depsId.add(id); // 让watcher记住当前的dep
      dep.addSub(this); // 让dep记录当前的watcher
    }
  }
}

export default Watcher;

/*
* Vue2.0 => 一个组件对应一个watcher
*
* 1、默认会创建一个渲染watcher，这个渲染watcher默认会执行
* 2、pushTarget(this) => Dep.target = watcher
*   this.getter() => 调用当前的get方法，给当前实例的属性上增加一个dep => dep.addSub(watcher) => dep.subs = [watcher]
*   popTarget
* 3、当前用户修改了属性的花边后，会调用set方法
*   dep.notify() => dep.subs.forEach(watcher=>watcher.update())
* */
