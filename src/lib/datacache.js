/* eslint-disable */

const { isNil } = require('./mobcent.js').fns
const Promise = require('./promise.js')
let requests = {}

function MemoryStore(){
    this.data = {}
}
MemoryStore.prototype.constructor = MemoryStore

MemoryStore.prototype.get = function(id) {
    return Promise.resolve(this.data[ id ])
}

MemoryStore.prototype.set = function(id, data) {
    this.data[ id ] = data
    return Promise.resolve()
}

MemoryStore.prototype.del = function(id) {
    delete this.data[ id ]
    return Promise.resolve()
}


function Cache(id, fetch, {
    expires = 5 * 60 * 1000,
    sync = 0,
    force = false,
} = {}) {
    this.id = id
    this.fetch = oid => {
        const promise = requests[ oid ] = requests[ oid ] || fetch(oid)
        promise.then(() => {
            delete requests[ oid ]
        }, () => {
            delete requests[ oid ]
        })
        return promise
    }
    this.deletedAt = 0
    Object.assign(this, { expires, sync, force })
}

Cache.prototype.constructor = Cache




function DataCache () {
    var store = arguments.length === 1 &&  arguments[0].store !== undefined ? arguments[0]: new MemoryStore()
    this.store = store
    this.caches = {}
}

DataCache.prototype.constructor = DataCache

DataCache.prototype.add = function(id, fetch, options) {
    if (id instanceof Cache) {
        this.caches[ id.id ] = id
    } else {
        if (this.caches[ id ]) return
        if (isNil(fetch)) throw new Error('fetch 参数不能为空')
        this.caches[ id ] = new Cache(id, fetch, options)
    }
}

DataCache.prototype.get = function(id ,{ sync, force } = {}) {
    let self = this
    let store = this.store
    let cache = this.caches[ id ]
    if (!cache) return null
    sync = isNil(sync) ? cache.sync : sync
    force = isNil(force) ? cache.force : force
    let data = null
    let promise
    switch (sync) {
        case -1: // 直接请求
            promise = new Promise((resolve, reject) => {
                return cache.fetch(id)
                .then(data => {
                    this.set(id, data)
                    return resolve(data)
                })
            })
            break;
        case 0: // 取缓存 过期后返回 null
            promise = new Promise(function(resolve, reject) {
                return store.get(id)
                    .then(storeData => {
                        if (storeData && storeData.expired > Date.now()) {
                            data = storeData.raw
                        }
                        if (data) return resolve(data)
                        if (force) {
                            return cache.fetch(id).then(data => {
                                self.set(id, data)
                                return resolve(data)
                            })
                        }
                        return resolve(data)
                    })
            })
            break;
        case 1: // 取缓存 每次更新
            promise = new Promise(function(resolve, reject) {
                return store.get(id)
                    .then(storeData => {
                        if (storeData) {
                            data = storeData.raw
                        } 
                        if (force) {
                            // 强制请求并且没有数据
                            if (!data) {
                                return cache.fetch(id).then(newData => {
                                    self.set(id, newData)
                                    resolve(newData)
                                })
                            } else {
                                cache.fetch(id).then(newData => {
                                    self.set(id, newData)
                                })
                                resolve(data)
                            }
                        } else {
                            cache.fetch(id).then(newData => {
                                self.set(id, newData)
                            })
                            resolve(data)
                            
                        }
                    })
                    
            })


            break;
        case 2: // 取缓存 过期更新
            promise = new Promise(function(resolve, reject){
                return store.get(id)
                    .then(storeData => {
                        if (storeData) {
                            data = storeData.raw
                            if (storeData.expired <= Date.now()) {
                                cache.fetch(id)
                                    .then(newData =>{
                                        self.set(id, newData)
                                    })
                            }
                            resolve(data)
                        } else if (force) {
                            return cache.fetch(id)
                                .then(newData => {
                                    self.set(id, newData)
                                    return resolve(newData)
                                })
                        } else {
                            cache.fetch(id)
                                .then(newData =>{
                                    self.set(id, newData)
                                })
                            resolve(data)
                        }
                    })
            })
            break;
        default:
            promise = new Promise(function(resolve, reject){
                resolve(null)
            })
            break;
    }
    return promise.then(data => {
        return data
    }, () => {
        return null
    })
}

DataCache.prototype.set = function(id, data, { expires } = {}) {
    /* eslint-disable */
    const cache = this.caches[ id ]
    /* eslint-enable */
    const key = cache.deletedAt
    if (data instanceof Promise) {
        try {
            return data.then(newData => {
                data = newData
            })
        } catch (err) {
            // 过期时间延长1分钟
            // const storeData = await this.store.get(id)
            // if (!storeData) return null
            // storeData.expired = storeData.expired + 1000 * 60
            return this.store.del(id)
        }
    }
    expires = isNil(expires) ? cache.expires : expires

    if (cache.deletedAt !== key) {
        return
    }
    return this.store.set(id, {
        expired: Date.now() + expires,
        raw    : data
    })
}

DataCache.prototype.del = function (id) {
    if (this.caches[ id ]) {
        this.caches[ id ].deletedAt = Date.now()
    }
    return this.store.del(id)
}


module.exports = DataCache

