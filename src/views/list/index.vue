<template>
  <div class="z-page-wrapper">
    <div class="z-page-header">
      <CommonFilter @search-submit="searchData" />
    </div>
    <div class="z-page-body">
      <el-row class="row-bg" type="flex">
        <el-col>
          <el-tabs
            v-model="isResolve"
            :class="loading ? 'noclick' : ''"
            class="caselist-tab"
            @tab-click="tabChange"
          >
            <el-tab-pane label="待处理" name="0" />
            <el-tab-pane label="历史操作" name="1" />
          </el-tabs>
        </el-col>
        <el-col style="width: 50px; line-height: 40px">
          <!-- 排序 -->
          <CommonSort :sort-key="sortKey" :sort-type="sortType" @sort-change="toSort"></CommonSort>
        </el-col>
      </el-row>
      <!-- 卡片模式 -->
      <CommonCard
        v-if="listCard"
        :loading="loading"
        :table-data="tableData"
        :set-card-height="setCardHeight"
        :total="total"
        :is-resolve="isResolve"
        @current-change="setPage"
        :page-size="limit"
        :current-page="currentPage"
        @size-change="setPageItem"
      >
        <template slot="actions" slot-scope="{ index, data }">
          <div>
            <span
              class="card-btn"
              @click="
                openWindow(
                  `/case-detail-new/${data.event.event_id}?type=${menuId}&isResolve=${isResolve}`
                )
              "
            >
              <i class="el-icon-view card-icon" />查看
            </span>
            <el-divider
              v-if="isResolve == 0 && data.actions && data.actions.length"
              direction="vertical"
            />
            <!-- @loading="lockLoading" -->
            <el-dropdown
              v-if="isResolve == 0 && data.actions && data.actions.length"
              style="height: 50px"
              :tabindex="index"
              @command="handleCommand($event, data)"
            >
              <span class="card-btn"
                ><i class="el-icon-circle-plus-outline card-icon" />更多操作<i
                  class="el-icon-arrow-down el-icon--right"
              /></span>
              <el-dropdown-menu slot="dropdown">
                <template v-for="item in data.actions">
                  <el-dropdown-item v-if="hasBtn(item)" :key="item.code" :command="item">{{
                    item.name
                  }}</el-dropdown-item>
                </template>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </template>
      </CommonCard>
      <!-- 表格模式 -->
      <CommonTable
        v-if="!listCard"
        :table-data="tableData"
        :table-head="tableHeaders"
        :set-height="setHeight"
        :loading="loading"
        :sort-key="sortKey"
        :sort-type="sortType"
        border
        :current-page="currentPage"
        :page-size="limit"
        :total="total"
        :cell-style="{ textAlign: 'center', fontSize: '12px' }"
        :header-cell-style="{ textAlign: 'center', fontSize: '12px' }"
        @size-change="setPageItem"
        @current-change="setPage"
      >
        <template slot="last-columns">
          <el-table-column key="110" :min-width="150" fixed="right" label="操作">
            <template v-slot:default="scope">
              <el-button
                @click="
                  openWindow(
                    `/case-detail-new/${scope.row.event.event_id}?type=${menuId}&isResolve=${isResolve}`
                  )
                "
                size="medium"
                type="text"
                >查看</el-button
              >
              <template v-for="item in scope.row.actions">
                <el-button
                  v-if="hasBtn(item)"
                  @click="handleCommand(item, scope.row)"
                  :key="item.code"
                  :command="item"
                  size="medium"
                  type="text"
                  >{{ item.name }}</el-button
                >
              </template>
            </template>
          </el-table-column>
        </template>
      </CommonTable>
      <!-- 分页 -->
      <!-- <CommonPage :total="total" @pagination="setPage" :page="currentPage" :limit="limit" /> -->
    </div>
    <!-- 弹窗prompt类型 -->
    <common-prompt
      :visible="showCommonPromptDialog"
      :title="commonPromptDialogTitle"
      :need-case-el-button="commonNeedCaseElButton"
      :prompt-curr-data="commonPromptCurrData"
      :confirm-button-text="commonPromptConfirmButtonText"
      :tit-icon="commonPromptTitIcon"
      :cancel-button-text="commonPromptCancelButtonText"
      :is-confirm="commonIsConfirmPrompt"
      :prompt-type="commonPromptType"
      :place-desc="commonPromptDesc"
      :default-desc="commonPromptDefaultDesc"
      :prompt-loading="commonPromptDialogLoading"
      :extra-mess="commonPromptExtraMess"
      @cancelFun="cancelPromptDialog"
      @confirmFun="comfirmPromptDialog"
    />
    <!--操作弹框-->
    <base-dialog
      v-if="visible"
      :visible.sync="visible"
      :title="title"
      @confirm="actionConfirm"
      @cancel="visible = false"
    >
      <paper-index
        ref="paperIndex"
        :question_id="commandData.form_id"
        :uid="uid"
        @afterSubmitSuccess="onSubmitSuccess"
      />
    </base-dialog>
    <!--派遣弹框-->
    <dispatch-dialog
      v-if="dispatchVisible"
      :visible.sync="dispatchVisible"
      :title="title"
      :command-data="commandData"
      :confirm-data="confirmData"
      @confirm="actionConfirm"
      @load-event="loadEvent"
      @cancel="dispatchVisible = false"
    >
      <paper-index
        ref="paperIndex"
        :question_id="commandData.form_id"
        :uid="uid"
        @afterSubmitSuccess="onSubmitSuccess"
      />
    </dispatch-dialog>
  </div>
