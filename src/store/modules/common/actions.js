import service from '../../service/common.js'
export default {
  PostSteamPrice ({ commit }, options) {
    return service.postSteamPrice(options)
  }
}
