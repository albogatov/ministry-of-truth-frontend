import Vuex from "vuex";
import Vue from "vue";
import mainPage from "@/store/mainPage";
Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        mainPage
    }
})
