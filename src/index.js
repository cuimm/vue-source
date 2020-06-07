import Vue from 'vue';

const vm = new Vue({
  el: '#app',
  data() {
    return {
      message: 'hello cuimm',
      info: {
        name: 'cuimm',
        age: 18,
        address: {
          country: '中国',
          province: '山东',
        },
      },
      color: ['red', 'blue', 'yellow', {'black': 'special'}],
    };
  },
  computed: {

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
