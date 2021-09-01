<template>
  <base-dialog v-bind="$attrs" width="70%" @confirm="actionConfirm" v-on="$listeners">
    <div v-loading="loading">
      <!--内容区域的默认插槽-->
      <slot />
      <!--tabs-->
      <el-row v-if="commandData.action_level_to === 2" class="row_wrap">
        <el-tabs v-model="tabType">
          <el-tab-pane
            v-for="(item, index) in type"
            :key="index"
            :label="getTabName(item)"
            :name="item + ''"
          />
        </el-tabs>
      </el-row>
      <!--指派下级-->
      <el-row v-if="commandData.action_level_to === 2" class="row_wrap" style="margin-top: 20px">
        <el-col :span="3">
          <span class="row_label">指派下级：</span>
        </el-col>
        <el-col :span="21">
          <el-cascader
            ref="cascader"
            v-model="selectedOptions"
            filterable
            :options="options"
            :props="props"
            clearable
            @change="handleChange"
          />
        </el-col>
      </el-row>
      <!--派遣至-->
      <el-row v-if="commandData.action_level_to === 1" class="row_wrap" style="margin-top: 20px">
        <el-col :span="24">
          <span class="row_label"
            >{{ commandData.name }}至：{{
              commandData.up[0].to.areaName || commandData.up[0].to.departmentName
            }}</span
          >
        </el-col>
      </el-row>
      <!--table-->
      <commontable
        v-if="tabType == 2"
        :table-data="tableData"
        :table-head="dialogHeaders"
        set-height="400px"
        border
        :current-page="currentPage"
        :page-size="item"
        :total="total"
        :cell-style="{ textAlign: 'center', fontSize: '12px' }"
        :header-cell-style="{ textAlign: 'center', fontSize: '12px' }"
        @size-change="setPageItem"
        @current-change="setPage"
      >
        <template slot="first-columns">
          <el-table-column prop="order" label="选择" fixed="left" width="70">
            <template v-slot:default="scope">
              <el-radio
                v-model="selectedId"
                :label="scope.row.personCode"
                @change="radioChange(scope.row)"
                >{{ '' }}</el-radio
              >
            </template>
          </el-table-column>
        </template>
      </commontable>
      <el-row class="row_wrap" style="margin-top: 20px">
        <el-col :span="3">
          <span class="row_label">{{ commandData.name }}意见：</span>
        </el-col>
        <el-col :span="21">
          <el-input v-model="desc" type="textarea" placeholder="请输入内容" />
        </el-col>
      </el-row>
    </div>
  </base-dialog>
</template>
<script>
import BaseDialog from '@/components/CaseList/base-dialog'
import { CommonTableDataMixins } from '@/mixins/common'
import Commontable from '@/components/CaseList/common-table'
// import http from '@/api'
import { getChildMeta, getDepsByParent, getParents, getUsers, handleCaseDispatch } from '@/api/case'

