
[效果展示](https://hjy0810.github.io/demo/%E5%95%86%E5%93%81%E6%8E%92%E5%BA%8F/)

[查看代码](https://github.com/hjy0810/demo/tree/master/%E5%95%86%E5%93%81%E6%8E%92%E5%BA%8F)

### 功能
```
* 实现对商品列表的排序
* 点击上架时间、热度、 价格的a链接，商品会按照期望的顺序升序排序，再次点击降序
* 可以根据当前所点击a链接旁边的三角样式，判断是升序还是降序，向上升序，向下降序
```

### 总结
* 使用promise控制函数的执行
* 使用自定义属性来代替变量，然后通过bind，可以让数据通过DOM元素在不同函数中传递
    - 给a链接添加两个自定义属性index和flag，点击a链接时，把当前元素传给 sort 和 handleClass 函数
    - sort函数中需要根据index来判断当前是时间、热度还是价格来排序，需要flag实现升降序
    - handleClass函数需要 flag 来判断列表升降序，从而当前点击元素的样式
* el.classList API:  在元素中添加、移除、替换及切换 CSS 类
    - add
    - remove
    - replace
    - toggle
