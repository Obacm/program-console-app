/**
 * 历史状态管理
 */

import { storage } from '@/common/utils/storage'

// 定义状态
const state = {
  histories: []
}

// 获取状态
const getters = {
  histories: state => {
    return state.histories.length > 0 ? state.histories : JSON.parse(storage.get('histories'))
  }
}

// 提交 mutation
const actions = {
  setHistories: ({ commit }, history) => {
    commit('SET_HOSTORIES', history)
  }
}

// 变更状态
const mutations = {
  SET_HOSTORIES: (state, payload) => {
    if (payload.type) {
      state.histories = []
    }

    let length = state.histories.length

    if (length > 0) {
      let index = state.histories.findIndex(item => {
        return item.path === payload.history.path
      })

      if (index < 0) {
        state.histories.push(payload.history)
        storage.set('histories', JSON.stringify(state.histories))
      } else {
        if (index < length) {
          state.histories.splice(index + 1, length - index)
          storage.set('histories', JSON.stringify(state.histories))
        }
      }
    } else {
      state.histories.push(payload.history)
      storage.set('histories', JSON.stringify(state.histories))
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
