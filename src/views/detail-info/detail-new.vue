<template>
  <div v-loading="loading" class="z-page-wrapper">
    <operation v-if="currData.event" :curr-data="currData.event">
      <template slot="operation">
        <div>
          <template v-for="item in currData.actions">
            <el-button
              v-if="hasBtn(item)"
              :key="item.code"
              type="primary"
              size="mini"
              @click="showDialog(item)"
            >
              {{ item.name }}
            </el-button>
          </template>

          <el-button
            v-if="currData.print === 'OS-PRINT-DEFAULT'"
            type="primary"
            size="mini"
            @click="printEvent1"
          >
            打印
          </el-button>
          <!-- <el-dropdown v-if="currData.print === 'OS-PRINT-DEFAULT'" style="margin-left: 10px;" @command="selectPrintType">
            <el-button type="primary" size="mini">
              打印<i class="el-icon-arrow-down el-icon--right" />
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="whole">完整版</el-dropdown-item>
              <el-dropdown-item command="simple">简约版</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown> -->
        </div>
      </template>
    </operation>

    <div class="z-page-body">
      <div class="detail-base detail-info">
        <h4>案件基础信息</h4>
        <detail-base v-if="currData.event" ref="detailbase" :curr-data="currData" />
      </div>

      <div class="detail-desc detail-info">
        <h4>案件描述信息</h4>
        <detail-desc
          v-if="currData.event"
          ref="detaildesc"
          :can-edit="canEditStepCase"
          :curr-data="currData"
        />
      </div>

      <div class="detail-transfer detail-info">
        <h4>案件流转信息</h4>
        <steps
          v-if="currData.streamLog"
          :curr-data="JSON.parse(currData.event_filter_outer.ext_info)"
          :stream="currData.streamLog"
        />
      </div>

      <div class="detail-process detail-info">
        <h4>案件流转过程</h4>
        <time-line
          v-if="currData.streamLog"
          :curr-data="currData.streamLog"
          @compare="compareCase"
        />
      </div>
    </div>

    <!--弹框区-->
    <base-dialog
      v-if="visible"
      :visible.sync="visible"
      :title="title"
      @confirm="actionConfirm"
      @cancel="visible = false"
    >
      <paper-index
        ref="paperIndex"
        :question_id="formData.form_id"
        :uid="uid"
        @afterSubmitSuccess="onSubmitSuccess"
      />
    </base-dialog>

    <!--派遣弹框-->
    <dispatch-dialog
      v-if="dispatchVisible"
      :visible.sync="dispatchVisible"
      :title="title"
      :command-data="formData"
      :confirm-data="currData"
      @load-event="loadEvent"
      @cancel="dispatchVisible = false"
    />
  </div>
</template>
<script>
import { handleCaseDispatch, getEventDetail } from '@/api/case'
import Storage from 'good-storage'
import BaseDialog from '@/components/CaseList/base-dialog'
import DispatchDialog from '@/components/CaseList/dispatch-dialog'
import steps from './modules/detail-steps'
import timeLine from './modules/detail-time-line'
import operation from './modules/detail-operation'
import detailBase from './modules/detail-base'
import detailDesc from './modules/detail-desc'

// import { detailInfoMixins, windowOpenMixins, lockMixins } from '@/mixins'
// import { CommonCloseCaseHandleMixins } from '@/mixins/closecase'

