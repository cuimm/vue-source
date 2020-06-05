import {observe} from './observer'

const originArrayMethods = Array.prototype;
const arrayMethods = Object.create(originArrayMethods);

const methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'sort', 'splice']

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    const result = originArrayMethods[method].apply(this, args);
    let inserted;
    // 只对新增的属性在进行观察
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.slice(2); // 获取splice新增的项目(splice第一个参数index:添加/删除的位置 第二个参数howmany:要删除的数量 后面其他的参数:向数组添加的新项目)
        break;
      default:
        break;
    }
    inserted && observeArray(inserted);
    console.log(`调用数组的-${method}-方法`);
    return result;
  }
});

export function observeArray(data) {
  for (let i = 0; i < data.length; i++) {
    observe(data[i]);
  }
}

export {
  arrayMethods,
}
