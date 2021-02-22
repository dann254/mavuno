import axios from 'axios';

const state = {
    token: null,
    user: null
}

const getters = {
    authenticated (state) {
        return state.token
    },

    user (state) {
        return state.user
    }
}

const actions = {
    async signIn ({ dispatch }, data) {
        await axios.post('auth/login/', data).then(({data, status}) => {
            if (status === 200) {
                return dispatch('updateAuth', data.access)
            }
        })
        .catch(error => {
            throw error
        })
    },
    async updateAuth ({ commit }, token) {
        if (token){
            commit('SET_TOKEN', token)
        }

        if (!state.token) {
            return
        }

        try {
            let response = await axios.get('auth/user/')
            commit('SET_USER', response.data)
        } catch (e) {
            commit('SET_USER', null)
            commit('SET_TOKEN', null)
        }
    },
    signOut ({ commit }) {
        commit('SET_USER', null)
        commit('SET_TOKEN', null)
        return
    }
    
}

const mutations = {
    SET_TOKEN (state, token) {
        state.token = token
    },
    SET_USER (state, data) {
        state.token = data
    },
}


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}