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
- vue中数据的批量更新
- nextTick原理
- 什么是虚拟dom及虚拟dom的作用
- vue中的diff实现


- vue 数据是批量更新的
- vue2.0实现了组件级更新
