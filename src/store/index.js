import Vue from 'vue'
import Vuex from 'vuex'

import auth from './modules/auth'
import farmers from './modules/farmers'
import farms from './modules/farms'
import harvests from './modules/harvests'
import stats from './modules/stats'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    auth,
    farmers,
    farms,
    harvests,
    stats
  }
})
