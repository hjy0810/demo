let containerBox = document.getElementsByClassName('container')[0],
    bannerBox = containerBox.getElementsByClassName('banner')[0],
    btn = containerBox.getElementsByClassName('btn')[0],
    leftBtn = btn.getElementsByClassName('left-btn')[0],
    rightBtn = btn.getElementsByClassName('right-btn')[0],
    dotBox = containerBox.getElementsByClassName('dot')[0],
    dotList = dotBox.getElementsByTagName('li');

//全局变量
let index = 0,  //当前图片索引
    playTimer = null, //自动轮播定时器
    total = 0,        //末尾插入第一张图片后的图片总数
    width = utils.css(bannerBox,'width'), //获取bannerBox宽度
    flag = true;  //节流标示，只有当前图片运动到下一张，点击操作才有效

function getData() {
  let data = null;
  let xhr = new XMLHttpRequest()
  xhr.open('get','./data.json')
  xhr.send(null)
  xhr.onreadystatechange = function () {
    if(xhr.readyState === 4 && xhr.status === 200){
      data = JSON.parse(xhr.responseText)
      // console.log(data)

      bindData(data)
      autoPlay()
      handleEvent()
    }
  }
}
getData()

function bindData(data) {
  data.push(data[0])
  total = data.length;
  let str1 = '',  //图片
      str2 = '';  //dot

  //绑定图片html
  data.forEach(item => {
    str1 += `<li>
                <img src=${item.src} alt=${item.title}>
             </li>`
  })
  bannerBox.innerHTML = str1;
  utils.css(bannerBox,'width',width*data.length)  //改变bannerBox 宽度

  //绑定dot的html
  for (let i = 0; i < total - 1; i++) {
    //保证刷新页面后，第一张图片默认有样式类
    str2 += (i === 0) ? `<li class="current"></li>` : `<li></li>`
  }
  dotBox.innerHTML = str2;
}

function play(){
  index++;
  if(index > total -1){
    //已经是最后一张，移动到真正第二张的时候，先立马让其回到真正的第一张的位置，接着调用move移动到第二张
    utils.css(bannerBox,'left',0)
    index = 1;
  }
  if(index < 0){
    utils.css(bannerBox,'left',-width*(total - 1))
    index = total - 2
  }
  utils.move(bannerBox,500,{left:-width*index})

  //焦点跟随图片
  index ===(total - 1) ? dotClass(0) : dotClass(index)
}

function autoPlay() {
  playTimer = setInterval(play,2000)
}

function handleEvent() {
  containerBox.onmouseenter = function(){
    clearInterval(playTimer)
  }

  containerBox.onmouseleave = function(){ //鼠标移出，直接让autoPlay执行即可轮播
    autoPlay()
  }

  leftBtn.onclick = function () {
    if(!flag) return;
    index-=2;
    play()
  }

  rightBtn.onclick = function () {
    if(!flag) return;
    play()
  }

  //循环绑定dot的onmouseover事件
  for (let i = 0; i < dotList.length; i++) {
    dotList[i].onclick = function () {
      if(!flag) return;
      //两件事:1.运动到当前图片,2.给当前图片加current类名
      index = i-1;
      play();
      this.className = 'current'
    }
  }
}

//处理dot样式类名
function dotClass(index) {
  for (let i = 0; i < dotList.length; i++) {
    dotList[i].className = ''
  }
  dotList[index].className = 'current'

}

/*
总结
1. 函数的逻辑应尽可能简单，如果可以，只做一件事！
2. 使用transition，从最后添加的第一张运动到第二张会有显示问题，自己写一个 move封装动画过程
3. onmouseenter和onmouseleave阻止冒泡，如果绑定的事件的在bannerBox的边缘，使用这两个事件，不会触发bannerBox，解决：绑定到父元素
4. 快速点击左右运动按钮，显示混乱，使用 flag 优化，让本次运动结束前的点击无效

* */
