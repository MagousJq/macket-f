/* eslint-disable no-unused-vars */
import service from '../../service/csgo.js'
export default {
  CsgoStore ({ commit }, options) {
    return service.postStore(options)
  },
  CsgoCanBuy ({ commit }, options) {
    return service.getBuy(options)
  },
  CsgoCanSell ({ commit }, options) {
    return service.getSell(options)
  },
  IgxeCsgoStore ({ commit }, options) {
    return service.postIgxeStore(options)
  },
  IgxeCsgoCanBuy ({ commit }, options) {
    return service.getIgxeBuy(options)
  }
}
