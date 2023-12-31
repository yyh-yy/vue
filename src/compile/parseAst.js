//<div id="app"> hello {{msg}} <h></h></div>
//ast语法树 {}    vnode {}

/**
 * {
 * tag:'div',
 * attrs:[{id:"app"}],
 * children:[{tag:null,text:hello},{tag:'div'}]
 * }
 * 
 * 
 * 
 * 
 */
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;   // 标签名称
const qnameCapture = `((?:${ncname}\\:)?${ncname})`; //<span:xx>
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
//<div id="app"></div>
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g // {{}}
// 遍历
//创建ast语法树
//<div id="app"> hello {{msg}} <h> </h></div>
function createASTElement(tag,attrs){
    return{
         tag, //div
         attrs,
         children:[], // 子节点
         type:1,
         parent:null
    }
}
 let root; //根元素
 let createParent //当前元素的父亲
 //数据结构 栈  
 let stack = []    // [div,h]
function start(tag, attrs) { //开始标签
    let element = createASTElement(tag,attrs)
    if(!root){
        root = element
    }
    createParent = element
    stack.push(element)
}
function charts(text) { //获取文本
    // console.log(text, '文本')
    //空格
    text = text.replace(/a/g,'')
    if(text){
        createParent.children.push({
             type:3,
             text
        })
    }
}
function end(tag) { //结束的标签
  let element = stack.pop()
  createParent = stack[stack.length-1] //[div]
  if(createParent){  //元素闭合
        element.parent = createParent.tag
        createParent.children.push( element)
  }

}
export function parseHTML(html) {
    //<div id="app"> hello {{msg}} <h></h></div>  //  开始标签  文本  结束标签
    while (html) { // html  为空结束
        //判断标签 <>
        let textEnd = html.indexOf('<') // 0
        if (textEnd === 0) { //标签
            //（1） 开始标签
            const startTagMatch = parseStartTag() // 开始标签的内容 {}
            if(startTagMatch){
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue;
            }
             //结束标签 
            //  console.log(500)
            let endTagMatch = html.match(endTag)
            if( endTagMatch){
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue;
            }
             
        }
        //文本
        let text
        if (textEnd > 0) {
            // console.log(textEnd)
            //获取文本内容
            text = html.substring(0, textEnd)
            // console.log(text)
        }
        if (text) {
            advance(text.length)
            charts(text)  
        }
        // break 
    }
    function parseStartTag() {
        //
        const start = html.match(startTagOpen) // 1结果  2false
        // console.log(start)
        if(start){
             //创建ast 语法树
        let match = {
            tagName: start[1],
            attrs: []
        }
        //删除 开始标签
        advance(start[0].length)
        //属性
        //注意  多个 遍历
        //注意 >
        let attr
        let end
        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
            // console.log(attr) //
            match.attrs.push({ name: attr[1], value: attr[3] || attr[4] || attr[5] })
            advance(attr[0].length)

        }
        if (end) {
            // console.log(end)
            advance(end[0].length)
            return match
        }

        }
       
    }
    function advance(n) {
        html = html.substring(n)
        // console.log(html)
    }
    //   console.log(root)
    return root
}