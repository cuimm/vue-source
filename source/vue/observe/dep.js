let id = 0;

/*
* 用来手机依赖 收集的是一个个的watcher
* */
class Dep {
  constructor() {
    this.id = id++;
    this.subs = [];
  }

  addSub(watcher) {
    this.subs.push(watcher);
  }

  notify() {
    this.subs.forEach(watcher => watcher.update && watcher.update())
  }

  /* 可以实现dep和watcher相互记忆 */
  depend(watcher) {
    if (Dep.target) {
      Dep.target.addDep(this); // Dep.target 是一个渲染watcher
    }
  }
}

// 用来保存当前的watcher
let stack = [];

function pushTarget(watcher) {
  Dep.target = watcher;
  stack.push(watcher);
}

function popTarget() {
  stack.pop();
  stack.target = stack[stack.length - 1];
}

export default Dep;
export {
  pushTarget,
  popTarget,
}
