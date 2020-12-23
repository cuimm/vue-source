import Vue from 'vue';
const vm = new Vue({
  el: '#app',
  data() {
    return {
      message: 'hello cuimm',
      content: 'content',
      info: {
        name: 'cuimm',
        age: 18,
        address: {
          country: '中国',
          province: '山东',
        },
      },
      color: ['red', 'blue', 'yellow', {'black': 'special'}],
      arr: [[1, 2, 3, [4, 5, {a: 'id'}]], 4, 5, 6, {color: 999}],
      firstName: 'Cui',
      lastName: 'MengMeng',
    };
  },
  computed: {
    fullName() {
      return this.firstName + this.lastName;
    },
  },
  watch: {
    message(newValue, oldValue) {
      console.log('meaasge change', newValue, oldValue);
    },
    content: {
      handler(newValue, oldValue) {
        console.log('content change', newValue, oldValue);
      },
      immediate: true,
    },
    info(newValue, oldValue) {
      console.log('1. info change', newValue, oldValue);
    },
    'info.address.country'(newValue, oldValue) {
      console.log('2. info change', newValue, oldValue);
    },
  },
});

// 批量更新（vue的特点是批量更新，防止重复渲染）
setTimeout(() => {
  vm.message = 'this is sync1';
  vm.message = 'this is sync2';
  vm.message = 'this is sync3';
  vm.message = 'this is sync4'; // 就拿这个最后的message的值更新就好了

  vm.info.name = 'cuimm!!!!';

  vm.arr[0][3][2].a = 'aaaaaa'
}, 1000);

window.vm = vm;
console.log('vm:', vm);
// vm.arr[0].push(100)

/*
* Object.freeze：可以禁止定义get和set方法
* */






/*
****************************************************************************
*************************** dom diff ***************************************
****************************************************************************
*/


import {h, render, patch} from './vdom';

// 渲染节点的容器
const container = document.getElementById('app');


/**************** createElement *****************/
/*
// 生成虚拟节点
let oldVnode = h('ul', {id: 'container'},
    h('li', {key: 'a', class: 'a', style: {background: 'red'}}, 'a'),
    h('li', {key: 'b', class: 'b', style: {background: 'yellow'}}, 'b'),
    h('li', {key: 'c', class: 'c', style: {background: 'blue'}}, 'c'),
    h('li', {key: 'd', class: 'd', style: {background: 'pink'}}, 'd'),
);
console.log('oldVnode', oldVnode);

// 将oldVnode渲染成真实节点
render(oldVnode, container);
*/


/**************** patch *****************/

/*
// 比较标签是否一致【标签不一致：直接拿到当前老节点的父级节点替换掉自己】
let oldVnode = h('ul', {id: 'container'},
    h('li', {key: 'a', class: 'a', style: {background: 'red'}}, 'a'),
    h('li', {key: 'b', class: 'b', style: {background: 'yellow'}}, 'b'),
    h('li', {key: 'c', class: 'c', style: {background: 'blue'}}, 'c'),
    h('li', {key: 'd', class: 'd', style: {background: 'pink'}}, 'd'),
);
render(oldVnode, container);

let newVnode = h('div', {id: 'container'},
    h('li', {key: 'a', class: 'a', style: {background: 'red'}}, 'a'),
    h('li', {key: 'b', class: 'b', style: {background: 'yellow'}}, 'b'),
    h('li', {key: 'c', class: 'c', style: {background: 'blue'}}, 'c'),
    h('li', {key: 'd', class: 'd', style: {background: 'pink'}}, 'd'),
);
console.log('newVnode', newVnode);

setTimeout(() => {
  patch(oldVnode, newVnode);
}, 1500);
*/


/**************************** 子节点比较 **************************/
/******************** 1）老节点有孩子 && 新节点没孩子 【】**************************/
/*
// 1）老节点有孩子 && 新节点没孩子
let oldVnode = h('ul', {id: 'container'},
    h('li', {key: 'a', class: 'a', style: {background: 'red'}}, 'a'),
    h('li', {key: 'b', class: 'b', style: {background: 'yellow'}}, 'b'),
    h('li', {key: 'c', class: 'c', style: {background: 'blue'}}, 'c'),
    h('li', {key: 'd', class: 'd', style: {background: 'pink'}}, 'd'),
);
render(oldVnode, container);

let newVnode = h('ul', {id: 'container', class: 'container'});

setTimeout(() => {
  patch(oldVnode, newVnode);
}, 1500);
*/



