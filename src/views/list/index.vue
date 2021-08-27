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
        <!-- <el-col v-if="listCard" style="width: 110px; line-height: 40px">
          <columnsCustomizeSave
            v-model="isResolve"
            :init-checkbox-list="checkboxList"
            :table-show-columns="columnLabel"
            @tableShowColumnsChange="checkboxChange"
          />
        </el-col> -->
      </el-row>
      <!-- 卡片模式 -->
      <CommonCard
        :loading="loading"
        :table-data="tableData"
        :set-card-height="setCardHeight"
        :is-resolve="isResolve"
        @pagination="setPage"
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
            <el-dropdown
              v-if="isResolve == 0 && data.actions && data.actions.length"
              style="height: 50px"
              :tabindex="index"
              @command="handleCommand($event, data)"
              @loading="lockLoading"
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
      <!-- 分页 -->
      <CommonPage :total="total" @pagination="setPage" :page="currentPage" :limit="limit" />
    </div>
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
  </div>
</template>

<script>
import CommonFilter from '@/components/CaseList/filter'
import CommonCard from '@/components/CaseList/card'
import CommonPage from '@/components/CaseList/pagination'
import BaseDialog from '@/components/CaseList/base-dialog'
// import DispatchDialog from '@/components/CaseList/dispatch-dialog'
import { getEvents } from '@/api/case'

export default {
  name: 'CardList',
  data() {
    return {
      tableData: [],
      total: 0,
      loading: false,
      currentPage: 1,
      limit: 10,
      tableParams: {},
      setHeight: '100%',
      setCardHeight: '100%',
      isResolve: 0
    }
  },
  components: {
    CommonFilter,
    CommonCard,
    CommonPage,
    BaseDialog
  },
  computed: {
    menuId() {
      return this.$route.params.id
    }
  },
  methods: {
    openWindow() {
      //
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
        // this.addTag()
      } else if (type == 3) {
        // this.goPage(data)
      } else if (command.action_level_to === 2 || command.action_level_to === 1) {
        this.dispatchVisible = true
      } else {
        this.visible = true
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
        isResolve: this.isResolve
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
    // 页码信息变化
    setPage(obj) {
      this.currentPage = obj.page
      this.limit = obj.limit
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
/* .row-bg {
  background: #fff;
} */
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