export default {
  components: {
    steps,
    timeLine,
    operation,
    detailBase,
    detailDesc,
    BaseDialog,
    DispatchDialog
  },
  // mixins: [detailInfoMixins, windowOpenMixins, lockMixins, CommonCloseCaseHandleMixins],
  data() {
    return {
      userLevel: Storage.get('level'),
      loading: true,
      currData: {},
      host: process.env.VUE_APP_LIST_URL,
      showCompare: false,
      backCaseVisible: false,
      backCaseEventId: '',
      backCaseLoading: false,
      isResolve: 0,
      canEditStepCase: false, // 是否可编辑
      confirmCaseVisible: false,
      confirmCaseEventId: '',
      confirmCaseLoading: false,
      confirmCaseStatus: '', // 暂时只有立案，没有作废
      dialogAppealType: '', // 申诉审核类型
      dialogAppealVisible: false, // 申诉审核弹窗
      // 案件对比
      caseCompareVisible: false,
      appealLinkCode: '',
      isAiCaseCompare: false,
      userInfo: Storage.get('userInfor'),
      uid: Storage.get('userId'),
      visible: false,
      title: '',
      formData: '',
      formMenus: '', // 表单请求的返回
      dispatchVisible: '', // 派遣弹框是否出现
      inspectionImgs: {
        // hasFound: require('@/assets/images/hasFound.png'),
        // noFound: require('@/assets/images/noFound.png'),
        // duban: require('@/assets/images/duban.png'),
        // zuofei: require('@/assets/images/zuofei.png'),
        // tuidan: require('@/assets/images/tuidan.png'),
        // 'hongqiao-duban': require('@/assets/images/hongqiao-duban.png')
      }
    }
  },
  computed: {
    resolveVal() {
      return this.$route.query.isResolve || ''
    },
    type() {
      return this.$route.query.type || ''
    }
  },
  watch: {
    $route(newVal, oldVal) {
      if (newVal) {
        if (newVal.params.id !== oldVal.params.id) {
          this.getCaseDetail()
        }
      }
    }
  },
  mounted() {
    if (this.$route.query.coopId || this.$route.query.isResolve == 11) {
      this.isResolve = 11
    }
    this.getCaseDetail()
  },
  methods: {
    // 案件对比
    compareCase(linkCode, isAi) {
      this.$setTrackEvent(this.$route.name, 'view', '案件对比')
      this.appealLinkCode = linkCode
      this.caseCompareVisible = true
      this.isAiCaseCompare = !!isAi
    },
    // 图片对比
    showImgCompare() {
      this.$setTrackEvent(this.$route.name, 'view', '图片对比')
      this.showCompare = true
    },
    hasBtn(item) {
      if (this.resolveVal != 0 && this.resolveVal != 11) {
        return false
      }
      if (
        item.action_level_to != 0 &&
        item.type == 4 &&
        item.matchedRules &&
        item.matchedRules.length == 0
      ) {
        return false
      }
      return true
    },
    // 页面跳转
    midInitTable() {
      this.goParentPage(this.$route.query.type)
    },
    async getCaseDetail() {
      const eventId = this.$route.params.id || this.$route.params.caseId
      const coopId = this.$route.query.coopId
      this.loading = true
      const res = await getEventDetail(eventId, {
        coop_id: coopId,
        menuId: this.type
      })
      this.loading = false
      if (res.code == 200 && res.success == 1) {
        if (res.response.info === 'OS-INFO-DEFAULT') {
          this.currData = res.response
        }
      } else {
        this.$message({
          message: res.message,
          type: 'error'
        })
      }
      // http({
      //   method: 'get',
      //   url: '/api_v3/app/events/' + eventId,
      //   params: {
      //     coop_id: coopId,
      //     menuId: this.type
      //   }
      // })
      //   .then((res) => {
      //     this.loading = false
      //     if (res.data.code == 200 && res.data.success == 1) {
      //       if (res.data.response.info === 'OS-INFO-DEFAULT') {
      //         this.currData = res.data.response
      //       }
      //     } else {
      //       this.$message({
      //         message: res.data.message,
      //         type: 'error'
      //       })
      //     }
      //   })
      //   .catch(() => {
      //     this.loading = false
      //   })
    },
    // 展示弹框
    showDialog(val) {
      this.title = val.name
      this.formData = val
      if (val.action_level_to === 2 || val.action_level_to === 1) {
        this.dispatchVisible = true
      } else {
        this.visible = true
      }
    },
    actionConfirm() {
      this.formMenus = this.$refs.paperIndex.menus
      this.$refs.paperIndex.submit()
      // if (this.formMenus) {
      //   this.$refs.paperIndex.submit()
      // } else {
      //   this.$message.warning('表单不能为空！')
      // }
    },
    onSubmitSuccess(val) {
      const form = []
      this.formMenus.forEach((item, index) => {
        form.push({ [item.config.dataField.name]: val.data.answer[`id${index + 1}`] })
      })
      console.log(form)
      this.dispatch(form)
    },
    async dispatch(form) {
      this.loading = true
      const res = await handleCaseDispatch({
        eventId: this.$route.params.id,
        coopId: 0,
        menuId: this.$route.query.type,
        form,
        action: this.formData.id,
        formId: this.formData.form_id
      })
      this.loading = false
      this.visible = false
      if (res.data.success != 1) {
        this.$message({
          type: 'error',
          message: (res.data.errors && res.data.errors.msg) || '操作失败！'
        })
        return
      }
      window.history.back()
      // http({
      //   method: 'post',
      //   url: '/api_v3/app/event/dispatch',
      //   data: {
      //     eventId: this.$route.params.id,
      //     coopId: 0,
      //     menuId: this.$route.query.type,
      //     form,
      //     action: this.formData.id,
      //     formId: this.formData.form_id
      //   }
      // })
      //   .then((res) => {
      //     this.loading = false
      //     this.visible = false
      //     if (res.data.success != 1) {
      //       this.$message({
      //         type: 'error',
      //         message: (res.data.errors && res.data.errors.msg) || '操作失败！'
      //       })
      //       return
      //     }
      //     window.history.back()
      //   })
      //   .catch(() => {
      //     this.loading = false
      //   })
    },
    loadEvent() {
      window.history.back()
    },
    // 选择简约版打印还是完整版打印
    selectPrintType(command) {
      switch (command) {
        case 'whole':
          this.printEvent('print')
          break
        case 'simple':
          this.printEvent1('print-simple')
          break
        default:
          this.printEvent('print')
      }
    },
    // 跳转打印页面
    printEvent(type) {
      let newpage
      if (this.currData.eventData.orderId) {
        newpage = this.$router.resolve({
          path: `/${type}/${this.currData.eventData.orderId}`
        })
      } else {
        newpage = this.$router.resolve({
          path: `/${type}/${this.currData.eventData.eventId}?type=7`
        })
      }
      window.open(newpage.href, '_blank')
    },
    // 跳转打印页面(简约版)
    printEvent1() {
      const eventId = this.$route.params.id || this.$route.params.caseId
      const coopId = this.$route.query.coopId || ''
      const newpage = this.$router.resolve({
        path: `/print-simple/${eventId}?coopId=${coopId}`
      })
      window.open(newpage.href, '_blank')
    }
  }
}
</script>

<style lang="less" scoped>
.z-page-wrapper {
  margin: 0 16px;
  .inspection-img {
    position: absolute;
    top: 40px;
    left: 100px;
    display: block;
  }
}
.z-page-body {
  padding: 0 0 12px 0;
  font-size: 14px;

  .detail-info {
    background: #ffffff;
    color: #5e6470;
    border-top: 1px solid rgba(91, 91, 213, 0.2);
    padding: 20px 16px;
    &.detail-base {
      border: none;
    }
  }
  .detail-transfer {
    overflow-x: auto;
    padding: 12px 16px;
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 12px;
      // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(144, 147, 153, 0.3);
    }
  }
}
.detail-word {
  color: #5b5bd5;
}
</style>
