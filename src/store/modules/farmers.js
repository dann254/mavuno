import axios from 'axios';

const state = {
    farmers: null
}

const getters = {
    allFarmers (state) {
        return state.farmers
    }
}

const actions = {
    async fetchFarmers ({ commit }) {
        const response = await axios.get('/farmers/')
        commit('setFarmers', response.data)
    },
    async addFarmer ({commit}, data){
        const response = await axios.post('/farmers/', data)

        commit('newFarmer', response.data.farmer)
    }
    
}

const mutations = {
    setFarmers (state, farmers) {
        state.farmers = farmers
    },
    newFarmer (state, farmer) {
        state.farmers.push(farmer)
    }
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}