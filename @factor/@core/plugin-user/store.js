export default {
  name: "user",
  namespaced: true,
  state: () => ({
    post: {},
    index: []
  }),
  getters: {
    getItem: state => item => {
      return state[item]
    }
  },
  mutations: {
    setItem: (state, { item, value }) => {
      state[item] = value
    }
  }
}
