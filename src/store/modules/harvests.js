import axios from 'axios';

const state = {
    harvests: null,
    farm: null,
}

const getters = {
    allHarvests (state) {
        return state.harvests
    },
    farm (state) {
        return state.farm
    }
}

const actions = {
    async fetchHarvests ({ commit }, data) {
        const response = await axios.get(`/farmers/${data.farmerId}/farms/${data.farmId}/harvests/`)
        commit('setHarvests', response.data)
        console.log(response.data)
    },
    async fetchFarm ({ commit }, data) {
        const response = await axios.get(`/farmers/${data.farmerId}/farms/${data.farmId}/`)
        commit('setFarm', response.data)
    },
    async addHarvest ({commit}, payload){
        const response = await axios.post(`/farmers/${payload.farmerId}/farms/${payload.farmId}/harvests/`, payload.data, { headers: {
            'Content-Type': 'multipart/form-data'
        }})

        commit('newHarvest', response.data.harvest)
    },
    async deleteHarvest ({commit}, data){
        const response = await axios.delete(`/farmers/${data.farmerId}/farms/${data.farmId}/harvests/${data.harvestId}/`)
        console.log(response)
        commit('removeHarvest', data.harvestId)
    }
    
}

const mutations = {
    setHarvests (state, harvests) {
        if (harvests.length < 1){
            state.harvests = null
        } else {
            state.harvests = harvests
        }
    },
    setFarm (state, farm) {
        state.farm = farm
    },
    newHarvest (state, harvest) {
        if (state.harvests){
            state.harvests.push(harvest)
        } else {
            state.harvests = []
            state.harvests.push(harvest)
        }

    },
    removeHarvest(state, id) {
        state.harvests = state.harvests.filter(harvest => harvest.id !== id)
        if (state.harvests.length < 1){
            state.harvests = null
        }
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}