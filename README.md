# **Bombbox**

## 簡介

```
手機站的一款彈框插件
```

## 日誌
```
v 0.0.1
  初次封裝

```

## 結構引用
下面結構僅供參考（主要是選擇器的引用）
``` html
<a href="javascript:void(0);" class="btn_2" wj-bomb-open="1">立即领取</a>

<div class="bomb_box styleBox" wj-bomb="1">
  <div class="box_in">
    <div class="boxStyle"><a href="javascript:void(0);" class="btn_2" wj-bomb-open="2">立即领取1</a></div>
    <a href="javascript:void(0);" class="box_close_btn" wj-bomb-close="1">&times;</a>
  </div>
</div>
```


通過 `wj-bomb-open` 和 `wj-bomb-close` 相綁定

+ 選擇器 = "指定關鍵詞"
   如：`wj-bomb-open="a"` 打開的是 `wj-bomb="a"` 彈框
       `wj-bomb-close="a"` 關閉的是 `wj-bomb="a"` 彈框


-------

## 接口引用
``` javascript
  var bombbox = new Bombbox({
    // 參數...
    
  });
```

-------


## 文檔
### `selector`
``` 參數
指定對應選擇器

```
``` javascript
selector: 'wj-bomb'      // wj-bomb-open, wj-bomb-close, wj-bomb-back, wj-bomb
```

### `currentClass`
``` 參數
彈框應添加刪除的class類

```





-------




