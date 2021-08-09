<template>
  <div class="source">
    <global-search>
      <template #operate>
        搜索：
        <el-input
          placeholder="请输入名称"
          style="width: 200px"
          v-model.trim="listQuery.name"
          clearable
          @keyup.enter.native="searchData"
        >
        </el-input>
        <el-button type="primary" @click="searchData" style="margin-left: 12px">查询</el-button>
        <el-button @click="handleReset">重置</el-button>
      </template>
    </global-search>
    <global-table
      :selectable="false"
      v-loading="loading"
      :columns="columns"
      :data="tableData"
      :pagination="false"
    >
      <template v-slot:buttons>
        <div class="buttons">
          <el-button type="primary" icon="el-icon-plus" @click="handleCreate">新 建</el-button>
        </div>
      </template>
    </global-table>
    <the-dialog
      v-if="visibleDialog"
      :title="tempMap[dialogStatus]"
      :edit-info="editInfo"
      :visible.sync="visibleDialog"
      @confirm-sure="handleConfirm"
      :dialog-status="dialogStatus"
      :report-options="reportOptions"
      :discover-options="discoverOptions"
      :event-options="eventOptions"
      :sources-options="sourcesOptions"
      :card-options="cardOptions"
      :detail-options="detailOptions"
      :print-options="printOptions"
    >
    </the-dialog>
  </div>
</template>

<script>
import { getManageElements } from '@/api/case'

import {
  getManageBusinesss,
  getReportTypes,
  getDiscoverTypes,
  getEventTypes,
  getSourcesTypes,
  deleteManageBusinesss
} from '@/api/views'
import TheDialog from './components/TheDialog'

export default {
  name: '',
  components: {
    TheDialog
  },

  data() {
    return {
      columns: [
        { prop: 'id', label: '序号' },
        { prop: 'name', label: '组合名称' },
        {
          prop: 'event_type_1',
          label: '案件分类',
          width: 200,
          labelCustomize: true,
          getLabel: (row) => {
            let index = 0
            const result = []
            const temp = [row.event_type_1, row.event_type_2, row.event_type_3, row.event_type_4]
            function findType(options) {
              const findItem = options.find((item) => {
                return item.code == temp[index]
              })
              if (findItem) {
                result[index] = findItem.name
                index += 1
                if (findItem.children) {
                  findType(findItem.children)
                }
              }
            }
            findType(this.eventOptions)
            return result.join('-')
          }
        },
        {
          prop: 'source',
          label: '案件来源',
          labelCustomize: true,
          getLabel: (row) => {
            const find = this.sourcesOptions.find((i) => i.id == row.source)
            return find ? find.name : ''
          }
        },
        {
          prop: 'report',
          label: '上报方式',
          labelCustomize: true,
          getLabel: (row) => {
            const find = this.discoverOptions.find((i) => i.id == row.discover)
            return find ? find.name : ''
          }
        },
        {
          prop: 'discover',
          label: '发现方式',
          labelCustomize: true,
          getLabel: (row) => {
            const find = this.reportOptions.find((i) => i.id == row.report)
            return find ? find.name : ''
          }
        },
        {
          prop: 'link_prints',
          label: '打印模板',
          labelCustomize: true,
          getLabel: (row) => {
            const find = this.printOptions.find((i) => i.id == row.link_prints)
            return find ? find.name : ''
          }
        },
        {
          prop: 'link_cards',
          label: '卡片模板',
          labelCustomize: true,
          getLabel: (row) => {
            const find = this.cardOptions.find((i) => i.id == row.link_cards)
            return find ? find.name : ''
          }
        },
        {
          prop: 'link_infos',
          label: '详情模板',
          labelCustomize: true,
          getLabel: (row) => {
            const find = this.detailOptions.find((i) => i.id == row.link_infos)
            return find ? find.name : ''
          }
        },
        {
          label: '操作',
          width: 140,
          fixed: 'right',
          actions: [
            {
              id: 'detail',
              text: '详情',
              click: this.handleDetail
            },
            {
              id: 'edit',
              text: '编辑',
              click: this.handleEdit
            },
            {
              id: 'delete',
              text: '删除',
              click: this.handleDelete
            }
          ]
        }
      ],
      dialogStatus: 'create',
      tempMap: {
        create: '新建',
        update: '编辑',
        detail: '详情'
      },
      editInfo: {}, // 编辑带给弹框的值
      visibleDialog: false,
      tableData: [],
      loading: false,
      reportOptions: [],
      discoverOptions: [],
      eventOptions: [],
      sourcesOptions: [],
      cardOptions: [],
      detailOptions: [],
      printOptions: [],
      requestSelect: false,
      listQuery: { name: '' }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 列表
    async fetchData() {
      this.loading = true
      if (!this.requestSelect) {
        await this.getAllSelectsOptions()
      }
      getManageBusinesss(this.listQuery)
        .then((res) => {
          const response = res.response[0]
          console.log(res)
          this.tableData = response.data
        })
        .finally(() => {
          this.loading = false
        })
    },
    // 下拉
    getAllSelectsOptions() {
      return new Promise((resolve) => {
        Promise.all([
          getReportTypes(),
          getDiscoverTypes(),
          getEventTypes(),
          getSourcesTypes(),
          getManageElements({ type: 5 }),
          getManageElements({ type: 6 }),
          getManageElements({ type: 7 })
        ]).then((value) => {
          this.reportOptions = value[0].response.data
          this.discoverOptions = value[1].response.data
          this.eventOptions = value[2].response.data
          this.sourcesOptions = value[3].response.data
          this.cardOptions = value[4].response[0].data.map((item) => {
            // eslint-disable-next-line no-param-reassign
            item.id = parseInt(item.id, 10)
            return item
          })
          this.detailOptions = value[5].response[0].data.map((item) => {
            // eslint-disable-next-line no-param-reassign
            item.id = parseInt(item.id, 10)
            return item
          })
          this.printOptions = value[6].response[0].data.map((item) => {
            // eslint-disable-next-line no-param-reassign
            item.id = parseInt(item.id, 10)
            return item
          })
          // 案件分裂 保留四层
          this.eventOptions.forEach((item) => {
            const resChild = item.children
            if (resChild && resChild.length) {
              resChild.forEach((node) => {
                const nodeChild = node.children
                if (nodeChild && nodeChild.length) {
                  nodeChild.forEach((obj) => {
                    const objChild = obj.children
                    if (objChild && objChild.length) {
                      objChild.forEach((i) => {
                        // eslint-disable-next-line no-param-reassign
                        i.children = false
                      })
                    }
                  })
                }
              })
            }
          })
          this.requestSelect = true
          resolve()
        })
      })
    },
    // 筛选
    searchData() {
      this.fetchData()
    },
    // 新建
    handleCreate() {
      this.editInfo = {}
      this.dialogStatus = 'create'
      this.visibleDialog = true
    },
    // 编辑
    handleEdit({ row }) {
      this.editInfo = { ...row }
      this.dialogStatus = 'update'
      this.visibleDialog = true
    },
    // 详情
    handleDetail({ row }) {
      this.editInfo = { ...row }
      this.dialogStatus = 'detail'
      this.visibleDialog = true
    },
    // 删除
    handleDelete({ row }) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteManageBusinesss({ id: row.id }).then(() => {
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            this.fetchData()
          })
        })
        .catch(() => {})
    },
    // 重置
    handleReset() {
      this.listQuery = {
        name: ''
      }
      this.fetchData()
    },
    // 确定
    handleConfirm() {
      this.visibleDialog = false
      this.fetchData()
    }
  }
}
</script>

<style scoped></style>
