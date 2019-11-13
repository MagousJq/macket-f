import ajax from '@/utils'
export default {
  /**
   * 获取steam求购价
   * @param {Object} options
   * @returns
   */
  postSteamPrice (options) {
    return ajax.post('/steam/getPrice', options)
  }
}
