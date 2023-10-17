export function patch(oldVnode, vnode) {
    // console.log(oldVnode, vnode);
    //vnode =》真实 dom
    //（1） 创建新DOM
    let el = createEl(vnode)
    // console.log(el)
    //(2)替换  1）获取父节点  2）插入  3）删除
    let parentEL = oldVnode.parentNode // body
    parentEL.insertBefore(el,oldVnode.nextsibling)
    parentEL.removeChild(oldVnode)
    return el
}

//创建dom
function createEl(vnode) { //vnode: {tag,text,data,children}
    let { tag, children, key, data, text } = vnode
    if (typeof tag === 'string') { //标签
        vnode.el = document.createElement(tag) //创建元素 div
        //children []
        if (children.length > 0) { // [{}]
            children.forEach(child => {
                //递归
                vnode.el.appendChild(createEl(child))
            })
        }
    }else{
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}
//vue面试题
// vue的渲染流程 =》数据初始化=》对模块进行编译 =》变成render函数 =》通过render函数编程 vnode =>vnode
// =》变成真实dom =>放到页面