/* 构造函数形式 */
function Swiper(options){
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

Swiper.prototype = {
  constructor:Swiper,  //重新指定constructor为自身

  init:function(){
    this.queryData();
  },

  //获取图片数据
  queryData:function queryData() {
    let data = null,
        self = this,  //为了保证onreadystatechange事件中的this是Swiper的实例，使用self替换它
        xhr = new XMLHttpRequest()
    xhr.open('get',this.url)
    xhr.send(null)
    // console.log(this);

    xhr.onreadystatechange = function () {
      if(xhr.readyState === 4 && xhr.status === 200){
        data = JSON.parse(xhr.responseText)

        //成功获取数据之后，执行下面的函数
        self.bindData(data)

        if(self.auto){  // 传入的配置中设置为自动播放，才让 autoPlay 自动执行
          self.autoPlay()
        }

        self.handleEvent()
      }
    }
  },

  //绑定数据到页面
  bindData:function bindData(data) {
    data.push(data[0])
    this.total = data.length;
    let strImg = '',  //图片
        strDot = '';  //dot

    //绑定图片html
    data.forEach(item => {
      strImg += `<li>
                <img src=${item.src} alt=${item.title}>
             </li>`
    })
    this.bannerBox.innerHTML = strImg;
    utils.css(this.bannerBox,'width',this.width*data.length)  //改变bannerBox 宽度

    //绑定dot的html
    for (let i = 0; i < this.total - 1; i++) {
      //保证刷新页面后，第一张图片默认有样式类
      strDot += (i === 0) ? `<li class="current"></li>` : `<li></li>`
    }
    this.dotBox.innerHTML = strDot;
  },

  play:function play(){
    // console.log(this);
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
  },

  autoPlay:function autoPlay() {
    // console.log(this);
    // 定时器中的回调，如果不指定this，ES5默认指向window，使用bind显式指定为Swiper的实例
    this.playTimer = setInterval(this.play.bind(this),this.interval)
  },

  //处理底部焦点样式类名
  dotClass: function dotClass(index) {
    for (let i = 0; i < this.dotList.length; i++) {
      this.dotList[i].className = ''
    }
    this.dotList[index].className = 'current'
  },

  //事件处理
  handleEvent:function handleEvent() {
    let self = this;

    self.el.onmouseenter = function(){
      self.leftBtn.style.display = self.rightBtn.style.display = 'block';
      clearInterval(self.playTimer)
    }

    self.el.onmouseleave = function(){
      self.leftBtn.style.display = self.rightBtn.style.display = 'none';

      if(!self.auto) return; //没有设置自动播放，鼠标移出，退出当前函数
      self.autoPlay()
    }

    self.leftBtn.onclick = function () {
      if(!self.flag) return;
      self.index-=2;
      self.play()
    }

    self.rightBtn.onclick = function () {
      if(!self.flag) return;
      self.play()
    }

    //循环绑定dot的onmouseclick事件
    for (let i = 0; i < self.dotList.length; i++) {
      self.dotList[i].onclick = function () {
        if(!self.flag) return;
        //两件事:1.运动到当前图片,2.给当前图片加current类名
        self.index = i-1;
        self.play();
        this.className = 'current' //这里的this是绑定点击事件的元素
      }
    }
  }
}

/*
* 总结：使用到this，一定要注意当前函数或方法中的this指向，是实例，绑定的元素，还是没有指定！！
* 1. autoPlay中的回调非严格模式下默认指向window，如果需要，可以使用bind显式指定，或者回调函数本身是一个箭头函数，
* 2. 定时器动画方法中使用到了 flag，但是flag已经绑定到了Swiper的实例上，使用显式绑定
* 3. self = this
*
* */


