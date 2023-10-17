//
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{}}
function genProps(attrs) {
    //处理属性
    let str = ''
    for (let i = 0; i < attrs.length; i++) {
        let attr = attrs[i]
        //注意;   style："color:red;font-size: 20px
        if (attr.name === 'style') {
            let obj = {} //对样式进行特殊处理
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':')
                obj[key] = value
            })
            attr.value = obj //
        }
        //拼接  
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    return `{${str.slice(0, -1)}}`  
}

function genChildren(el){
    const children = el.children
    if(children){ 
        return  children.map(child=>gen(child)).join(',') //{}
    }
}
function gen(node){ 
   if(node.type===1){
            //递归
           return generate(node) 
   }else{
       let text = node.text
        if (!defaultTagRE.test(text)) {
            return `_v(${JSON.stringify(text)})`  // _v(html)  _v('hello'+_s(name))
        }
       //处理特殊的文本
        let tokens = [] //存放每一段的代码  _v('hello',+_s(msg))
        //通过一个正则的案例来演示  在浏览器中 let reg = /a/g   reg.test('ab') reg.lastIndex = 0
      
        let lastIndex = defaultTagRE.lastIndex = 0;//如果正则是全局模式 需要每次使用前变为0
        let match;// 
       
       while (match = defaultTagRE.exec(text)) {
           let index = match.index;
            if (index > lastIndex) {
               tokens.push(JSON.stringify(text.slice(lastIndex,index))) 
            //    console.log(tokens)
            }
            //添加插值表达式 {{}}
            tokens.push(`_s(${match[1].trim()})`)
             lastIndex = index+match[0].length 
        }
       //判断还有没有 文本 hello {{msg}}  
        if(lastIndex<text.length){
           tokens.push(JSON.stringify(text.slice(lastIndex))) 
        }
        //最终返回出去

        return `_v(${tokens.join("+")})`
   }

    
}
//语法层面的转移  处理开始的元素
export function generate(el) {
    // console.log(el)
    let children = genChildren(el)
    //方法 拼接字符串  源码也是这样操作 [{}]    ${el.attrs.length?`{style:{color:red}}`:'undefined'}
    let code = `_c('${el.tag}',${el.attrs.length ? `${genProps(el.attrs)}` : 'undefined'}${
        children ? `,${children}` : ''
        })`
   
    return code
}