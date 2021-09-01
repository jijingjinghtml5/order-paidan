import { mapActions, mapGetters } from 'vuex'
import Storage from 'good-storage'

export const CommonTableDataMixins = {
  data() {
    return {
      loading: false,
      setHeight: '100%',
      setCardHeight: '100%',
      currentPage: 1,
      item: 10,
      total: 0,
      currentPage2: 1,
      pageSize: 10,
      total2: 0,
      sortKey: 'e.event_time',
      sortType: '0',
      order: '',
      tableData: [],
      level: Storage.get('level'),
      HTML_BASE: process.env.VUE_APP_HTML_URL,
      HTML_LIST: process.env.VUE_APP_LIST_URL || ''
    }
  },
  // components: { caseElButton, lockButton, spanElButton },
  computed: {
    ...mapGetters([
      'eventType',
      'eventSource',
      'eventOrigin',
      'district',
      'streets',
      'newWindow',
      'listCard',
      'attribute'
    ])
  },
  methods: {
    ...mapActions(['getProcessCount']),
    resetHeight() {
      const domBody = document.getElementsByClassName('z-page-body')[0]
      const domHead = document.getElementsByClassName('z-page-header')[0]
      const contentHeadPage = domBody && (domBody.clientHeight || '')
      const cardHeadPage = domHead && (domHead.clientHeight || '')
      this.setHeight = contentHeadPage
      this.setCardHeight = cardHeadPage + 185
    },
    setTableData(res) {
      this.loading = false
      if (res.data && res.data.code == 200) {
        const response = res.data.response
        this.tableData = response.data
        this.total = response._meta.count

        // 如果请求了的页数没有数据超过了最大的总页数，那么就重新加载一次，定位到最后一页即可，
        // 也只有最后一页才会出现这种情况，当然最后一页就是第一页那么即可忽略
        const pageSize = response._meta.pageSize
        if (this.currentPage > 1 && this.tableData.length == 0) {
          const totalPage =
            this.total > 0
              ? this.total < pageSize
                ? 1
                : this.total % pageSize
                ? parseInt(this.total / pageSize) + 1
                : this.total / pageSize
              : 0
          if (this.currentPage > totalPage) {
            this.currentPage =
              this.currentPage > totalPage ? totalPage : this.currentPage < 1 ? 1 : this.currentPage
            this.loadEvent()
          }
        }

        this.$nextTick(() => {
          this.resetHeight()
        })
      } else {
        this.tableData = []
        this.total = 0
        this.$message(res.data.msg || '数据请求失败!')
      }
    },
    lockLoading(val) {
      this.loading = val
    },
    openWindow(router) {
      let url = ''
      if (process.env.NODE_ENV == 'production' && this.HTML_BASE) {
        url = document.location.origin + '/service/#' + router
      } else {
        url = document.location.origin + '/#' + router
      }
      if (this.newWindow) {
        window.open(url)
      } else {
        window.location.href = url
      }
    },
    aLink(router) {
      let url = ''
      if (process.env.NODE_ENV == 'production' && this.HTML_BASE) {
        url = document.location.origin + '/web/#' + router
      } else {
        url = document.location.origin + '/#' + router
      }
      return url
    },
    // 设置表格显示行数
    setPageItem(size, key) {
      if (key) {
        this[key] = size
        this.midInitTable2()
      } else {
        this.item = size
        this.midInitTable()
      }
    },
    // 跳转页
    setPage(page, key) {
      if (key) {
        this[key] = page
        this.midInitTable2()
      } else {
        this.currentPage = page
        this.midInitTable()
      }
      this.initFilterStorage(page)
    },
    // 排序
    toSort(a) {
      this.sortKey = a.sortKey
      this.sortType = a.sortType
      this.midInitTable()
    },
    tableHeightCustomize() {
      let timer = null
      window.onresize = () => {
        clearTimeout(timer)
        timer = setTimeout(() => {
          this.resetHeight()
        }, 200)
      }
    }
  }
}

export const commonDialog = {
  //
}
