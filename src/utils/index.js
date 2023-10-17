//对象合并  {created:[]}
 export  const HOOKS = [
    "beforeCreate",
    "created",
    "beforeMount",
    "mounted",
    "beforeUpdate",
    "updated",
    "beforeDestory",
    "destroyed"
]
// 策略模式
let starts = {}
starts.data = function(parentVal,childVal){
   return childVal
} //合并data
starts.computed = function(){} //合并computed
starts.watch = function(){} //合并watch 
starts.methods = function(){} //合并methods 
//遍历生命周期
HOOKS.forEach(hooks=>{
    starts[hooks] = mergeHook
})
function mergeHook(parentVal,childVal){
   //{created:[a,b,c],watch:[a,b]}
   if(childVal){
       if(parentVal){
            return  parentVal.concat(childVal)
       }else{
           return [childVal] // [a]
       }
   }else{
       return parentVal 
   }
}
export function mergeOptions(parent, child) { //{}   child:就是mixin中的对象
    console.log(parent, child)
    // Vue.options = {created:[a,b]} //  Vue.mixin({created:f a()})
    const options = {}
    // 如果有父亲 ，没有 儿子
    for (let key in parent) {
        mergeField(key)
    }
    //儿子又父亲没有
    for (let key in child) { //{}
        mergeField(key)
    }
    function mergeField(key){
        //根据key   策略模式
        if(starts[key]){ //created {created:[a]}
             options[key] = starts[key](parent[key],child[key])
        }else{
            options[key] = child[key]
        }
    } 
    return options
}