import axios from 'axios';

const state = {
    stats: null,
}

const getters = {
    stats (state) {
        return state.stats
    }
}

const actions = {
    async fetchStats ({ commit }) {
        const response = await axios.get(`/stats/`)
        commit('setStats', response.data)
        console.log(response.data)
    }
    
}

const mutations = {
    setStats (state, stats) {
        state.stats = stats
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}