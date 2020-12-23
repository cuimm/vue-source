import Dep from './dep'
import {observeArray, arrayMethods, dependArray} from './array'

/*
* 定义响应式数据变化
* */
function defineReactive(data, key, value) {
  /* 如果属性值依旧是一个对象,需要深度观察 */
  const childOb = observe(data[key]);

  /*
  * dep 用来收集依赖，收集的是watcher（相同的属性用的是相同的dep）
  * 一个属性里可以放多个watcher：一个渲染watcher、一个$watch方法
  * watcher：比如渲染watcher，页面上绑定多个属性，那么这个watcher就对应多个dep
  * */
  let dep = new Dep();

  Object.defineProperty(data, key, {
    //** 收集依赖
    get() {
      /* 只要对当前的属性进行了取值操作，就会将当前的watcher存入进去 */
      // console.log('获取数据=', value);
      if (Dep.target) { // 页面最初渲染的时候是用的渲染watcher
        // dep.addSub(Dep.target); // 存入的watcher会重复，如果重复会造成数据更新时页面多次渲染 => dep.depend()
        dep.depend(); // 依赖收集：该方法可以让dep中存入watcher，同样watcher中也可以存入dep，实现多对多的关系
        if (childOb && Array.isArray(value)) {
          childOb.dep.depend(); // 针对数组的依赖收集：数组也收集当前渲染watcher
          dependArray(value); // 递归收集数组依赖 多纬数组[[[[...]]]]
        }
      }
      return value;
    },
    //** 通知依赖更新
    set(newValue) {
      // console.log('设置数据=', newValue);
      if (value === newValue) return;
      observe(newValue); // 设置的值为新的对象时,需要对这个新的对象进行监控
      value = newValue;
      dep.notify();
    },
  });
}

function observe(data) {
  // 非对象不执行后续逻辑
  if (data === null || typeof data !== 'object') {
    return;
  }
  if (data.__ob__) { // 此时说明已经被监控过了
    return data.__ob__;
  }
  return new Observer(data);
}

class Observer {
  constructor(data) {
    this.dep = new Dep(); // 此dep专门为数组而设

    // 每个引用类型（对象，包括数组），都有一个__ob__属性，返回的是当前Observer实例（主要用于数组的依赖收集）
    Object.defineProperty(data, '__ob__', {
      get: () => this,
    });

    if (Array.isArray(data)) {
      // 修改数组原型链,重写数组变异方法
      data.__proto__ = arrayMethods;
      observeArray(data);
    } else {
      this.walk(data);
    }
  }
  walk(data) {
    Object.keys(data).forEach(key => {
      defineReactive(data, key, data[key]);
    });
  }
}

export default Observer;
export {
  observe,
  defineReactive,
};