export default {
  components: {
    BaseDialog,
    Commontable
  },
  mixins: [CommonTableDataMixins],
  props: {
    commandData: {
      type: Object,
      default: () => {}
    },
    confirmData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      loading: false,
      selectedId: '', // 选中的id
      tableData: [], // 表单的数据
      type: [], // 有哪些tab 0-平台 1-部门 2-人
      tabType: '', // 0-平台 1-部门 2-人
      selectedOptions: [], // 选中的选项 id
      selectData: null, // 选中的选项 obj
      desc: '', // 派遣意见
      dialogHeaders: [
        { prop: 'name', label: '姓名', minwidth: '100' },
        {
          prop: 'department',
          label: '部门',
          minwidth: '120',
          labelCustomize: true,
          getLabel: (row) => row.department && row.department.join(',')
        },
        {
          prop: 'gridName',
          label: '所属网格',
          labelCustomize: true,
          minwidth: '130',
          getLabel: (row) => row.gridName && row.gridName.join(', ')
        },
        {
          prop: 'status',
          label: '微信是否激活',
          labelCustomize: true,
          minwidth: '100',
          getLabel: (row) => (row.status == 1 ? '是' : '否')
        },
        { prop: 'phoneNumber', label: '联系电话', minwidth: '100' }
      ],
      props: null,
      options: [],
      UpData: null
    }
  },
  computed: {
    menuId() {
      return this.$route.query.type || this.$route.params.id
    }
  },
  watch: {
    async tabType(val) {
      this.selectedOptions = []
      this.props = null
      this.options = []
      this.initProps(val)
    }
  },
  created() {
    if (this.commandData.action_level_to === 2) {
      this.initTab(this.commandData.matchedRules)
    } else {
      this.getUpdispatch()
    }
  },
  methods: {
    // 初始化tab
    initTab(val) {
      if (val && val.length) {
        // 平台部门人员  做个排序，用于tabs按循序排列
        this.type = val[0].to.type.sort((a, b) => a - b)
        this.tabType = val[0].to.type[0] + ''
      }
    },
    // 初始化props  type 0-平台 1-部门 2-人
    async initProps(type) {
      const eventStatus = this.confirmData.event_status
      const matchedRules = this.commandData.matchedRules[0]
      const crossLevel = Math.max(...matchedRules.to.level) - matchedRules.from.level
      if (type == 0) {
        this.initplatform(crossLevel, matchedRules, eventStatus)
      }
      if (type == 1) {
        this.initDepartment(crossLevel, matchedRules, eventStatus)
      }
      if (type == 2) {
        this.initPersonnel(crossLevel, matchedRules, eventStatus)
      }
    },
    // 初始化平台下拉框数据
    async initplatform(crossLevel, matchedRules, eventStatus) {
      // crossLevel 向下派遣在装配那边设置了不能向上级平台派遣所以小于0的情况不予考虑
      // 对于向下派遣也不存在同级之间相互派，所以等于0的情况不予考虑
      // 这里指平台派向平台，如果是部门派向平台，理论上不存在这种情况，现在予以屏蔽(matchedRules.from.type == 0)
      if (crossLevel > 0 && matchedRules.from.type == 0) {
        this.loading = true
        const parentCode = eventStatus[`meta_level${matchedRules.from.level + 1}`]
        this.props = {
          lazy: true,
          checkStrictly: true,
          value: 'code',
          label: 'name',
          lazyLoad: async (node, resolve) => {
            const { level, value } = node
            if (crossLevel > level) {
              const res = await getChildMeta({ parent_code: value || parentCode })

              // const res = await http.get('/api_v3/manage/meta/child-meta', {
              //   params: { parent_code: value || parentCode }
              // })
              const result = res.response.data.map((item) => {
                // 对于不是目标平台，disabled掉
                if (!matchedRules.to.level.includes(item.level)) {
                  return { disabled: 'disabled', ...item }
                } else {
                  return item
                }
              })
              this.loading = false
              resolve(result)
            } else {
              this.loading = false
              resolve([])
            }
          }
        }
      }
    },
    // 初始化部门下拉框数据
    initDepartment(crossLevel, matchedRules, eventStatus) {
      // 平台派部门情况
      if (matchedRules.from.type == 0) {
        this.loading = true
        const parentCode = eventStatus[`meta_level${matchedRules.from.level + 1}`]
        if (crossLevel > 0) {
          this.props = {
            lazy: true,
            checkStrictly: true,
            value: 'code',
            label: 'name',
            lazyLoad: async (node, resolve) => {
              const { level, value, data } = node
              let res
              let result
              if (data && data.selfType) {
                // res = await http.get('/api_v3/manage/meta/deps-by-parent', {
                //   params: { parent_code: value }
                // })
                res = await getDepsByParent({ parent_code: value })
                result =
                  res.response.data &&
                  res.response.data.map((item) => {
                    return {
                      ...item,
                      selfType: '1',
                      level: data.level,
                      self_parent_code: data.self_code || data.self_parent_code
                    }
                  })
                this.loading = false
                resolve(result)
                return
              }
              if (crossLevel > level) {
                // res = await http.get('/api_v3/manage/meta/child-meta', {
                //   params: { parent_code: value || parentCode }
                // })
                res = await getChildMeta({ parent_code: value || parentCode })
                result =
                  res.data.response.data &&
                  res.data.response.data.map((item) => {
                    // 对于平台，都要disabled掉，因为目标是部门
                    return { disabled: 'disabled', ...item }
                  })
                // 平台数组的第一位增加直属部门选项,需要当前的平台在matchedRules输出的平台中, selfType 用于标志是部门了，后续用于判断是否继续下拉子部门
                if (result && result.length && matchedRules.to.level.includes(result[0].level)) {
                  result.unshift({
                    code: value || parentCode,
                    name: '直属部门',
                    self_code: value || parentCode,
                    selfType: '2',
                    disabled: 'disabled',
                    level: (data && data.level) || matchedRules.from.level
                  })
                }
                this.loading = false
                resolve(result)
              } else {
                this.loading = false
                resolve([])
              }
            }
          }
          // crossLevel == 0
        } else {
          this.loading = true
          this.props = {
            lazy: true,
            checkStrictly: true,
            value: 'code',
            label: 'name',
            lazyLoad: async (node, resolve) => {
              const { value } = node
              // const res = await http.get('/api_v3/manage/meta/deps-by-parent', {
              //   params: { parent_code: value || parentCode }
              // })
              const res = await getDepsByParent({ parent_code: value || parentCode })
              const result =
                res.response.data &&
                res.response.data.map((item) => {
                  return {
                    ...item,
                    level: matchedRules.from.level,
                    self_code: eventStatus[`meta_level${matchedRules.from.level + 1}`]
                  }
                })
              this.loading = false
              resolve(result)
            }
          }
        }
        // 从部门到部门的情况，只会存在同级下拉子部门
      } else if (
        matchedRules.from.type == 1 &&
        matchedRules.to.level.includes(matchedRules.from.level)
      ) {
        this.loading = true
        const parentCode = eventStatus.department
        this.props = {
          lazy: true,
          checkStrictly: true,
          value: 'code',
          label: 'name',
          lazyLoad: async (node, resolve) => {
            const { value } = node
            // const res = await http.get('/api_v3/manage/meta/deps-by-parent', {
            //   params: { parent_code: value || parentCode }
            // })
            const res = await getDepsByParent({ parent_code: value || parentCode })
            const result =
              res.response.data &&
              res.response.data.map((item) => {
                return {
                  ...item,
                  level: matchedRules.from.level,
                  self_code: eventStatus[`meta_level${matchedRules.from.level + 1}`]
                }
              })
            this.loading = false
            resolve(result)
          }
        }
      }
    },
    // 初始化人员下拉框数据
    initPersonnel(crossLevel, matchedRules, eventStatus) {
      // 平台到人员的情况
      if (matchedRules.from.type == 0) {
        this.loading = true
        const parentCode = eventStatus[`meta_level${matchedRules.from.level + 1}`]
        if (crossLevel > 0) {
          this.props = {
            lazy: true,
            checkStrictly: true,
            value: 'code',
            label: 'name',
            lazyLoad: async (node, resolve) => {
              const { level, value, data } = node
              let res
              let result
              if (data && data.selfType) {
                // res = await http.get('/api_v3/manage/meta/deps-by-parent', {
                //   params: { parent_code: value }
                // })
                res = await getDepsByParent({ parent_code: value })
                result =
                  res.response.data &&
                  res.response.data.map((item) => {
                    return {
                      ...item,
                      selfType: '1',
                      level: data.level,
                      self_parent_code: data.self_code || data.self_parent_code
                    }
                  })
                this.loading = false
                resolve(result)
                return
              }
              if (crossLevel > level) {
                // res = await http.get('/api_v3/manage/meta/child-meta', {
                //   params: { parent_code: value || parentCode }
                // })
                res = await getChildMeta({ parent_code: value || parentCode })
                result = res.data.response.data.map((item) => ({ disabled: 'disabled', ...item }))
                // 平台数组的第一位增加直属部门选项,需要当前的平台在matchedRules输出的平台中, selfType 用于标志是部门了，后续用于判断是否继续下拉子部门
                if (result && result.length && matchedRules.to.level.includes(result[0].level)) {
                  result.unshift({
                    code: value || parentCode,
                    self_code: value || parentCode,
                    name: '直属',
                    selfType: '2',
                    level: (data && data.level) || matchedRules.from.level,
                    disabled: 'disabled'
                  })
                }
                this.loading = false
                resolve(result)
              } else {
                this.loading = false
                resolve([])
              }
            }
          }
        } else {
          this.props = {
            lazy: true,
            checkStrictly: true,
            value: 'code',
            label: 'name',
            lazyLoad: async (node, resolve) => {
              const { value } = node
              // const res = await http.get('/api_v3/manage/meta/deps-by-parent', {
              //   params: { parent_code: value || parentCode }
              // })
              const res = await getDepsByParent({ parent_code: value || parentCode })
              const result =
                res.response.data &&
                res.response.data.map((item) => {
                  return {
                    ...item,
                    level: matchedRules.from.level,
                    selfType: '1',
                    self_code: eventStatus[`meta_level${matchedRules.from.level + 1}`]
                  }
                })
              this.loading = false
              resolve(result)
            }
          }
        }
        // 从部门到人员的情况，只会存在同级下拉子部门
      } else if (
        matchedRules.from.type == 1 &&
        matchedRules.to.level.includes(matchedRules.from.level)
      ) {
        this.loading = true
        const parentCode = eventStatus.department
        this.props = {
          lazy: true,
          checkStrictly: true,
          value: 'code',
          label: 'name',
          lazyLoad: async (node, resolve) => {
            const { value } = node
            // const res = await http.get('/api_v3/manage/meta/deps-by-parent', {
            //   params: { parent_code: value || parentCode }
            // })
            const res = await getDepsByParent({ parent_code: value || parentCode })
            const result =
              res.response.data &&
              res.response.data.map((item) => {
                return {
                  ...item,
                  level: matchedRules.from.level,
                  selfType: '1',
                  self_code: eventStatus[`meta_level${matchedRules.from.level + 1}`]
                }
              })
            this.loading = false
            resolve(result)
          }
        }
      }
    },
    // 加载人员数据
    async midInitTable() {
      const roles = this.commandData.action_level_rule.rule_role
      let params = {}
      if (this.selectData && this.selectData.selfType == 1) {
        params = { departments: [this.selectData.id], roles }
      } else {
        params = { [`meta_level${this.selectData.level + 1}`]: this.selectData.code, roles }
      }
      // const res = await http.get('/api_v3/app/meta-data/users', {
      //   params: { page: this.currentPage, 'per-page': this.item, ...params }
      // })
      const res = await getUsers({ page: this.currentPage, 'per-page': this.item, ...params })
      this.tableData = res.response.items
      this.total = res.response._meta && res.response._meta.count
    },
    // 向上派遣的数据
    async getUpdispatch() {
      const eventStatus = this.confirmData.event_status
      let firstParent = '' // 获取第一次请求的parent_code
      // 取平台
      if (eventStatus.type == 0) {
        firstParent = eventStatus[`meta_level${+eventStatus.level + 1}`]
      }
      // 取部门
      if (eventStatus.type == 1) {
        firstParent = eventStatus.department
      }
      // const res = await http.get('/api_v3/manage/meta/parents', { params: { code: firstParent } })
      const res = await getParents({ code: firstParent })
      console.log(res, 'res')
      this.UpData = res.response.data && res.response.data[0]
    },
    // 下拉框选择
    async handleChange() {
      await this.$nextTick()
      this.selectData =
        this.$refs.cascader.getCheckedNodes()[0] && this.$refs.cascader.getCheckedNodes()[0].data
      console.log(this.selectData)
      if (this.selectData) {
        this.midInitTable()
      } else {
        this.tableData = []
        this.total = 0
      }
    },
    // 选择的切换
    radioChange(val) {
      console.log(val)
    },
    // 弹框确定的提交
    actionConfirm() {
      if (this.commandData.action_level_to === 2) {
        this.doDispatch()
      } else {
        this.doUpDispatch()
      }
    },
    // 向下派遣
    async doDispatch() {
      if (this.tabType != 2 && !this.selectedOptions.length) {
        this.$message.warning('请选择下级平台或部门或人员！')
        return
      }
      if (this.tabType == 2 && !this.selectedId) {
        this.$message.warning('请选择人员！')
        return
      }
      if (this.desc == '') {
        this.$message.warning('请输入派遣意见！')
        return
      }
      const form = [{ description: this.desc }]
      const to = [
        {
          type: this.tabType,
          level: this.selectData.level,
          area:
            this.tabType == 0
              ? this.selectData.code
              : this.selectData.self_code || this.selectData.self_parent_code,
          department:
            this.tabType == 1 || (this.selectData.selfType && this.tabType == 2)
              ? this.selectData.code
              : '',
          user_id: this.tabType == 2 ? this.selectedId.split('.')[1] : ''
        }
      ]
      const from = this.commandData.matchedRules[0].from
      const res = await handleCaseDispatch({
        eventId: this.confirmData.event.event_id,
        coopId: 0,
        menuId: this.menuId,
        form,
        action: this.commandData.id,
        to,
        from
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
      this.$message.success('派遣成功！')
      this.$emit('cancel')
      this.$emit('load-event')
      // http({
      //   method: 'post',
      //   url: '/api_v3/app/event/dispatch',
      //   data: {
      //     eventId: this.confirmData.event.event_id,
      //     coopId: 0,
      //     menuId: this.menuId,
      //     form,
      //     action: this.commandData.id,
      //     to,
      //     from
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
      //     this.$message.success('派遣成功！')
      //     this.$emit('cancel')
      //     this.$emit('load-event')
      //   })
      //   .catch(() => {
      //     this.loading = false
      //   })
    },
    // 向上派遣的提交
    async doUpDispatch() {
      if (this.desc == '') {
        this.$message.warning('请输入派遣意见！')
        return
      }
      const form = [{ description: this.desc }]
      const from = this.commandData.matchedRules[0].from
      const res = await handleCaseDispatch({
        eventId: this.confirmData.event.event_id,
        coopId: 0,
        menuId: this.menuId,
        form,
        action: this.commandData.id,
        to: [this.commandData.up[0].to],
        from
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
      this.$message.success('派遣成功！')
      this.$emit('cancel')
      this.$emit('load-event')
      // http({
      //   method: 'post',
      //   url: '/api_v3/app/event/dispatch',
      //   data: {
      //     eventId: this.confirmData.event.event_id,
      //     coopId: 0,
      //     menuId: this.menuId,
      //     form,
      //     action: this.commandData.id,
      //     to: [this.commandData.up[0].to],
      //     from
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
      //     this.$message.success('派遣成功！')
      //     this.$emit('cancel')
      //     this.$emit('load-event')
      //   })
      //   .catch(() => {
      //     this.loading = false
      //   })
    },
    getTabName(val) {
      switch (val) {
        case 0:
          return '平台'
        case 1:
          return '部门'
        case 2:
          return '人员'
        default:
          return ''
      }
    }
  }
}
</script>
<style lang="scss">
.row_wrap {
  margin-bottom: 20px;
  .row_label {
    line-height: 32px;
  }
  .el-tabs__header {
    background: #f8f8f8;
  }
  .el-tabs__item {
    padding: 0 30px !important;
    color: #999;
    &.is-active {
      color: #fff;
      background: #5b5bd5;
    }
  }
  .el-tabs__nav-wrap::after {
    background-color: rgba(91, 91, 213, 0.2);
  }
}
</style>
