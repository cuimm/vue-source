import {observeArray, arrayMethods} from './array'

/*
* 定义响应式数据变化
* */
function defineReactive(data, key, value) {
  // 如果属性值依旧是一个对象,需要深度观察
  new Observer(data[key]);
  Object.defineProperty(data, key, {
    get() {
      console.log('获取数据', value);
      return value;
    },
    set(newValue) {
      // 设置的值为新的对象时,需要对这个新的对象进行监控
      new Observer(newValue);
      value = newValue;
      console.log('设置数据', newValue);
    },
  });
}

class Observer {
  constructor(data) {
    this.observe(data);
  }
  observe(data) {
    // 非对象不执行后续逻辑
    if (data === null || typeof data !== 'object') {
      return;
    }
    if (Array.isArray(data)) {
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
  defineReactive
};
