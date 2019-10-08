import ajax from '@/utils'
export default {
  /**
   * 导商品信息
   * @param {Object} options
   * @returns
   */
  postStore (options) {
    return ajax.post('/dota/store', options)
  },
  /**
   * 值得买
   * @param {Object} options
   * @returns
   */
  getBuy (options) {
    return ajax.get('/dota/canBuy', options)
  },
  /**
   * 值得卖
   * @param {Object} options
   * @returns
   */
  getSell (options) {
    return ajax.get('/dota/canSell', options)
  },
  /**
   * igxe导csgo商品
   * @param {Object} options
   * @returns
   */
  postIgxeStore (options) {
    return ajax.post('/igxe/dota/store', options)
  },
  /**
   * igxe值得买
   * @param {Object} options
   * @returns
   */
  getIgxeBuy (options) {
    return ajax.get('/igxe/dota/canBuy', options)
  }
}
