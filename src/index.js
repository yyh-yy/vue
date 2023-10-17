import { initMixin } from "./init";
import {lifecycleMixin} from './lifecycle'
import { renderMixin} from './vnode/index'
import {initGlobApi} from './global-api/index'
function Vue(options){
   
     //初始化
     this._init(options)
}

  initMixin(Vue)
  lifecycleMixin(Vue) //添加生命周期
  renderMixin(Vue) //添加_render

  //全局方法  Vue.mixin Vue.component Vue.extend
  initGlobApi(Vue)
export default Vue