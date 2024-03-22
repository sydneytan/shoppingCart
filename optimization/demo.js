// 购物车功能，可能存在的问题：
/**
 * 问题一 ： 属性可修改，或者有 被篡改 的风险
 *   解决 ： 使用属性描述符
 */
let goodsOP = {
    pic : '',
    title : '',
    desc : '',
    price : 20,
    sellNumber : 18,
    favorRate : 90
}

// class UIGoodsOP {
//     constructor(g){
//         this.data = g;
//         this.choose = 0;
//     }
// }
// let uiGoodsop = new UIGoodsOP(goodsOP);
// console.log(uiGoodsop.data); // goods object
// uiGoodsop.data = 'abcd';  // 合法操作，理论上原始数据不能做任何改动，但是这里改动了，所以要做 防篡改限制
// console.log(uiGoodsop.data);  // abcd 

// class uiGoodsop {
//     constructor(g){
//         Object.defineProperty(this,'data',{
//             value: g,
//             writable: false,
//             configurable: false
//         });
//     }
// }

// let uiGoodsop = new uiGoodsop(goodsOP);
// console.log(uiGoods.data); // goods object
// uiGoodsop.data = 'abcd';  // data 属性已经不能更改了，所以这里赋值无效
// console.log(uiGoodsop.data);  // goods object 


// 继续优化，当别人在使用 这个代码想赋值 data 而不起作用时，最好提醒使用者，这个数据不可修改
class UIGoodsOP {
    get totalPrice (){ // ES6 语法糖写法，但是 data 和 choose不行
        return this.choose * this.data.price;
    };
    get isChoose (){
        return this.choose>0;
    }
    constructor(g){
        // Object.freeze(g);// 直接使用会把原始数据也冻结，导致其他地方也无法修改原始数据 --> 使用对象克隆
        g = {...g};
        Object.freeze(g);
        Object.defineProperty(this,'data',{
            get: function(){
                return g;
            },
            set: function(val){
                throw new Error(`data 属性是只读的，不能重新赋值`);
            },
            configurable: false
        });
        // this.choose = 0; // 同理 choose 有可能：被修改，不是数字，不是整数；通过increase() decrease()来修改，优化如下
        let internalChooseValue = 0;
        Object.defineProperty(this,'choose',{
            configurable : false,
            get : function(){
                return internalChooseValue;
            },
            set : function(val){
                if(typeof val !== 'number'){
                    throw new Error('choose 属性必须是数字');
                }
                let temp = ~~val;
                if(temp !== val){
                    throw new Error('choose 属性必须是整数')
                }
                if(val < 0){
                    throw new Error('choose 属性必须大于等于0');
                }
                internalChooseValue = val;
            }
        });
        // Object.definePropertry(this,'totalPrice',{ // 使用 ES6 的语法糖，将这个属性提取出去
        //     get: function(){
        //         return this.price * this.data.price;
        //     },
        // })
        // Object.freeze(this);  // 这会导致普通属性不能改，比如 this.aaa = 1 ;aaa 将不能修改；不过get/set属性不受影响--> 使用seal
        Object.seal(this); // 密封，不能加属性，但可修改属性
    }
   
}
Object.freeze(UIGoodsOP.prototype); // 冻结 UIGoodsOP 原型
let uiGoodsop = new UIGoodsOP(goodsOP);
console.log(uiGoodsop.data.price); // goods object
// uiGoodsop.data = 'abcd';  // 报错：data 属性是只读的，不能重新赋值
// uiGoodsop.choose = 'ds';  // 报错
// uiGoodsop.choose = 3; 
// console.log(uiGoodsop.totalPrice); // 60 (3 * 20)
// console.log(uiGoodsop.isChoose); // true

/**
 *  永远不要相信使用你代码的人，总会有各种意外，比如
 */
uiGoodsop.data.price = 100;  // data作为属性不能改，但是 data的属性可以改，因为goodsOP只是普通对象--> 使用 freeze()来防止篡改原始数据
uiGoodsop.abc = '66666';   // 可以往对象里加属性 --> 构造函数完成后，把自己也冻结
UIGoodsOP.prototype.haha = '9999'; // 还可以往原型上加属性，这时候要把原型也冻结 --> 94 行
