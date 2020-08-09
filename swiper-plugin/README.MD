- 把轮播图做成了插件

[效果展示](https://hjy0810.github.io/demo/swiper-plugin/)

[查看代码](https://github.com/hjy0810/demo/tree/master/swiper-plugin)

### 功能
```
* 自动轮播，焦点跟随
* 点击左右箭头实现左右切换，连续点击时使用flag标识避免显示混乱，当前图片切换到下一张之前点击无效
* 点击底部焦点可以跳转到对应的图片
* 鼠标移入，停止播放，箭头显示；鼠标移出，继续播放，箭头消失
```
### 配置对象
```javascript
// 默认配置对象
defaultOptions = {
      el:document.getElementsByClassName('container')[0], 
      url:'',
      auto:true,
      interval:3000,
      duration:500,
};
el: 轮播图的默认播放位置；可不传，如果想要在一个页面实现多个轮播图，则需要传递这个参数
url:所展示图片的地址，必传
auto:默认自动播放，除非传false
interval:默认播放时间间隔为3000ms
duration:默认动画时间为500ms
```
### 使用
```html
<head>
   <!-- 头部其他标签 -->
  <link rel="stylesheet" href="./css/reset.css">
  <link rel="stylesheet" href="./css/index.css">
</head>
<body>
<!--第一个轮播图-->
<div class="container">
  <!--轮播区域-->
  <ul class="banner">
    <!--轮播区域-->
  </ul>

  <!--左右箭头-->
  <div class="btn">
    <span class="left-btn"> < </span>
    <span class="right-btn"> > </span>
  </div>

  <!--底部焦点-->
  <ul class="dot">
    <!--<li class="current"></li>-->
    <!--<li></li>-->
    <!--<li></li>-->
    <!--<li></li>-->
  </ul>
</div>

<script src="./js/utils.js"></script>
<!--<script src="./js/index.js"></script>-->
<!--<script src="./js/index_promise.js"></script>-->
<script src="./js/index_ES6.js"></script>
<script>
  let containerBox = document.getElementsByClassName('container')[0];
  // new Swiper({
  //   url:'./data.json',  //请求数据每一项里的 src 代表当前图片地址
  //   el:containerBox,
  //   auto:true,          //是否自动播放
  //   interval:3000,      //轮播时间间隔
  //   duration:500,       //切换动画时间
  // })

  new Swiper({
    url:'./data.json',
  })
</script>
</body>
```

### 尝试
* 尝试了 ES5构造函数 和 ES6-class 语法两种形式写原生插件
* 使用 promise 语法控制插件内部各方法的执行
* 使用 事件委托 处理左右箭头和底部焦点的点击事件

### 总结
* 虽然配置的API接口变量并不多，只是作为JS面向对象编程方式的一次尝试
* 要注意 this 指向，保证this指向Swiper的实例！
* 事件绑定中，如果this需要指向当前绑定的元素(如增删样式类名)，可以self托管this



