import Vue from 'vue';

const vm = new Vue({
  el: 'app',
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

window.vm = vm;
console.log('vm:', vm);
