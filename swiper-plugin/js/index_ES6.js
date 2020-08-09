/* 使用ES6语法中的 Class */
class Swiper{
  constructor(options){
    let defaultOptions = {
      el:document.getElementsByClassName('container')[0],
      url:'',
      auto:true,
      interval:3000,
      duration:500,
    };
    options = {...defaultOptions,...options};

    //把 配置项 绑定到当前元素上
    for (let key in options) {
      this[key] = options[key]
    }

    //把 用到的元素 绑定到 当前元素上
    let _con = this.el;  //轮播图最外层盒子
    this.bannerBox = _con.getElementsByClassName('banner')[0];
    this.btn = _con.getElementsByClassName('btn')[0],
        this.leftBtn = this.btn.getElementsByClassName('left-btn')[0],
        this.rightBtn = this.btn.getElementsByClassName('right-btn')[0],
        this.dotBox = _con.getElementsByClassName('dot')[0],
        this.dotList = this.dotBox.getElementsByTagName('li');

    //把 用到的变量 绑定到 当前元素上
    this.index = 0;
    this.playTimer = null;
    this.total = 0;
    this.width = utils.css(this.bannerBox,'width');  //获取轮播盒子宽度
    this.flag = true;     //控制标示，只有当前图片运动到下一张，点击操作才有效

    //初始化，以执行轮播
    this.init();
  }

  init(){
    let promise = this.queryData();
    promise.
    then(() => {
      this.bindData();      //绑定数据
    }).
    then(() => {
      this.autoPlay();
    }).
    then(() => {
      this.handleEvent();    //处理事件
    })
  }

  //获取图片数据
  queryData() {
    return new Promise((resolve,reject) => {

      let xhr = new XMLHttpRequest()
      xhr.open('get',this.url)
      xhr.send(null)
      // console.log(this);

      xhr.onreadystatechange = () => {
        if(xhr.readyState !== 4 ) return;

        if(xhr.status === 200){
          this.data = JSON.parse(xhr.responseText)
          resolve(this.data)

        } else{
          reject('em,获取数据失败了呀...')
        }
      }
    })
  }

  // 绑定数据到页面
  bindData() {
    this.data.push(this.data[0])
    this.total = this.data.length;
    let strImg = '',  //图片
        strDot = '';  //dot

    //绑定图片html
    this.data.forEach(item => {
      strImg += `<li>
                <img src=${item.src} alt=${item.title}>
             </li>`
    })
    this.bannerBox.innerHTML = strImg;
    utils.css(this.bannerBox,'width',this.width*this.data.length)  //改变bannerBox 宽度

    //绑定dot的html
    for (let i = 0; i < this.total - 1; i++) {
      //保证刷新页面后，第一张图片默认有样式类
      strDot += (i === 0) ? `<li class="current"></li>` : `<li></li>`
    }
    this.dotBox.innerHTML = strDot;
  }

  play(){
    this.index++;
    if(this.index > this.total -1){
      //已经是最后一张，移动到真正第二张的时候，先立马让其回到真正的第一张的位置，接着调用move移动到第二张
      utils.css(this.bannerBox,'left',0)
      this.index = 1;
    }
    if(this.index < 0){
      utils.css(this.bannerBox,'left',-this.width*(this.total - 1))
      this.index = this.total - 2
    }
    utils.move.call(this,this.bannerBox,this.duration,{left:-this.width*this.index})
    //修改move方法中的this为Swiper的实例

    //焦点跟随图片
    this.index ===(this.total - 1) ? this.dotClass(0) : this.dotClass(this.index)
  }

  autoPlay() {
    // console.log(this);
    // 定时器中的回调，如果不指定this，ES5默认指向window，使用bind显式指定为Swiper的实例
    this.playTimer = setInterval(this.play.bind(this),this.interval)
  }

  //处理底部焦点样式类名
  dotClass(index) {
    for (let i = 0; i < this.dotList.length; i++) {
      this.dotList[i].className = ''
    }
    this.dotList[index].className = 'current'
  }

  //处理所有事件
  handleEvent() {

    this.el.onmouseenter = () => {
      this.leftBtn.style.display = this.rightBtn.style.display = 'block'; //鼠标进入，显示左右箭头
      clearInterval(this.playTimer)
    }

    this.el.onmouseleave = () => {
      this.leftBtn.style.display = this.rightBtn.style.display = 'none';  //鼠标进入，隐藏左右箭头
      if(!this.auto) return;    //没有设置自动播放，鼠标移出，退出当前函数
      this.autoPlay()
    }


    //把所有的点击事件，委托给 this.el 元素，并显式指定回调中的this为Swiper的实例
    this.el.addEventListener('click',this.handleClick.bind(this))
  }

  // 处理点击事件（事件委托）
  handleClick(e) {
    let target = e.target,    //事件源
        tagName = target.tagName  //事件源的标签名

    //左右箭头
    if(tagName === 'SPAN' && target.className.includes('left-btn')){
      if(!this.flag) return;
      this.index-=2;
      this.play()
    }
    if(tagName === 'SPAN' && target.className.includes('right-btn')){
      if(!this.flag) return;
      this.play()
    }

    //底部焦点
    if(tagName === 'LI' && target.parentNode.className.includes('dot')){
      this.index = this.queryIndex(target); //获取当前点击焦点的 index
      this.index--;
      this.play();
    }
  }

  //获取当前点击焦点的 index，思路：有几个哥哥节点，index就多少
  queryIndex(ele) {
    let pre = ele.previousElementSibling,
        dotIndex = 0;
    while(pre){
      dotIndex++;
      pre = pre.previousElementSibling
    }
    return dotIndex;
  }
}

/*
* class + promise
* */
