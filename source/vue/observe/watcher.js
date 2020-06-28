import {pushTarget, popTarget} from './dep'

/*
* 每个Watcher实例都对应一个唯一的标识
* */
let id = 0;

/*
* Watcher
* watcher 有三种：渲染watcher、计算属性watcher、用户watcher($watch)
* ------------------------------------------------------------
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
    // this.get(); // 如果立即调用get，就会导致页面立即刷新 => 异步来更新
    queueWatcher(this);
  }
  run() {
    this.get();
  }
  /* 同一个watcher不应该重复记录dep，相同的依赖只需要记录一次 => 相互记忆 */
  addDep(dep) {
    let id = dep.id;
    if (!this.depsId.has(id)) {
      this.deps.push(id);
      this.depsId.add(id); // 让watcher记住当前的dep
      dep.addSub(this); // 让dep记录当前的watcher
    }
  }
}

let has = [];
let queue = [];
function flushQueue() {
  queue.forEach(watcher => { watcher.run(); });

  // 恢复正常，下一轮更新时继续使用
  has = {};
  queue = [];
}

function queueWatcher(watcher) {
  const id = watcher.id;
  if (!has[id]) {
    has[id] = true;
    queue.push(watcher); // 相同的watcher只会存一个到队列中

    // 延迟清空队列（异步方法会等待所有同步方法执行完毕后调用此方法）
    // $nextTick(flushQueue); // setTimeout(flushQueue, 0)
    setTimeout(() => {
      console.log('setTimeout');
      flushQueue()
    }, 0)
  }
}

/*
* nextTick 内部实现
* 异步方法会等待所有同步方法执行完毕后调用此方法
* */
let callbacks = [];
function flushCallbacks() {
  callbacks.forEach(cb => cb());
}
/* 内部用队列实现 */
function $nextTick(cb) {
  // 异步是分顺序执行的, 会先执行：（微任务：promise mutationObserver），再执行：（宏任务：setImmediate setTimeout）
  callbacks.push(cb);

  if (Promise) {
    return Promise.resolve().then(flushCallbacks); // then 方法是异步的
  }
  if (MutationObserver) { // MutationObserver是H5的一个异步api
    let _observe = new MutationObserver(flushCallbacks);
    let textNode = document.createTextNode(1);
    _observe.observe(textNode, {characterData: true}); // 监控文本变化
    textNode.textContent = 2;
    return;
  }
  if (setImmediate) {
    return setImmediate(flushCallbacks, 0);
  }
  setTimeout(flushCallbacks, 0);
}
export default Watcher;


/*
* Vue2.0 => 一个组件对应一个watcher（组件级更新）
*
* 1、默认会创建一个渲染watcher，这个渲染watcher默认会执行
* 2、pushTarget(this) => Dep.target = watcher
*   this.getter() => 调用当前的get方法，给当前实例的属性上增加一个dep => dep.addSub(watcher) => dep.subs = [watcher]
*   popTarget
* 3、当前用户修改了属性的花边后，会调用set方法
*   dep.notify() => dep.subs.forEach(watcher=>watcher.update())
* */
