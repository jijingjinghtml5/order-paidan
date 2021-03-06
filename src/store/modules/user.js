import { login, logout, loginByToken, getCaseCount } from '@/api/login'
import {
  getToken,
  setToken,
  removeToken,
  getUserInfo,
  setUserInfo,
  removeUserInfo
} from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    rights: [],
    menus: [],
    userInfo: getUserInfo()
  }
}

const fun = async (commit, stopFn) => {
  const res = await getCaseCount()
  if (res.code == 200) {
    commit('SET_MENUS', res.response)
  } else {
    stopFn && stopFn()
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERINFO: (state, userInfo) => {
    state.userInfo = userInfo
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_MENUS(state, payload) {
    state.menus = payload
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_RIGHTS: (state, rights) => {
    state.rights = rights
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password })
        .then((response) => {
          const { data } = response.response
          commit('SET_TOKEN', data.token)
          setToken(data.token)
          commit('SET_USERINFO', data.userInfo)
          setUserInfo(data.userInfo)
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      loginByToken(state.token)
        .then((response) => {
          const { data } = response.response
          if (!data) {
            return reject(new Error('Verification failed, please Login again.'))
          }
          const { name, avatar, role, rights } = data
          commit('SET_ROLES', role)
          commit('SET_RIGHTS', rights)
          commit('SET_NAME', name)
          commit('SET_AVATAR', avatar)
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken() // must remove  token  first
          removeUserInfo()
          resetRouter()
          commit('RESET_STATE')
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  },

  getProcessCount({ commit, state }) {
    clearInterval(state.timer)
    fun(commit)
    state.timer = setInterval(() => {
      fun(commit, () => {
        clearInterval(state.timer)
      })
    }, 2 * 60 * 1000)
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
