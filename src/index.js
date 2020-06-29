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
      arr: [[1,2,3], 4, 5, 6, {color: 999}],
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
