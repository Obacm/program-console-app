/**
 * 历史状态管理
 */
import { storage } from '../../common/utils/storage'

// 定义状态
const state = {
  name: null,
  next: null
}

// 获取状态
const getters = {
  name: state => {
    return state.name ? state.name : storage.get('name')
  },
  next: state => {
    return state.next ? state.next : storage.get('next')
  }
}

// 提交 mutation
const actions = {
  setName: ({ commit }, name) => {
    commit('SET_NAME', name)
    commit('SET_NEXT', '')
  },
  setNext: ({ commit }, next) => {
    commit('SET_NEXT', next)
  }
}

// 变更状态
const mutations = {
  SET_NAME: (state, name) => {
    state.name = name
    state.next = null
    storage.set('name', name)
    storage.remove('next')
  },
  SET_NEXT: (state, next) => {
    state.next = next
    storage.set('next', next)
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
