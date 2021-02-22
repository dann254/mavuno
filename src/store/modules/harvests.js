import axios from 'axios';

const state = {
    harvests: null
}

const getters = {
    allHarvests (state) {
        return state.harvests
    }
}

const actions = {
    async fetchHarvests ({ commit }, data) {
        const response = await axios.get(`/farmers/${data.farmerId}/farms/${data.farmId}/harvests/`)
        commit('setHarvests', response.data)
        console.log(response.data)
    },
    async addHarvest ({commit}, data){
        const response = await axios.post(`/farmers/${data.farmerId}/farms/${data.farmId}/harvests/`, data)

        commit('newharvest', response.data.harvest)
    }
    
}

const mutations = {
    setHarvests (state, harvests) {
        state.harvests = harvests
    },
    newHarvest (state, farm) {
        state.harvests.push(harvest)
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}