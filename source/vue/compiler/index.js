import CompilerUtils from './utils';

const defaultRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

class Compiler {
  constructor(el, vm) {
    this.el = el;
    this.vm = vm;
    if (this.el) {
      // 将节点放入内存文档碎片中
      const fragment = this.node2Fragment(this.el);
      // 编译节点
      this.compile(fragment);
      // 将编译后的文本节点放入el
      el.appendChild(fragment);
    }
  }
  /*
  * 编译
  * */
  compile(fragment) {
    Array.from(fragment.childNodes).forEach(node => {
      if (Compiler.isElementNode(node)) {
        // this.compileElement(node);
        this.compile(node);
      } else if(Compiler.isTextNode(node)) {
        CompilerUtils.compileText(node, this.vm);
      }
    });
  }
  /*
  * 将dom元素放入文档碎片中
  * */
  node2Fragment(node) {
    let fragment = document.createDocumentFragment();
    let firstChild;
    while (firstChild = node.firstChild) {
      fragment.appendChild(firstChild);
    }
    return fragment;
  }
  /*
  * 是否是元素节点
  * nodeType: 元素=1 属性=2 文本=3 注释=8 document=9 documentFragment=11
  * */
  static isElementNode(node) {
    return node.nodeType === 1;
  }
  /*
  * 是否是文本节点
  * nodeType: 元素=1 属性=2 文本=3 注释=8 document=9 documentFragment=11
  * */
  static isTextNode(node) {
    return node.nodeType === 3;
  }
}

export default Compiler;
