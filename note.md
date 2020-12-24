## Vue的两大核心点MVVM和DOM-diff
- vue中如何实现数据劫持
> 1. 通过方法Object.definePrototype递归给数据的每个属性添加get和set方法
> 2. 调用set给属性赋值的时候，需要在对这个值进行监控，因为这个新值有可能是一个对象



- 数组的劫持
> 1. 数据劫持：对数组内的每一项进行数据劫持（observe）（Object.definePrototype）   
> 2. 方法劫持：对原生数组(push、pop、shift、unshift、sort、reverse、splice)方法进行劫持(重写),
并且对有插入数据的(push、unshift、splice)方法的参数进行数据劫持，这样就可以让数组通过链来调用我们定义的数组方法
> 3. 依赖收集：
    每一个引用类型（对象，包括数据）都会定义一个响应式的__ob__属性，返回的是当前Observer实例，这个实例主要用于数组的依赖收集;
    通过这个__ob__属性，我们可以拿到该对象对应的Observer实例，然后就可以拿到该实例上的dep;
    当我们调用重写的数据方法的时候，就可以通过调用__ob__.dep.notify()通知依赖的更新;
    如果用户取值，如果取得值是数组，可以通过new Observer()返回的Observer实例childOb，调用该实例上的childOb.dep.depend()方法进行数组的依赖收集；
    数组内如果还有数组，需要递归的收集依赖；
> 4. 缺点：不能对数组的索引进行监控、不能通过length方式进行监控

- vue中的观察者模式



- 计算属性和watch的区别 (原理)
> 1. 计算属性和watch内部都是watcher实现的
> 2. 计算属性内部不会立马获取值，只有取值的时候才执行。计算属性有缓存，如果依赖的数据不发生变化，则不会更新结果
> 3. watch默认会在内部先执行，他要算出一个老值来，如果监控的数据变化会执行用户自定义的回调函数。
> 4. 计算一个结果，不会使用methods，methods不具备缓存。



- vue中数据的批量更新
> 1. vue数据是批量更新的
> 2. vue2.0实现了组件级更新



- nextTick原理
> 1. 内部是使用队列实现的
> 2. 异步是分顺序执行的, 会先执行：（微任务：promise mutationObserver），再执行：（宏任务：setImmediate setTimeout）

```
const callbacks = []
function flushCallbacks() {
    callbacks.forEach(cb => cb());
}

function $nextTick(callback) {
    callbacks.push(callback);
    if (Promise) {
        return Promise.resolve().then(flushCallbacks);
    }
    if (MutationObserver) {
        const _observer = new MutationObserver(flushCallbacks);
        const textNode = document.createTextNode(1);
        _observer.observe(textNode, {characterData: true}); 
        textNode.textContent = 2;
        return;
    }
    if (setImmediate) {
        return setImmediate(flushCallbacks);
    }
    setTimeout(flushCallbacks, 0);
}

```



- 什么是虚拟dom及虚拟dom的作用?   
虚拟dom是将真实的DOM数据抽取出来，以对象的形式模拟树形结构。例如：
```html
<div><p>123</p></div>
```
对应的虚拟dom（伪代码）：
```js
var vnode = {
  tag: 'div',
  children: [
      {
        tag: 'p',
        text: 123,
      }
  ],
}
```


> https://juejin.cn/post/6844903607913938951
- vue中的diff实现?   
1. 当数据发生变化时，vue是则呢么更新节点的？
> 真实DOM的开销是很大的，比如有时候我们修改了某个数据，如果直接渲染到真实dom上会引起整个dom树的重绘和重排。   
> vue提供了diff算法，先根据真实DOM生成一颗virtual DOM，当virtual DOM某个节点的数据改变后会生成一个新的Vnode，然后Vnode和oldVnode作对比，发现有不一样的地方就直接修改在真实的DOM上，然后使oldVnode的值为Vnode。   
> diff的过程就是调用名为patch的函数，比较新旧节点，一边比较一边给真实的DOM打补丁。
  
2. diff算法
vue提供了几个方法：
    h: 生成vnode、
    createElement: 将vnode转化为真实dom插入到el中、
    patch: 比对新旧vnode一边比较一边给真实dom打补丁。
    sameVnode: 判断两节点是否值得比较（key值是否相同、标签名是否相同、是否是注释节点、是否都定义了data、当标签是input时type必须相同）   

> 比对是否值得比较 => 不值得比较：用新的vnode替换oldVnode  值得比对：复用当前节点vue的diff算法是同级比较


> 新节点: vnode  老节点: oldVnode  vue的diff算法是同级比较
* 比对是否值得比较（sameVnode）
  * 不值得比较
    * 用新的vnode替换oldVnode
  * 值得比较
    * 找到对应的真实dom，称为el，复用当前标签（const el=vnode.el=oldVnode.el）
    * 判断Vnode和oldVnode是否指向同一个对象，如果是，那么直接return
    * 如果他们都有文本节点并且不相等，那么将el的文本节点设置为Vnode的文本节点。
    * 做属性的比对, 给当前节点打补丁
    * 比对子节点
      * 老节点有孩子 && 新节点没孩子
        * 删除el的子节点
      * 老节点没孩子 && 新节点有孩子
        * 将新节点的子节点真是化之后添加到el上
      * 老节点有孩子 && 新节点也有孩子
        * updateChildren函数比较子节点

* updateChildren双指针比对
  * 老头和新头比对
    * 是相同节点
      * 新头和老头指针后移 比对老头和新头节点
  * 老尾和新尾比对
    * 是相同节点
      * 老尾和新尾指针前移动 比对老尾和新尾节点
  * 老头和新尾比对
    * 是相同节点
      * 老头指针后移 新尾指针前移 将老得头节点插入到老的尾节点的下一个兄弟节点之前 比对老头和新尾节点
  * 老尾和新头比对
    * 是相同节点
      * 老尾指针前移 新头指针后移 将老的尾节点插入到老的头节点之前 比对老尾和新头节点
  * 前面几种情况都不满足
    * 拿新节点的第一项，使用新节点的key去老节点中匹配（老的节点会维护一个映射表，记录节点key和节点所在位置index）
      * 如果匹配不到
        * 直接将这个节点插入到老节点开头索引的前面
      * 如果能匹配到
        * 则直接移动老节点（到老节点当前开始索引的前面位置）
      * 新的vnode开始索引向后移动
  * 比对完成之后，有两种情况
    * 新的开始索引 <= 新的结束索引
      * 循环剩余节点，通过判断新的结束索引的下一位是否是null，是null的话插入后面，非null的话插入到前面（insertBefore）
    * 老得开始索引 <= 老得结束索引（老节点中有剩余节点）
      * 直接删除
  
  
  
- vue 数据是批量更新的
- vue2.0实现了组件级更新
