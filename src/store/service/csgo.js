import ajax from '@/utils'
export default {
  /**
   * 导商品信息
   * @param {Object} options
   * @returns
   */
  postStore (options) {
    return ajax.post('/csgo/store', options)
  },
  /**
   * 值得买
   * @param {Object} options
   * @returns
   */
  getBuy (options) {
    return ajax.get('/csgo/canBuy', options)
  },
  /**
   * 值得卖
   * @param {Object} options
   * @returns
   */
  getSell (options) {
    return ajax.get('/csgo/canSell', options)
  },
  /**
   * igxe导csgo商品
   * @param {Object} options
   * @returns
   */
  postIgxeStore (options) {
    return ajax.post('/igxe/csgo/store', options)
  },
  /**
   * igxe值得买
   * @param {Object} options
   * @returns
   */
  getIgxeBuy (options) {
    return ajax.get('/igxe/csgo/canBuy', options)
  },
  /**
   * igxe和buff求购的差价
   * @param {Object} options
   * @returns
   */
  getIgxeUse (options) {
    return ajax.get('/igxe/csgo/canUse', options)
  }
}
