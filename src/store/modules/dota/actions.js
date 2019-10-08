import service from '../../service/dota.js'
export default {
  DotaStore ({ commit }, options) {
    return service.postStore(options)
  },
  DotaCanBuy ({ commit }, options) {
    return service.getBuy(options)
  },
  DotaCanSell ({ commit }, options) {
    return service.getSell(options)
  },
  IgxeDotaStore ({ commit }, options) {
    return service.postIgxeStore(options)
  },
  IgxeDotaCanBuy ({ commit }, options) {
    return service.getIgxeBuy(options)
  }
}