/******************** 2）老节点没孩子 && 新节点有孩子 【】**************************/
/*
// 2）老节点没孩子 && 新节点有孩子
let oldVnode = h('ul', {id: 'container'});
render(oldVnode, container);

let newVnode = h('ul', {id: 'container', class: 'container'},
    h('li', {key: 'a', class: 'a', style: {background: 'red', color: 'green'}}, 'aaa'),
    h('li', {key: 'b', class: 'b', style: {background: 'yellow'}}, 'b'),
    h('li', {key: 'c', class: 'c', style: {background: 'blue'}}, 'c'),
    h('li', {key: 'd', class: 'd', style: {background: 'pink'}}, 'd'),
    h('li', {key: 'd', class: 'd', style: {background: 'orange'}}, 'e'),
);

setTimeout(() => {
  patch(oldVnode, newVnode);
}, 2000);
*/


/******************** 3）老节点有孩子 && 新节点也有孩子 **************************/

// 3）老节点有孩子 && 新节点也有孩子
let oldVnode = h('ul', {id: 'container'},
    h('li', {key: 'a', class: 'a', style: {background: 'red'}}, 'a'),
    h('li', {key: 'b', class: 'b', style: {background: 'yellow'}}, 'b'),
    h('li', {key: 'c', class: 'c', style: {background: 'blue'}}, 'c'),
    h('li', {key: 'd', class: 'd', style: {background: 'green'}}, 'd'),
);
render(oldVnode, container);

// abcd -> abcdef
// let newVnode = h('ul', {id: 'container', class: 'container'},
//     h('li', {key: 'a', class: 'a', style: {background: 'red', color: '#fff'}}, 'aaa'),
//     h('li', {key: 'b', class: 'b', style: {background: 'yellow'}}, 'b'),
//     h('li', {key: 'c', class: 'c', style: {background: 'blue'}}, 'c'),
//     h('li', {key: 'd', class: 'd', style: {background: 'green'}}, 'd'),
//     h('li', {key: 'e', class: 'e', style: {background: 'pink'}}, 'e'),
//     h('li', {key: 'f', class: 'f', style: {background: 'grey'}}, 'f'),
// );

// abcd -> efabcd
// let newVnode = h('ul', {id: 'container', class: 'container'},
//     h('li', {key: 'e', class: 'e', style: {background: 'pink'}}, 'e'),
//     h('li', {key: 'f', class: 'f', style: {background: 'yellow'}}, 'f'),
//     h('li', {key: 'a', class: 'a', style: {background: 'red'}}, 'a'),
//     h('li', {key: 'b', class: 'b', style: {background: 'yellow'}}, 'b'),
//     h('li', {key: 'c', class: 'c', style: {background: 'blue'}}, 'c'),
//     h('li', {key: 'd', class: 'd', style: {background: 'green'}}, 'd'),
// );

// abcd -> bcda
// let newVnode = h('ul', {id: 'container', class: 'container'},
//     h('li', {key: 'd', class: 'd', style: {background: 'green'}}, 'd'),
//     h('li', {key: 'c', class: 'c', style: {background: 'blue'}}, 'c'),
//     h('li', {key: 'b', class: 'b', style: {background: 'yellow'}}, 'b'),
//     h('li', {key: 'a', class: 'a', style: {background: 'red'}}, 'a'),
// );

// abcd -> bcda
// let newVnode = h('ul', {id: 'container', class: 'container'},
//     h('li', {key: 'd', class: 'd', style: {background: 'green'}}, 'd'),
//     h('li', {key: 'a', class: 'a', style: {background: 'red'}}, 'a'),
//     h('li', {key: 'b', class: 'b', style: {background: 'yellow'}}, 'b'),
//     h('li', {key: 'c', class: 'c', style: {background: 'blue'}}, 'c'),
// );

// abcd -> eafcn
let newVnode = h('ul', {id: 'container', class: 'container'},
    h('li', {key: 'e', class: 'e', style: {background: 'pink'}}, 'e'),
    h('li', {key: 'c', class: 'c', style: {background: 'blue'}}, 'ccc'),
    h('li', {key: 'n', class: 'n', style: {background: 'grey'}}, 'n'),
    h('li', {key: 'a', class: 'a', style: {background: 'red'}}, 'a'),
    h('li', {key: 'f', class: 'f', style: {background: 'yellow'}}, 'f'),
);

setTimeout(() => {
  patch(oldVnode, newVnode);
}, 2000);

