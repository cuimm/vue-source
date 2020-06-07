import Dep from './dep'
import {observeArray, arrayMethods} from './array'

class Observer {
  constructor(data) {
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

function observe(data) {
  // 非对象不执行后续逻辑
  if (data === null || typeof data !== 'object') {
    return;
  }
  return new Observer(data);
}

/*
* 定义响应式数据变化
* */
function defineReactive(data, key, value) {
  /* 如果属性值依旧是一个对象,需要深度观察 */
  observe(data[key]);

  /*
  * dep 用来收集依赖，收集的watcher（相同的属性用的是相同的dep）
  * 一个属性里可以放多个watcher：一个渲染watcher、一个$watch方法
  * watcher：比如渲染watcher，页面上绑定多个属性，那么这个watcher就对应多个dep
  * */
  let dep = new Dep();

  Object.defineProperty(data, key, {
    get() {
      /* 只要对当前的属性进行了取值操作，就会将当前的watcher存入进去 */
      console.log('获取数据', value);
      if (Dep.target) { // 页面最初渲染的时候是用的渲染watcher
        // dep.addSub(Dep.target); // 存入的watcher会重复，如果重复会造成数据更新时页面多次渲染
        dep.depend(); // 该方法可以让dep中存入watcher，同样watcher中也可以存入dep，实现多对多的关系
      }
      return value;
    },
    set(newValue) {
      if (value === newValue) return;
      observe(newValue); // 设置的值为新的对象时,需要对这个新的对象进行监控
      value = newValue;
      dep.notify();
      console.log('设置数据', newValue);
    },
  });
}

export default Observer;
export {
  observe,
  defineReactive,
};
