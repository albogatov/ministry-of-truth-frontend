export default {
    state: {
        primaryColor: 1,
    },
    mutations: {
        setPrimaryColor(state, newColor) {
            state.primaryColor = newColor
        },
    },
    getters: {
        getPrimaryColor(state) {
            return state.primaryColor
        },
    }
}
