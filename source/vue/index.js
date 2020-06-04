import {initState} from './observe'

function Vue(options) {
  this._init(options)
}

Vue.prototype._init = function (options) {
  this.$options = options;
  initState(this);
}

export default Vue
