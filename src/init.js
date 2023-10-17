import { initState } from './initState'
import { compileToFunction } from './compile/index';
import { mounetComponent,callHook } from './lifecycle';
import {mergeOptions} from './utils/index'
export function initMixin(Vue) {
    Vue.prototype._init = function (options) {
        // console.log(options)
        let vm = this
        vm.$options = mergeOptions(Vue.options,options)
        callHook(vm,'beforeCreated')
        //初始化状态
        initState(vm)
        callHook(vm,'created')

        //渲染模板  el 
        if (vm.$options.el) {
            vm.$mount(vm.$options.el)
        }
    }
    //创建 $mount

    Vue.prototype.$mount = function (el) {
        console.log(el)
        // el template  render
        let vm = this
        el = document.querySelector(el) //获取元素
        vm.$el =  el 
        let options = vm.$options
        if (!options.render) { //没有
            let template = options.template
            if (!template && el) {
                //获取html
                el = el.outerHTML
                // console.log(el)

                //<div id="app"> hello {{msg}}</div>
                //变成ast语法树
               let render =  compileToFunction(el)
            //    console.log(render)
                //(1) 将render  函数变成vnode  (2) vnode 变成 真实DOM 放到页面上去
                options.render = render
            }
        }
        //挂载组件
        mounetComponent(vm,el) // vm._updata vm._render
    }

}



