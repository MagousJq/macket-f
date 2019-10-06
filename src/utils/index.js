/**
 * 工具类
 */
import axios from 'axios'
import Promise from 'bluebird'
// import qs from 'query-string'

const baseURL = ''
const instance = axios.create({
  baseURL: baseURL,
  timeout: 30000,
  headers: {
    // 'Content-Type': 'multipart/form-data'
    // 'Content-Type': 'application/msexcel'
    'Content-Type': 'application/json'
  }
  // transformRequest: [function (data) {
  //   Object.keys(data).forEach((key) => {
  //     if (typeof data[key] === 'object') {
  //       data[key] = JSON.stringify(data[key])
  //     }
  //   })
  //   return qs.stringify(data)
  // }]
})

export default class Util {
  constructor () {
    throw new Error('工具类禁止实例化！')
  }

  /**
   * 基于axios提供的ajax请求
   * @param url 请求路径
   * @param data 请求参数
   * @param method 请求方式，默认get
   * @return {Promise} Promise
   */
  static ajax (url, data = {}, method = 'GET', cache, header) {
    let options = {
      url: url,
      method: method
    }
    if (method.toUpperCase() === 'POST') {
      options.data = data
    } else {
      if (!cache) {
        data._ = new Date().getTime()
      }
      options.params = data
    }
    if (header) {
      instance.defaults.headers = header
    }
    return new Promise((resolve, reject) => {
      instance(options).then(data => {
        // if (data.status === 200 && data.headers['content-type'] === 'application/msexcel') {
        // 二进制文件
        // resolve(data.data)
        // } else if (data.status === 200 && data.data.code === 0) {
        if (data.status === 200 && data.data.code === 0) {
          // 状态码
          resolve(data.data.data)
        } else if (data.status === 200 && data.data.code === -2) {
          window.location.href = '/'
        } else {
          reject(this.newErr(data.data.msg))
        }
      }).catch(e => {
        let status = e && e.response && e.response.status
        // let statusText = e && e.response && e.response.statusText
        // console.error(`request: ${baseURL}${options.url}; status: ${status}; statusText: ${statusText}`)
        switch (status) {
          case 400:
            reject(this.newErr('无效的请求'))
            break
          case 404:
            reject(this.newErr('请求路径不存在'))
            break
          case 500:
            reject(this.newErr('服务端异常，请稍候重试'))
            break
          default:
            reject(this.newErr(e instanceof Error ? (e.response.data.message ? e.response.data.message : '') : ''))
            break
        }
      })
    })
  }

  static newErr (msg) {
    let error = new Error(msg)
    error.msg = msg
    return error
  }

  /**
   * 基于axios提供的ajax get请求
   * @param url 请求路径
   * @param data 请求参数
   * @return {Promise} Promise
   */
  static get (url, data, header = false, cache = false) {
    return Util.ajax(url, data, 'GET', cache, header)
  }

  /**
   * 基于axios提供的ajax post请求
   * @param url 请求路径
   * @param data 请求参数
   * @return {Promise} Promise
   */
  static post (url, data, header = false, cache = false) {
    return Util.ajax(url, data, 'POST', cache, header)
  }

  static isEmpty (obj) {
    if (obj == null) return true

    if (obj.length > 0) return false
    if (obj.length === 0) return true

    if (typeof obj !== 'object') return true

    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false
    }

    return true
  }

  /**
   * 复制纯纯对象（不包含方法function的对象）
   * @param {*} obj
   */
  static copyPlainObject (obj) {
    if (typeof obj !== 'object') {
      return obj
    }
    return JSON.parse(JSON.stringify(obj))
  }

  /**
   * 时间转换
   * @param {Date} msStr Date格式
   * @return {string} 转换后的字符串
   */
  static formatDate (timeStamp, format) {
    if (!timeStamp) {
      return ''
    }
    format = format || 'yyyy-MM-dd HH:mm:ss'
    let date = new Date(timeStamp)
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()
    let hour = date.getHours()
    let min = date.getMinutes()
    let second = date.getSeconds()
    let meridiem = hour > 11 ? 'PM' : 'AM'
    let joint = function (num) {
      return num < 10 ? ('0' + num) : num
    }

    return format.replace(/[y]{4}/g, year)
      .replace(/[y]{2}/g, (year + '').substring(2))
      .replace(/[M]{2}/g, joint(month))
      .replace(/[M]{1}/g, month)
      .replace(/[d]{2}/g, joint(day))
      .replace(/[d]{1}/g, day)
      .replace(/[H]{2}/g, joint(hour))
      .replace(/[h]{2}/g, joint(hour % 12))
      .replace(/[m]{2}/g, joint(min))
      .replace(/[s]{2}/g, joint(second))
      .replace(/[t]{2}/g, meridiem)
      .replace(/[t]{1}/g, meridiem.substring(0, 1))
  }
}
