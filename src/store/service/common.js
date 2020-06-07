import ajax from '@/utils'
export default {
  /**
   * 获取steam求购价
   * @param {Object} options
   * @returns
   */
  postSteamPrice (options) {
    return ajax.post('/steam/getPrice', options)
  },
  /**
   * 录入刀的均价
   * @param {Object} options
   * @returns
   */
  csgoGetAavKnife () {
    return ajax.post('/csgo/storeAavKnife')
  }
}