</template>

<script>
import Storage from 'good-storage'
import CommonFilter from '@/components/CaseList/filter'
import CommonSort from '@/components/CaseList/common-sort'
import CommonCard from '@/components/CaseList/common-card'
import CommonTable from '@/components/CaseList/common-table'
// import CommonPage from '@/components/CaseList/pagination'
import BaseDialog from '@/components/CaseList/base-dialog'
import DispatchDialog from '@/components/CaseList/dispatch-dialog'
import { getEvents, handleCaseDispatch, addEventTag } from '@/api/case'

export default {
  name: 'CardList',
  data() {
    return {
      loading: false,
      listCard: false,
      sortVisible: false,
      tableParams: {},
      isResolve: 0,
      visible: false,
      dispatchVisible: false, // 派遣弹框是否出现
      confirmData: '',
      commandData: '',
      currentActionId: '',
      title: '',
      uid: Storage.get('userId'),
      HTML_BASE: process.env.VUE_APP_HTML_URL,
      formMenus: '', // 表单请求的返回
      // 卡片列表数据
      tableHeaders: [
        { prop: 'event.code', label: '案件编号', minwidth: '160px' },
        { prop: 'event.name', label: '案件名称', minwidth: '140px' },
        {
          prop: 'address',
          label: '案件地址',
          minwidth: '200px',
          labelCustomize: true,
          getLabel: (row) =>
            row.event.address + (row.event.addressNote ? `(${row.event.addressNote})` : '')
        }
      ],
      sortKey: 'event_time',
      sortType: '0',
      tableData: [],
      total: 0,
      currentPage: 1,
      limit: 10,
      setHeight: '100%',
      setCardHeight: '100%'
    }
  },
  components: {
    CommonFilter,
    CommonCard,
    CommonTable,
    CommonSort,
    // CommonPage,
    BaseDialog,
    DispatchDialog
  },
  computed: {
    menuId() {
      return this.$route.params.id
    }
  },
  methods: {
    openWindow(router) {
      let url = ''
      if (process.env.NODE_ENV == 'production' && this.HTML_BASE) {
        url = document.location.origin + '/web/#' + router
      } else {
        url = document.location.origin + '/#' + router
      }
      // window.open(url)
      window.location.href = url
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
      this.formMenus.forEach((item) => {
        form.push({
          key: item.config.dataField.name,
          value: val.data.answer[`id${item.id}`] || null,
          id: item.id
        })
      })
      console.log(form)
      if (this.commandData.action_level_to != 2 && this.commandData.action_level_to != 1) {
        this.dispatch(form)
      }
    },
    async dispatch(form) {
      this.loading = true
      const res = await handleCaseDispatch({
        eventId: this.confirmData.event.event_id,
        coopId: 0,
        menuId: this.menuId,
        form,
        action: this.currentActionId,
        formId: this.commandData.form_id
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
      this.loadEvent()
    },
    // action_level_to 0-默认 1-向上 2-向下 3-退单
    handleCommand(command, data) {
      this.currentActionId = command.currentActionId || command.id
      this.title = command.name
      this.confirmData = data
      this.commandData = command
      const type = command.type
      // type: 1：阶段，2：状态，3：系统内置操作，4：操作，5：卡片，6：详情，7：打印，9：标签页，10：筛选，11：排序，12：标签操作，13：标签
      if (type == 12) {
        this.addTag()
      } else if (type == 3) {
        // this.goPage(data)
      } else if (command.action_level_to === 2 || command.action_level_to === 1) {
        this.dispatchVisible = true
      } else {
        this.visible = true
      }
    },
    // 调用打标签接口
    addTag() {
      this.showCommonPromptDialog = true
      this.commonPromptDialogTitle = '提示'
      this.commonPromptDesc = ''
      this.commonPromptType = 'addTagSubmit'
      this.commonPromptExtraMess = {}
      this.commonPromptDefaultDesc = `确认${this.commandData.name}?`
      this.commonNeedCaseElButton = true
      this.commonPromptCurrData = this.confirmData
      this.commonIsConfirmPrompt = true
      this.commonPromptTitIcon = 'warning'
    },
    async addTagSubmit() {
      this.commonPromptDialogLoading = true
      const res = await addEventTag({
        event_id: this.confirmData.event.event_id,
        code: this.commandData.ext
      })
      this.showCommonPromptDialog = false
      this.commonPromptDialogLoading = false
      if (res.code === 200) {
        this.$message.success('操作成功！')
        this.loadEvent()
      } else {
        this.$message.error('操作失败！')
      }
    },
    hasBtn(item) {
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
    // 切换tab
    tabChange(val) {
      this.isResolve = val.name
      this.loadEvent()
    },
    // 搜索按钮触发
    searchData(params) {
      this.tableParams = { ...params }
      this.loadEvent()
    },
    // 加载事件数据
    async loadEvent(noLoading) {
      this.loading = true
      if (!noLoading) {
        this.tableData = []
      }
      const obj = {
        ...this.tableParams,
        'per-page': this.limit,
        page: this.currentPage,
        isResolve: this.isResolve,
        sort: this.sortKey,
        sort_type: this.sortType
      }
      obj.menuId = this.menuId
      // obj.dataSource = 'mysql'
      try {
        const res = await getEvents(obj)
        this.setTableData(res)
      } catch (e) {
        this.loading = false
      }
    },
    setTableData(res) {
      this.loading = false
      if (res && res.code == 200) {
        const response = res.response
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
    toSort(a) {
      this.sortKey = a.sortKey
      this.sortType = a.sortType
      this.loadEvent()
    },
    // 页码信息变化
    setPage(val) {
      this.currentPage = val
      this.loadEvent()
    },
    setPageItem(size) {
      this.limit = size
      this.loadEvent()
    },
    resetHeight() {
      const domBody = document.getElementsByClassName('z-page-body')[0]
      const domHead = document.getElementsByClassName('z-page-header')[0]
      const contentHeadPage = domBody && (domBody.clientHeight || '')
      const cardHeadPage = domHead && (domHead.clientHeight || '')
      this.setHeight = contentHeadPage
      this.setCardHeight = cardHeadPage + 185
    }
  },
  created() {
    this.loadEvent()
  }
}
</script>

<style scoped lang="scss">
.row-bg {
  ::v-deep .el-tabs__nav-wrap {
    &::after {
      background-color: unset;
    }
  }
}
.card-btn {
  color: #5b5bd5;
  font-size: 14px;
  line-height: 75px;
  flex: 1;
  text-align: right;
  cursor: pointer;
  .card-icon {
    margin-right: 4px;
  }
}
</style>
