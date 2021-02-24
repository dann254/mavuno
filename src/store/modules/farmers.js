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
    },
    async updateFarmer ({commit}, payload){
        const response = await axios.patch(`/farmers/${payload.farmerId}/`, payload.data)

        commit('editedFarmer', response.data)
    },
    async deleteFarmer ({commit}, farmerId){
        const response = await axios.delete(`/farmers/${farmerId}/`)
        console.log(response)
        commit('removeFarmer', farmerId)
    }
    
}

const mutations = {
    setFarmers (state, farmers) {
        if (farmers.length < 1){
            state.farmers = null
        } else {
            state.farmers = farmers
        }
    },
    newFarmer (state, farmer) {
        if (state.farmers){
            state.farmers.push(farmer)
        } else {
            state.farmers = []
            state.farmers.push(farmer)
        }
    },
    editedFarmer (state, uFarmer) {
        const index = state.farmers.findIndex(farmer => farmer.id === uFarmer.id)
        if (index !== -1){
            state.farmers.splice(index, 1,uFarmer)
        }
    },
    removeFarmer (state, id) {
        state.farmers = state.farmers.filter(farmer => farmer.id !== id)
        if (state.farmers.length < 1){
            state.farmers = null
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