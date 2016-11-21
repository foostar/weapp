const WeappStore = function () {
}

WeappStore.prototype.constructor = WeappStore

WeappStore.prototype.get = function (id) {
    return new Promise((resolve) => {
        wx.getStorage({
            key: id,
            success: (data) => {
                resolve(data.data)
            },
            fail: () => {
                resolve(null)
            }
        })
    })
}

WeappStore.prototype.set = function (id, data) {
    return new Promise((resolve, reject) => {
        wx.setStorage({
            key: id,
            data,
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

WeappStore.prototype.del = function (id) {
    return new Promise((resolve, reject) => {
        wx.removeStorage({
            key: id,
            success: (data) => {
                resolve(data)
            },
            fail: (err) => {
                reject(err)
            }
        })
    })
}

module.exports = WeappStore

