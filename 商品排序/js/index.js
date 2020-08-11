//获取元素
let containerBox = document.getElementById('container'),
    navLists = containerBox.getElementsByTagName('a'),    //头部导航，点击排序
    ulBox = document.getElementById('list'),              //商品盒子
    liLists = ulBox.getElementsByTagName('li'),           //商品列表
    data = null;

//初始化
let promise = queryData();
promise.
then(data => bindData(data)).
then(() => handleClick());

//获取数据
function queryData() {
  return new Promise((resolve, reject) => {
    let xhr = new XMLHttpRequest();
    xhr.open('get', './product.json');
    xhr.send(null);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          data = JSON.parse(xhr.responseText);
          resolve(data)
        } else {
          reject('获取数据失败了...')
        }
      }
    }
  })
}

//绑定数据
function bindData(data) {
  // console.log(data);
  let strImg = '';
  data.forEach(item => {
    strImg += `<li time=${item.time} hot=${item.hot} price=${item.price}>
                <img src=${item.src} alt=${item.title}>
                <span>${item.title}</span>
                <span>时间：${item.time}</span>
                <span>热度：${item.hot}</span>
                <span>价格：${item.price}</span>
              </li>`
  });
  ulBox.innerHTML = strImg;
}

// 处理点击事件
function handleClick() {
  // 1. 类数组对象转数组; 2. a标签循环绑定点击事件 3. 添加后续用到的自定义属性 4. 点击时传入当前点击的 a标签
  let navs = Array.prototype.slice.call(navLists);
  for (let i = 0; i < navs.length; i++) {
    let item = navs[i];
    item.index = i;     //把当前a标签的 索引 和 flag 添加到当前a标签的自定义属性上。
    item.flag = -1;

    navs[i].addEventListener('click',sort.bind(item));  //把 当前元素 传递回调函数
    navs[i].addEventListener('click',handleClass.bind(item));
  }
}

/*
* 排序，以传入的索引为排序，index:
* 0:  以时间排序
* 1:  以热度排序
* 2:  以价格排序
* */
function sort(){
  let arr = ['time','hot','price'],
      tag = arr[this.index]; //排序依据，点击的是上架时间，以时间排序

  this.flag = this.flag*(-1);   //this.flag默认为-1，第一次点击变为1，正序
  data.sort((cur,next) => {  //cur当前的item，里面存放了两个自定义属性用于 排序 和 处理样式类名
    if(tag === 'time'){
      // 如果以时间顺序排序，替换为可比较的字符串  '2014-01-01' => '20140101'
      return this.flag*(cur[tag].replace(/-/g,'') - next[tag].replace(/-/g,''));
    }else{
      return this.flag*(cur[tag] - next[tag])
    }
  });
  bindData(data);   //排序后要重新绑定
}

//处理样式类名
//classList   add / remove / replace / toggle
function handleClass() {
  //先循环清除所有，再当前选择添加
  for (let i = 0; i < navLists.length; i++) {
    navLists[i].children[0].classList.remove('bg');
    navLists[i].children[1].classList.remove('bg');
  }

  if(this.flag === 1){
    this.children[0].classList.add('bg')
  }else{
    this.children[1].classList.add('bg')
  }
}

