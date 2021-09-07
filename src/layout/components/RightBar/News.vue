<template>
  <el-dropdown class="dropdown-news" trigger="click" @command="handleIcon">
    <span class="el-dropdown-link" @click="clickBell">
      <el-badge :value="iconSum" @click.native="clickBell">
        <i class="el-icon-bell" :class="noticePopup ? 'blingbling' : ''" />
      </el-badge>
    </span>
    <div class="seldropdown">
      <el-dropdown-menu slot="dropdown" class="seldropdownCont">
        <el-dropdown-item
          v-for="items in lists"
          v-show="lists.length"
          :key="items.id + 'a'"
          class="seldropdownList"
          :command="items"
        >
          <div class="seldropdownTitle">
            <div class="drodownlistTop1">{{ items.title }}</div>
            <div class="drodownlistTop2">{{ items.created_at }}</div>
          </div>
          <div class="drodownlistContent">{{ items.content }}</div>
        </el-dropdown-item>
        <div v-show="!lists.length" class="seldropdownContNo">无列表信息</div>
        <el-dropdown-item>
          <div class="seldropdownBtn">
            <el-button class="drodownlistAll" type="primary" @click="drodownlistAllBtn"
              >查看全部消息</el-button
            >
          </div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </div>
    <audio
      id="layout-notice-tit"
      style="display: none"
      ref="noticeAudio"
      src="../../../assets/audio/notice.wav"
    />
  </el-dropdown>
</template>

<script>
import Storage from 'good-storage'
import { mapGetters } from 'vuex'
import { getNewsCount, getNewsRecords, setNewsRead } from '@/api/common'

