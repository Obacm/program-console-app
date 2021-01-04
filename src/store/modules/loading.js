/**
 * 加载状态管理
 */

// 定义状态
const state = {
  spinning: false
}

// 获取状态
const getters = {
  spinning: state => {
    return state.spinning
  }
}

// 提交 mutation
const actions = {
  setSpinning: ({ commit }, spinning) => {
    commit('spinning', spinning)
  }
}

// 变更状态
const mutations = {
  SET_SPINNING: (state, spinning) => {
    state.spinning = spinning
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
