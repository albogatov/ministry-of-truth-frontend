export default {
    state: {
        caseList: [],
        primaryColor: 1,
    },
    mutations: {
        changeElement(state, index, newName) {
            state.caseList[index] = newName
        },
        updateList(state, List) {
            state.caseList = List
        },
        clearAll(state) {
            state.caseList = []
        },
        setPrimaryColor(state, newColor) {
            state.primaryColor = newColor
        },
    },
    getters: {
        allElements(state) {
            return state.caseList
        },
        getPrimaryColor(state) {
            return state.primaryColor
        },
    }
}
