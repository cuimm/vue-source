const defaultRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

class CompilerUtils {
  /*
  * 编译文本节点
  * node: 文本节点 {{info.address.country}}
  * vm: vue 实例
  * */
  static compileText(node, vm) {
    if (!node.exp) {
      node.exp = node.textContent;
    }
    node.textContent = node.exp.replace(defaultRE, (...args) => {
      return CompilerUtils.getValue(vm, args[1]);
    });
  }
  static getValue(vm, exp) {
    let keys = exp.split('.');
    return keys.reduce((memo, current) => {
      return memo[current];
    }, vm);
  }
}

export default CompilerUtils;
