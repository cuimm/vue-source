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
  observe(data[key]); // 如果属性值依旧是一个对象,需要深度观察 */
  Object.defineProperty(data, key, {
    get() {
      console.log('获取数据', value);
      return value;
    },
    set(newValue) {
      if (value === newValue) return;
      observe(newValue); // 设置的值为新的对象时,需要对这个新的对象进行监控
      value = newValue;
      console.log('设置数据', newValue);
    },
  });
}

export default Observer;
export {
  observe,
  defineReactive,
};
