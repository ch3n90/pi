import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
      titleBarFontColor:'#fff',
      settingsBadgeHidden:true, 
    },
    mutations: {
      setTitleBarFontColor(state,fc){
        state.titleBarFontColor = fc;
      },
      setSettingsBadgeHidden(state,isHidden){
        state.settingsBadgeHidden = isHidden;
      },
    },
    getters: {
      getTitleBarFontColor: state => {
        return state.titleBarFontColor;
      },
      getSettingsBadgeHidden: state => {
        return state.settingsBadgeHidden;
      },
    }
  })