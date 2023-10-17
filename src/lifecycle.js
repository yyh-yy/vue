import {patch} from './vnode/patch'

export function mounetComponent(vm,el){
    //源码
    callHook(vm,"beforeMounted")
    vm._updata(vm._render()) // (1)vm._render 将render 函数变成vnode (2)  vm._updata 将vnode 变成 真实dom 放到页面
    callHook(vm,"mounted")
  }

export function lifecycleMixin(Vue){
  Vue.prototype._updata = function(vnode){ //vnode => 真实的dom
        // console.log(vnode)
        let vm = this
        //两个参数 （1）旧dom (2)vnode
     vm.$el = patch(vm.$el,vnode)
  }
}
// （1）render()函数 =》vnode => 真实的dom


//生命周期调用

export function callHook(vm,hook){
  const handlers = vm.$options[hook]
  if(handlers){
    for( let i=0;i<handlers.length;i++){
      handlers[i].call(this) //改变生命周期中this指向问题
    }
  }
}