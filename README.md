微信小程序
---

`npm i`

`src`目录为小程序源码目录，使用微信开发者工具打开当前目录，即可正常调试。

`src/lib/*`该目录下为外部类库脚本，不可修改。

----
### 全局事件

事件对象添加在 app 下 - `app.event`

#### 派发事件

`event.trigger('event-name', data, ...)`

#### 监听事件

`event.on('event-name', (data) => console.log(data))`

#### 已有事件列表

##### launch

`launch`

程序启动成功事件

##### login

`login (userInfo)`

用户登录成功事件 

示例:

```
app.event.on('login', userInfo => {
    // 修改登录状态
    this.setData({
        isLogin: true,
        userInfo: userInfo
    })
})

```

----

### 全局方法

##### getModule

`getModule(id)`

获取指定ID的module，如果不指定ID，则获取当前module数据

##### getUserInfo

`getUserInfo(cb)`

获取当前用户信息。

-----