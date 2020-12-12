import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      uri:null,
      token:null,
    },
    mutations: {
      setUri(state,uri){
        state.uri = uri;
      },
      setToken(state,token){
        state.token = token;
      },
    },
    getters: {
      getUri: state => {
        return state.uri;
      },
      getToken: state => {
        return state.token;
      },
    }
  })