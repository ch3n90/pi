import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      titleBarFontColor:'#fff',
    },
    mutations: {
      setTitleBarFontColor(state,fc){
        state.titleBarFontColor = fc;
      },
    },
    getters: {
      getTitleBarFontColor: state => {
        return state.titleBarFontColor;
      },
    }
  })