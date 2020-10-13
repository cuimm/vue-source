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
      arr: [[1, 2, 3], 4, 5, 6, {color: 999}],
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

/*
* 批量更新
*
* vue的特点是批量更新，防止重复渲染
* */
setTimeout(() => {
  vm.message = 'this is sync1';
  vm.message = 'this is sync2';
  vm.message = 'this is sync3';
  vm.message = 'this is sync4'; // 就拿这个最后的message的值更新就好了

  vm.info.name = 'cuimm!!!!';
}, 1000);

window.vm = vm;
console.log('vm:', vm);
// vm.arr[0].push(100)


/*
* Object.freeze：可以禁止定义get和set方法
* */

/********** dom diff ************/
console.log('**********dom diff************');
/********** dom diff ************/

import h, {patch, render, createElm} from './vdom';

let oldVNode = h('ul', {id: 'container'},
    h('li', {class: 'li01', style: {background: 'red'}, key: 'li-1'}, 'li-1'),
    h('li', {class: 'li02', style: {background: 'yellow'}}, 'li-2'),
    h('li', {class: 'li03', style: {background: 'blue'}}, 'li-3'),
);
console.log('oldVNode', oldVNode);

const container = document.getElementById('app');
// render(oldVNode, container);

const newVNode = h('div', {id: 'container'},
    h('li', {class: 'li01', style: {background: 'red'}, key: 'li-1'}, 'li-1'),
    h('li', {class: 'li02', style: {background: 'yellow'}}, 'li-2'),
    h('li', {class: 'li03', style: {background: 'blue'}}, 'li-3'),
);
setTimeout(() => {
  patch(oldVNode, newVNode);
}, 1000);
/*
{
  tag: 'ul',
  children: [
    {
      tag: 'li',
      text: 123,
    }
  ],
}

*/

