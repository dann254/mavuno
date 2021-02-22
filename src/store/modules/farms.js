import axios from 'axios';

const state = {
    farms: null,
    farmer: null,
}

const getters = {
    allFarms (state) {
        return state.farms
    },
    farmer (state) {
        return state.farmer
    }
}

const actions = {
    async fetchFarms ({ commit }, farmerId) {
        const response = await axios.get(`/farmers/${farmerId}/farms/`)
        commit('setFarms', response.data)
    },
    async fetchFarmer ({ commit }, farmerId) {
        const response = await axios.get(`/farmers/${farmerId}/`)
        commit('setFarmer', response.data)
    },
    async addFarm ({commit}, data){
        const response = await axios.post(`/farmers/${data.farmerId}/farms/`, data)

        commit('newFarm', response.data.farm)
    },
    async deleteFarm ({commit}, data){
        const response = await axios.delete(`/farmers/${data.farmerId}/farms/${data.farmId}/`)
        console.log(response)
        commit('removeFarm', data.farmId)
    }
}

const mutations = {
    setFarms (state, farms) {
        if (farms.length > 0){
            state.farms = farms
        } else {
            state.farms = null
        }
    },
    setFarmer (state, farmer) {
        state.farmer = farmer
    },
    newFarm (state, farm) {
        state.farms.push(farm)
    },
    removeFarm (state, id) {
        state.farms = state.farms.filter(farm => farm.id !== id)
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}