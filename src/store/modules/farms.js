import axios from 'axios';

const state = {
    farms: null
}

const getters = {
    allFarms (state) {
        return state.farms
    }
}

const actions = {
    async fetchFarms ({ commit }, farmerId) {
        const response = await axios.get(`/farmers/${farmerId}/farms/`)
        commit('setFarms', response.data)
    },
    async addFarm ({commit}, data){
        const response = await axios.post(`/farmers/${data.farmerId}/farms/`, data)

        commit('newFarm', response.data.farm)
    }
    
}

const mutations = {
    setFarms (state, farms) {
        state.farms = farms
    },
    newFarm (state, farm) {
        state.farms.push(farm)
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}