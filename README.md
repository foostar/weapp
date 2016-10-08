
### 事件说明

#### 基本的事件添加
```
    app.event.trigger('login', userinfo) //登录后触发事件
```

#### 基本的监听事件

```
    //获取登录信息
    app.event.on('login', userInfo => {
        //修改登录状态
        this.setData({
            isLogin: true,
            userInfo: userInfo
        })
    })

```