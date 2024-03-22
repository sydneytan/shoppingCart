let obj = {}

// Object.defineProperty(obj,'a',{
//     value : 11,
//     writable : false
// });

// Object.defineProperty(obj,'a',{  // get & set 整体叫访问器
//     get: function(){ console.log('Hello world!'); return 123}, // 读取器 getter
//     set: function(val){console.log('Haha!');}  // 设置器 setter
// });

// 访问器 设置之后  执行 obj.a --> 执行 get() 函数，而不是直接去内存取
// console.log(obj.a); // 输出 Hello world! 123

// 给属性 a 赋值，相当于执行 set() 函数
// obj.a = 3+2; 
// console.log(obj.a); // 输出： Haha!  123 先执行set(),再执行 get()

/**
 * 是否可以通过 访问器 设置普通属性？
 *  1. 直观的方法 ，如下
 */
// Object.defineProperty(obj,'a',{  
//     get: function(){  return obj.a}, 
//     set: function(val){ obj.a = val;}  
// });
// 会报错，因为无限递归，自己调用自己

/**
 * 2. 设置中间器
 */
// let internalValue = undefined;
// Object.defineProperty(obj,'a',{  
//     get: function(){ 
//         return internalValue;
//     }, // 读取器 getter
//     set: function(val){
//         internalValue = val;
//     }  // 设置器 setter
// });

// 以此来 完美实现可读属性 功能
Object.defineProperty(obj,'a',{  
    get: function(){ 
        return 123;
    }, // 读取器 getter
    set: function(val){
        throw Error(`Bro!This abttrubite can't be change!Think about it!`)
    }  // 设置器 setter
});

console.log(obj.a); // 输出 123
obj.a = '999'; // Error： Bro!This abttrubite can't be change!Think about it!