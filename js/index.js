/**
 * create UIgood object and number
 * @param {*} good 
 * @returns 
 */
// function createUIGoods(good){
//     return {
//         data: good,
//         choose: 0
//     }
// }


 /**
  * use prototype to create UIgood object
  * @param {*} g 
  */
// function UIGoods(g){
//     this.data = g;
//     this.choose = 0;
// }

// UIGoods.prototype.getTotalPrice = function(){
//     return this.data.price * this.choose;
// }

// UIGoods.prototype.isChoose = function(){
//     return this.choose>0;
// }

/**
 *  单商品数据
 */
class UIGoods{
    constructor(g){
        this.data = g;
        this.choose = 0
    }
    // 计算总价
    getTotalPrice(){
        return this.data.price * this.choose;
    }
    // 是否被选中该商品
    isChoose(){
        return this.choose>0;
    }
    // 选择数量 +1
    increase(){
        this.choose++; // 若 需要扩展，比如 库存判断的，只影响当前函数
    }
    // 选择数量 -1
    decrease(){
        if (this.choose === 0){
            return ;
        }
        this.choose--;
    }
}
/**
 *  整个界面的数据： 面向对象
 */
class UIData{
    constructor(){
        let uiGoods = [];
        for(let item of goods){
            let uig = new UIGoods(item);
            uiGoods.push(uig)
        }
        this.uiGoods = uiGoods;
        this.deliveryThreshold = 30; // 起送门槛
        this.delivery = 5; // 配送费
    }
    // 获取所有选择的商品总价
    getTotalPrice(){
        return this.uiGoods.reduce((val,cur)=> val+ cur.getTotalPrice(),0);
    }
    // 增加某件商品数量
    increase(index){
        this.uiGoods[index].increase();
    }
    // 减少某件商品数量
    decrease(index){
        this.uiGoods[index].decrease();
    }
    // 当前购物车有几件商品
    getTotalChooseNumber(){
        return this.uiGoods.reduce((val,cur)=>val+cur.choose,0);
    }
    // 当前购物车又没有商品
    hasGoodsInCart(){
        return this.getTotalChooseNumber() > 0;
    }
    //  是否到达起送门槛
    isCrossDeliveryThreshold(){
        return this.getTotalPrice()>this.deliveryThreshold;
    }
    //  该商品是否被选中
    isChoose(index){
        return this.uiGoods[index].isChoose();
    }
}
/**
 * 整个界面
 */
class UI {
    constructor(){
        this.uiData = new UIData(); //获取整个界面的数据
        this.doms = { // 存储 所有需要操作的 dom 元素
            goodsContainer: document.querySelector('#goodList'),
            deliveryPrice: document.querySelector('#deliFee'),
            footerPay: document.querySelector('#payStatus'),
            footerPayInnerSpan: document.querySelector('#payStatus span'),
            totalPrice: document.querySelector('#total'),
            footerCart: document.querySelector('#footerCart'),
            footerBadge: document.querySelector('#footerCart span')
        };
        let cartRect= this.doms.footerCart.getBoundingClientRect();// 初始化就计算购物车位置
        let jumpTarget = {
            x : cartRect.left + cartRect.width/2,
            y : cartRect.top + cartRect.height/5,
        };
        this.jumpTarget = jumpTarget;
        this.createHTML();
        this.updateFooter();
        this.listenEvents();
    }

