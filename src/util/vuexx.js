import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      bucket:null,
      objectList: [],
    },
    mutations: {
      setBucket(state,bucket){
        state.bucket = bucket;
      },
      addObjectList(state,object){
        state.objectList.unshift(object)
      }
    },
    getters: {
      getBucket: state => {
        return state.bucket;
      },
      getObjectList: state => {
        return state.objectList;
      }
    }
  })