import { mergeOptions } from "../utils/index.js";

export function initGlobApi(Vue) {
    // 源码 
    // Vue.options = {created:[a,b,c]}
    Vue.options = {}
    Vue.Mixin = function (mixin) { // {} {}
        // 对象的合并
        this.options = mergeOptions(this.options, mixin)
        console.log(Vue.options,999)
 
    }
}