    // 监听各种事件
    listenEvents(){
        this.doms.footerCart.addEventListener('animationend',function(){ 
            this.classList.remove('animate')
        })
    }
    /**
     *  根据商品列表生成商品列表
     * 1. 生成 html 字符串 （parse html：执行效率低，开发效率高）
     * 2. 一个一个创建 元素 （执行效率高，开发效率低）
     *  使用第一种，优先考虑实现业务后续再考虑优化
     * */ 
    createHTML(){
        let  html = '';
        this.uiData.uiGoods.forEach((item,index)=>{
             html += `
             <div class="goodItem">
                <div class="flex-none p-3">
                    <img src="${item.data.pic}" alt="" srcset="" class="rounded-full size-16">
                </div>
                <div class="flex-auto">
                    <h3 class="text-base font-semibold">${item.data.title}</h3>
                    <div class="truncate max-w-48 text-xs leading-5">${item.data.desc}</div>
                    <div class="flex text-gray-400 text-xs">
                        <span>月销 ${item.data.sellNumber}</span>
                        <span>好评率 ${item.data.favorRate}%</span>
                    </div>
                    <div class="flex justify-between mt-0.5">
                        <h3 class="text-amber-700 font-semibold text-base"><span class="text-xs">¥</span> ${item.data.price}</h3>
                        <div class="goods-btn">
                            <i data-index=${index} class="decreaseBtn">-</i>
                            <span>${item.choose}</span>
                            <i data-index=${index} class="increaseBtn">+</i>
                        </div>
                    </div>
                </div>
            </div>`
        })
        this.doms.goodsContainer.innerHTML = html;
    }
    // 增加第几个商品
    increase(index){
        this.uiData.increase(index); // 修改选中数量
        // 根据增减商品数量 来修改页面
        this.updateGoodsItem(index);
        this.updateFooter();
        this.jump(index); // 添加之后的动画
    }
    // 减少第几个商品
    decrease(index){
        this.uiData.decrease(index);
        this.updateGoodsItem(index);
        this.updateFooter();
    }
    // 更新某个商品的选中与否的显示状态
    updateGoodsItem(index){
        let goodsDom = this.doms.goodsContainer.children[index];
        if(this.uiData.isChoose(index)){
            goodsDom.classList.add('active');
        }else{
            goodsDom.classList.remove('active');
        }
        let priceSpan = goodsDom.querySelector('.goods-btn span');
        priceSpan.textContent = this.uiData.uiGoods[index].choose;
    }
    // 更新页脚
    updateFooter(){
        let total = this.uiData.getTotalPrice();
        // 设置配送费
        this.doms.deliveryPrice.textContent = `配送费¥ ${this.uiData.delivery}`;
        // 设置起送效果
        if(this.uiData.isCrossDeliveryThreshold()){
            this.doms.footerPay.classList.add('goCheck'); // 到达起送标准，可结算
        }else{
            this.doms.footerPay.classList.remove('goCheck'); // 未到起送标准，不可结算
            // 更新还差多少钱起送
            let difference = this.uiData.deliveryThreshold - total;
            difference = Math.round(difference); // JS 小数运算不精确，要取整
            this.doms.footerPayInnerSpan.textContent = `还差¥ ${difference} 元起送`;
        }
        // 设置总价
        this.doms.totalPrice.textContent = `¥ ${total.toFixed(2)}` ;// JS 小数运算不精确，保留2位小数
        // 设置购物车的样式状态
        if(this.uiData.hasGoodsInCart()){
            this.doms.footerCart.classList.add('addToCart');
        }else{
            this.doms.footerCart.classList.remove('addToCart');
        }
        // 设置购物车 商品数量 更新
        this.doms.footerBadge.textContent = this.uiData.getTotalChooseNumber();
    }
    // 购物车动画效果
    cartAnimate(){
        this.doms.footerCart.classList.add('animate');
        // 监听事件放这里也可实现，但是不好，因为每次调用动画函数都要注册事件：监听器，所以挪到最开始的初始化监听
        // this.doms.footerCart.addEventListener('animationend',function(){ 
        //     this.classList.remove('animate')
        // })
    }
    // 抛物线跳跃的元素
    jump(index){
        // 获取跳跃的目标数值 -- 购物车位置
        // let cartRect= this.doms.footerCart.getBoundingClientRect();// 购物车元素的矩形
        // let jumpTarget = {
        //     x : cartRect.left + cartRect.width/2,
        //     y : cartRect.top + cartRect.height/5
        // };
        // 因为购物车的位置是固定的，不会改变，所以把最终跳跃目标位置 放到构造函数初始化，存成属性
        
        // 初始位置 计算
        let btnAdd = this.doms.goodsContainer.children[index].querySelector('.increaseBtn')
        let btnAddRect = btnAdd.getBoundingClientRect();
        let start = {
            x: btnAddRect.left,
            y: btnAddRect.top
        }
        // 创建 添加 按钮
        let div = document.createElement('div');
        div.className = 'add-to-cart';
        let span = document.createElement('span');
        span.innerHTML = '+';
        // 设置 新按钮的初始位置
        div.style.transform = `translateX(${start.x}px)`;
        span.style.transform = `translateY(${start.y}px)`;
        div.appendChild(span);
        document.body.appendChild(div);
        // 后页面才渲染，因为
        /**
         * 此处正在执行 JS，渲染主线程还未开始重新 渲染，
         * 下面重复 修改 transform 不会有动画效果，相当于两次给 transform 赋值，只取最新值，
         * 因此要先强行 浏览器 reflow 再修改 transform 的值才会有动画
         */
        div.clientWidth; // 这里只为了浏览器强制渲染 也可使用 requestAnimationFrame 
        // 设置结束位置
        div.style.transform = `translateX(${this.jumpTarget.x}px)`;
        span.style.transform = `translateY(${this.jumpTarget.y}px)`;

        // 添加监听事件，过渡效果完成后
        div.addEventListener('transitionend',()=>{ // 触发两次 ：因为事件冒泡，span 的过渡结束也会冒泡到div导致再次触发事件
            div.remove();
            this.cartAnimate();
        },{
            once: true // 告诉浏览器，该事件只触发一次
        });

    }
}


let ui = new UI();

// 最后添加事件
ui.doms.goodsContainer.addEventListener('click',function(e){
    if(e.target.classList.contains('increaseBtn')){
        let curGoodIndex = +e.target.dataset.index; // 获取当前第几个元素，通过生成列表时，在按钮上添加的自定义属性 data-index 来实现。拿到字符串要转数字

        ui.increase(curGoodIndex); // 调用 UI 对象的 添加方法
    }else if(e.target.classList.contains('decreaseBtn')){
        let curGoodIndex = +e.target.dataset.index; // 同理
        ui.decrease(curGoodIndex);
    }
});  //  此时已完成全部功能和交互


// 程序使用 3 层封装，可维护性高，可扩展性高，比如增加键盘事件的扩展功能
window.addEventListener('keypress',function(e){
    if(e.code === 'Equal'){
        ui.increase(0)
    }else if(e.code === 'Minus'){
        ui.decrease(0)
    }
})