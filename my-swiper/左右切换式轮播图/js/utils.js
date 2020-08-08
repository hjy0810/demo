let utils = (function () {
  // getCss 获取样式
  function getCss(ele, attr) {
    let value
    if ("getComputedStyle" in window) {
      value = window.getComputedStyle(ele, null)[attr]
    } else {
      if (attr === 'opacity') {
        value = ele.currentStyle['filter']
        let reg = /^alpha\(opacity=(.+)\)$/i
        value = reg.test(value) ? reg.exec(value)[1] / 100 : 1
      } else {
        value = ele.currentStyle[attr]
      }
    }

    // 去单位 "12px" "0.5" px pt rem em display: inline-block
    let reg = /^-?\d+(\.\d+)?(px|pt|rem|em)?$/i
    if (reg.test(value)) {
      value = parseFloat(value)
    }
    return value
  }

  // setCss 设置样式
  function setCss(ele, attr, value) {
    if (attr === 'opacity') {
      ele.style['opacity'] = value
      ele.style['fillter'] = `alpha(opacity=${value * 100})`
      return
    }

    let reg = /^(width|height|((margin|padding)?(left|top|right|bottom)?))$/i

    if (reg.test(attr)) {
      if (!isNaN(value)) {
        value += 'px'
      }
    }

    ele.style[attr] = value
  }

  // 批量设置样式
  function setCssBatch(ele, options) {
    let isObj = Object.prototype.toString.call(options) === '[object Object]'
    if (isObj) {
      for (let attr in options) {
        if (options.hasOwnProperty(attr)) {
          setCss(ele, attr, options[attr])
        }
      }
    }
  }

  // 获取或者设置样式
  function css() {
    let len = arguments.length;
    let fn = getCss
    let isObj = Object.prototype.toString.call(arguments[1]) === '[object Object]'
    if (len >=3) {
      fn = setCss
    } else if(len === 2 && isObj) {
      fn = setCssBatch
    }
    return fn.apply(this, arguments)
  }

  // 定时器动画
  function move(el,duration,propObj) {
    let time = 0,  // 动画在整个duration中所处的时间
        startPosition = utils.css(el,'left'),   //函数进入时el的起始位置
        endPosition = Object.values(propObj)[0],//el的最终位置
        space = endPosition - startPosition,    //终点 - 起点，负值
        curSpace = 0,      //当前元素与起点位置的距离
        nextPosition = 0;

    clearInterval(el.moveTimer)
    el.moveTimer = setInterval(() => {  //动画定时器
      flag = false;

      time+= 17;
      if(time >= duration){
        //一旦达到duration，清除定时器、设置节流flag为true，并退出函数
        flag = true;
        utils.css(el,'left',endPosition)
        return clearInterval(el.moveTimer)
      }
      curSpace = (space/duration)*time;   //当前与起点的位置差
      nextPosition = startPosition + curSpace;
      utils.css(el,'left',nextPosition)
    },17)
  }
  
  return {
    css,
    move
  }
})();
