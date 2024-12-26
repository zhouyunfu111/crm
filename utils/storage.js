import constant from './constant'

// 存储变量名
let storageKey = 'storage_data'

let storageNodeKeys = Object.keys(constant).map(key => constant[key]);

const storage = {
  set: function(key, value) {
    if (storageNodeKeys.indexOf(key) != -1) {
      let tmp = uni.getStorageSync(storageKey)
      tmp = tmp ? tmp : {}
      tmp[key] = value
      uni.setStorageSync(storageKey, tmp)
    }
  },
  get: function(key) {
    let storageData = uni.getStorageSync(storageKey) || {}
    return storageData[key] || ""
  },
  remove: function(key) {
    let storageData = uni.getStorageSync(storageKey) || {}
    delete storageData[key]
    uni.setStorageSync(storageKey, storageData)
  },
  clear: function() {
    uni.removeStorageSync(storageKey)
  }
}

export default storage