export default {
  data() {
    return {
      iconSum: '',
      lists: [],
      timer: null,
      noticeTimer: null,
      noticePopup: null // 提示框实例
    }
  },
  computed: {
    ...mapGetters(['userInfo'])
  },
  methods: {
    async handleNewsCount() {
      const res = await getNewsCount()
      if (res.code === 200) {
        this.iconSum = res.response.count
      }
    },
    async handleNewsRecords() {
      const obj = {
        state: '0'
      }
      const res = await getNewsRecords(obj)
      this.lists = res.response.data
    },
    drodownlistAllBtn() {
      this.$router.push('/messagelist')
    },
    clickBell() {
      this.handleNewsRecords()
    },
    handleIcon(val) {
      if (val && val.event_id) this.$router.push(`/case-detail-new/${val.event_id}`)
    },
    async getLatestNotice() {
      const currentTime = new Date(parseInt(new Date().getTime() / 1000) * 1000)
      const lastFifthTime = new Date(currentTime.getTime() - 60 * 1000)
      /** 这一段是在打开多个窗口的时候，读取上一次获取的数据 */
      if (
        Storage.get('noticeLastTime') &&
        currentTime.getTime() / 1000 - 60 < Storage.get('noticeLastTime')
      ) {
        const lastNoticeData = JSON.parse(Storage.get('noticeLastData') || JSON.stringify({}))
        if (lastNoticeData.content) {
          this.showNotice(lastNoticeData, 'yes')
        }
        return
      }
      Storage.set('noticeLastTime', currentTime.getTime() / 1000)
      /** 这一段是在打开多个窗口的时候，读取上一次获取的数据 */
      const obj = {
        state: '0',
        start: new Date(lastFifthTime).Format('YYYY-MM-DD HH:mm:ss'),
        end: new Date(currentTime).Format('YYYY-MM-DD HH:mm:ss')
      }
      const res = await getNewsRecords(obj)
      if (res.response && res.response.data.length > 0) {
        /** 这一段是在打开多个窗口的时候，读取上一次获取的数据 */
        Storage.set('noticeLastData', JSON.stringify(res.response.data[0]))
        /** 这一段是在打开多个窗口的时候，读取上一次获取的数据 */
        this.showNotice(res.response.data[0])
      } else {
        /** 这一段是在打开多个窗口的时候，设置上一次获取的数据 */
        Storage.set('noticeLastData', JSON.stringify({}))
        /** 这一段是在打开多个窗口的时候，设置上一次获取的数据 */
      }
    },
    // 消息通知的详情按钮
    linkDetail(noticeItem) {
      this.$router.push(`/case-detail-new/${noticeItem.event_id}`)
      this.noticePopup.close()
      this.noticePopup = null
    },
    // 设置为已读
    async setRead(val) {
      const ids = { ids: '' + val, state: 1 }
      const res = await setNewsRead(ids)
      if (res.success == 1) {
        this.$message.success('设置成功')
        this.noticePopup.close()
        this.noticePopup = null
      } else {
        this.$message.error('设置失败')
      }
    },
    showNotice(noticeItem, isStore) {
      const that = this
      // 系统提示音，并弹出
      if (!that.noticeSound && isStore != 'yes') {
        that.$refs.noticeAudio.play()
      }
      if (that.noticePopup) {
        that.noticePopup.close()
        that.noticePopup = null
      }

      const h = that.$createElement
      that.noticePopup = that.$notify({
        title: '案件通知',
        // message: noticeItem.content,
        position: 'bottom-right',
        duration: 15000,
        message: h('p', null, [
          noticeItem.content,
          h('div', {}, [
            h(
              'el-button',
              {
                style: {
                  float: 'right'
                },
                attrs: {
                  size: 'small',
                  type: 'primary'
                },
                on: {
                  click: () => that.linkDetail(noticeItem) // 跳转至详情页面
                }
              },
              '详情'
            ),
            h(
              'el-button',
              {
                style: {
                  float: 'right',
                  marginRight: '10px'
                },
                attrs: {
                  size: 'small',
                  type: 'default'
                },
                on: {
                  click: noticeItem.state == '0' ? () => that.setRead(noticeItem.id) : '' // 标识为已读
                }
              },
              '已读'
            )
          ])
        ]),
        onClose() {
          that.noticePopup = null
        }
        // onClick() {
        //   that.$router.push(`/case-detail-new/${noticeItem.event_id}`);
        // },
      })
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
    clearInterval(this.noticeTimer)
  },
  mounted() {
    this.handleNewsCount()
    this.handleNewsRecords()
    this.timer = setInterval(() => {
      this.handleNewsCount()
      this.handleNewsRecords()
    }, 1000 * 60 * 2)
    if (true) {
      this.getLatestNotice()
      // 消息通知计时
      this.noticeTimer = setInterval(() => {
        this.getLatestNotice()
      }, 60 * 1000)
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-news {
  padding: 0 8px;
  margin-right: 10px;
  ::v-deep {
    .el-badge__content {
      &.is-fixed {
        top: 8px;
      }
    }
  }
}
.seldropdownContNo {
  background-color: rgb(255, 255, 255);
  height: 100%;
  width: 100%;
  text-align: center;
  font-size: 20px;
  margin-top: 20px;
  padding: 20px 0;
}
.seldropdownCont {
  // height: 99%;
  width: 30%;
  margin-bottom: 20px;
  max-height: 78vh;
  background-color: rgb(255, 255, 255);
  &::-webkit-scrollbar {
    width: 10px;
  }
  &::-webkit-scrollbar-track {
    border-radius: 6px;
    background-color: rgba(0, 44, 77, 0.63);
    box-shadow: inset 0 0 3px #fff;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 6px;
    // background-color: rgba(179, 196, 235, 0.938);
    background-color: #ccc;
    box-shadow: inset 0 0 3px #fff;
  }
  overflow-y: auto; // 上下滑动
}
.seldropdownList {
  cursor: pointer;
  margin: 10px;
  border-bottom: 1px solid #ccc;
}

.seldropdownTitle {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  color: #000;
}
.seldropdownBtn {
  text-align: right;
  padding: 10px;
}
</style>
