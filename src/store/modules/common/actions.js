import service from '../../service/common.js'
export default {
  PostSteamPrice ({ commit }, options) {
    return service.postSteamPrice(options)
  },
  CsgoGetAavKnife ({ commit }) {
    return service.csgoGetAavKnife()
  },
  CsgoBuyAavKnife ({ commit }) {
    return service.CsgoBuyAavKnife()
  }
}
