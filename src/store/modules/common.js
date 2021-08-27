import {
  getAllEventTypes,
  getManageElements,
  getReportTypes,
  getDiscoverTypes,
  getCodeDict,
  getEventSource
} from '@/api/common'
// import { getToken, setToken, removeToken } from '@/utils/auth'

const getDefaultState = () => {
  return {
    eventType: [],
    eventTypeNew: [],
    eventSource: [],
    codeDict: null,
    reportTypes: [],
    discoverTypes: [],
    caseStatus: [],
    casePeriod: [],
    caseOperation: []
  }
}

const state = getDefaultState()

const mutations = {
  SET_EVENTYPE: (state, eventType) => {
    state.eventType = eventType
  },
  SET_EVENTYPENEW: (state, eventTypeNew) => {
    state.eventTypeNew = eventTypeNew
  },
  SET_EVENTSOURCE: (state, eventSource) => {
    state.eventSource = eventSource
  },
  SET_CODEDICT: (state, codeDict) => {
    state.codeDict = codeDict
  },
  SET_REPORT_TYPES: (state, reportTypes) => {
    state.reportTypes = reportTypes
  },
  SET_DISCOVER_TYPES: (state, discoverTypes) => {
    state.discoverTypes = discoverTypes
  },
  SET_CASE_STATUS: (state, caseStatus) => {
    state.caseStatus = caseStatus
  },
  SET_CASE_PERIOD: (state, casePeriod) => {
    state.casePeriod = casePeriod
  },
  SET_CASE_OPERATION: (state, caseOperation) => {
    state.caseOperation = caseOperation
  }
}

const actions = {
  getAllCommonData({ commit, state }) {
    if (!state.eventType.length) {
      getAllEventTypes().then((res) => {
        const newRes = JSON.parse(JSON.stringify(res.response.data))
        newRes.forEach((item) => {
          const resChild = item.children
          if (resChild && resChild.length) {
            resChild.forEach((node) => {
              const nodeChild = node.children
              if (nodeChild && nodeChild.length) {
                nodeChild.forEach((obj) => {
                  const objChild = obj.children
                  if (objChild && objChild.length) {
                    obj.children = false
                  }
                })
              }
            })
          }
        })
        commit('SET_EVENTYPE', newRes)
        commit('SET_EVENTYPENEW', res.response.data)
      })
    }
    if (!state.eventSource.length) {
      getEventSource().then((res) => {
        commit('SET_EVENTSOURCE', res.response.data)
      })
    }
    if (!state.codeDict) {
      getCodeDict().then((res) => {
        commit('SET_CODEDICT', res.response)
      })
    }
    if (!state.reportTypes.length) {
      getReportTypes().then((res) => {
        commit('SET_REPORT_TYPES', res.response.data)
      })
    }
    if (!state.discoverTypes.length) {
      getDiscoverTypes().then((res) => {
        commit('SET_DISCOVER_TYPES', res.response.data)
      })
    }
    if (!state.caseStatus.length) {
      getManageElements({ type: 2 }).then((res) => {
        commit('SET_CASE_STATUS', res.response[0].data)
      })
    }
    if (!state.casePeriod.length) {
      getManageElements({ type: 1, state: 1 }).then((res) => {
        commit('SET_CASE_PERIOD', res.response[0].data)
      })
    }
    if (!state.caseOperation.length) {
      getManageElements({ type: 4 }).then((res) => {
        commit('SET_CASE_OPERATION', res.response[0].data)
      })
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
