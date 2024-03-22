let obj = {
    a : 1,
    b : 2
}
/**
 * 怎么描述 a ？
 * 
 *  值为1
 *  可重写（重新赋值）
 *  可遍历  for in 或 Object.keys
 * 
 *   以上称属性描述
 */

//  得到属性描述符
let desc = Object.getOwnPropertyDescriptor(obj,'a');
console.log(desc); // {configurable:true, enumerable:true, value:1, writable: true, ...}
// configurable : 该属性描述符是否可再配置

// 设置属性描述符
Object.defineProperty(obj,'a',{
    value: 10,
    writable: false, // 不可重写
    enumerable: false, // 不可遍历
});
obj.a = 'abc'; 
console.log(obj.a); // 10; 上一行的赋值已经无效，因为a属性不可重写
Object.defineProperty(obj,'a',{ // 不能修改值，重新设置属性描述符
    writable: true
});
console.log(obj.a); // abc; 若第一个属性描述符中 使用configurable: false ，则第二个属性描述符会报错

// for(let key in obj){
//     console.log(key); // 只输出 b ，因为 a 属性设置了不可遍历
// }

// let keys = Object.keys(obj);
// console.log(keys); // ['b']  与上同理
// console.log(obj); // {b:2}   与上同理
