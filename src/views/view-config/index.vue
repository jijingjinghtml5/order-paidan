<template>
  <div class="view-config" v-loading="loading">
    <!--菜单-->
    <config-tree
      ref="configTreeRef"
      class="config-tree"
      :has-append-btn="false"
      :has-right-context-menu="false"
      :data="data"
      :current-node-key.sync="currentNodeKey"
      @node-click="nodeClick"
    >
    </config-tree>
    <!--表单-->
    <div class="config-content" v-if="currentMenu">
      <transition name="fade-transform" appear>
        <div v-show="canConfig">
          <div class="config-content-title">
            <h4>{{ currentMenu.name }}（code: {{ currentMenu.code }}）</h4>
            <div>
              <el-button type="primary" @click="handleSubmit">提 交</el-button>
            </div>
          </div>
          <div class="config-content-scroll">
            <el-form
              ref="form"
              :model="currentMenu"
              label-width="140px"
              class="config-content-form"
              label-position="left"
            >
              <el-form-item label="关联案件状态">
                <el-select
                  ref="selectOrigin"
                  v-model="currentMenu.link_status"
                  multiple
                  collapse-tags
                  placeholder="请选择"
                  clearable
                  style="width: 200px"
                  @visible-change="
                    (v) =>
                      visibleChange(
                        v,
                        'selectOrigin',
                        selectOriginStatusClickAll,
                        selectOriginStatusClickInvert
                      )
                  "
                >
                  <el-option
                    :label="item.name"
                    :value="+item.id"
                    v-for="item in statusList"
                    :key="item.id"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="关联案件标签">
                <el-select
                  ref="selectOriginTags"
                  v-model="currentMenu.link_tags"
                  multiple
                  collapse-tags
                  placeholder="请选择"
                  clearable
                  style="width: 200px"
                  @visible-change="
                    (v) =>
                      visibleChange(
                        v,
                        'selectOriginTags',
                        selectOriginTagsClickAll,
                        selectOriginTagsClickInvert
                      )
                  "
                >
                  <el-option
                    :label="item.name"
                    :value="+item.id"
                    v-for="item in tagsList"
                    :key="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-form>
            <!--tabs-->
            <el-tabs v-model="activeTabName">
              <el-tab-pane label="省级" name="level1"> </el-tab-pane>
              <el-tab-pane label="市级" name="level2"></el-tab-pane>
              <el-tab-pane label="区级" name="level3"></el-tab-pane>
              <el-tab-pane label="街道" name="level4"></el-tab-pane>
              <el-tab-pane label="居村委" name="level5"></el-tab-pane>
            </el-tabs>
            <config
              :key="Math.random()"
              title="查询配置"
              :columns="searchColumns"
              :data-list="searchListData"
              :data="currentMenu[activeTabName].link_filters"
              @config="searchConfig"
            ></config>
            <config
              :key="Math.random()"
              title="排序配置"
              :columns="sortColumns"
              :data-list="sortListData"
              :data="currentMenu[activeTabName].link_sorts"
              @config="sortConfig"
            ></config>
            <config
              :key="Math.random()"
              title="操作配置"
              :columns="operationColumns"
              :data-list="operationListData"
              :data="currentMenu[activeTabName].link_actions"
              @config="operationConfig"
            ></config>
          </div>
        </div>
      </transition>
      <div v-show="!canConfig" class="config-content-empty">无配置项</div>
    </div>
  </div>
</template>

<script>
import ConfigTree from '@/components/ConfigTree/index'
import { getAssembles, setAssembles } from '@/api/view-config'
import { getManageElements } from '@/api/case'
import { getFirstChild } from '@/utils/index'
import methodsMixin from '../mixin/methods'
import Config from './config'

const LEVELList = ['level1', 'level2', 'level3', 'level4', 'level5']
const LEVELATTRS = ['link_filters', 'link_sorts', 'link_actions']

export default {
  name: 'ViewConfig',
  mixins: [methodsMixin],
  components: {
    ConfigTree,
    Config
  },
  data() {
    return {
      currentNodeKey: '', // 当前选中的key
      currentMenu: {
        level1: {},
        level2: {},
        level3: {},
        level4: {},
        level5: {}
      }, // 当前选中菜单的数据
      canConfig: false, // 是否可以配置
      data: [], // 菜单数据
      activeTabName: 'level1', // 当前激活的tab
      searchColumns: [
        { prop: 'name', label: '查询条件', width: '150px' },
        { prop: 'code', label: '字段' }
      ],
      sortColumns: [
        { prop: 'name', label: '排序名称', width: '150px' },
        { prop: 'code', label: '字段' }
      ],
      operationColumns: [
        { prop: 'name', label: '操作名称', width: '150px' },
        { prop: 'code', label: 'code' },
        { prop: 'type', label: '操作类型' },
        { prop: 'state', label: '展示类型' },
        { prop: 'url', label: '关联URL' }
      ],
      statusList: [],
      tagsList: [],
      searchListData: [],
      sortListData: [],
      operationListData: [],
      searchData: [],
      loading: false,
      operationTypeMap: {
        3: '内置操作',
        4: '流转操作'
      }
    }
  },
  computed: {},
  created() {
    this.initMenu()
    this.initData()
  },
  methods: {
    // 初始化菜单
    async initMenu() {
      this.loading = true
      const {
        response: { data }
      } = await getAssembles()
      this.loading = false
      this.data = this.formmateData(data)
      // 获取第一个最终节点，并高亮展示
      const firstChild = getFirstChild(this.data)
      if (firstChild) {
        this.currentNodeKey = firstChild.ext
        this.currentMenu = firstChild
        this.canConfig = true
        await this.$nextTick()
        const tree = this.$refs.configTreeRef.$refs.tree
        tree.setCurrentKey(this.currentNodeKey)
      }
    },
    // 2：状态，4：操作 ，10：筛选，11：排序，13：标签，
    initData() {
      Promise.allSettled([
        getManageElements({ type: 2 }),
        getManageElements({ type: [3, 4, 12] }),
        getManageElements({ type: 10 }),
        getManageElements({ type: 11 }),
        getManageElements({ type: 13 })
      ])
        .then((res) => {
          this.statusList = res[0].value.response[0].data
          this.operationListData = res[1].value.response[0].data
          this.searchListData = res[2].value.response[0].data
          this.sortListData = res[3].value.response[0].data
          this.tagsList = res[4].value.response[0].data

          this.handlerOperationList()
        })
        .catch(() => {
          console.log('获取数据失败')
        })
    },
    handlerOperationList() {
      this.operationListData.map((item) => {
        const copyItem = item
        const type = Number(copyItem.type)
        copyItem.type = this.operationTypeMap[type]
        return copyItem
      })
    },
    // 点击菜单
    nodeClick(data) {
      this.currentMenu = data
      console.log(data)
      if (this.currentMenu.children && this.currentMenu.children.length) {
        this.canConfig = false
      } else {
        this.canConfig = true
      }
    },
    searchConfig(val) {
      // if (this.currentMenu[this.activeTabName]) {
      //   this.currentMenu[this.activeTabName].link_filters = val
      // } else {
      //   this.currentMenu[this.activeTabName] = {}
      //   this.currentMenu[this.activeTabName].link_filters = val
      // }
      this.currentMenu[this.activeTabName].link_filters = val
    },
    sortConfig(val) {
      // if (this.currentMenu[this.activeTabName]) {
      //   this.currentMenu[this.activeTabName].link_sorts = val
      // } else {
      //   this.currentMenu[this.activeTabName] = {}
      //   this.currentMenu[this.activeTabName].link_sorts = val
      // }
      this.currentMenu[this.activeTabName].link_sorts = val
    },
    operationConfig(val) {
      // if (this.currentMenu[this.activeTabName]) {
      //   this.currentMenu[this.activeTabName].link_actions = val
      // } else {
      //   this.currentMenu[this.activeTabName] = {}
      //   this.currentMenu[this.activeTabName].link_actions = val
      // }
      this.currentMenu[this.activeTabName].link_actions = val
    },
    // 点击提交当前菜单
    handleSubmit() {
      this.$confirm('确定提交吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.submit()
        })
        .catch(() => {})
    },
    submit() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          this.loading = true
          setAssembles(this.currentMenu.id, { data: JSON.stringify(this.currentMenu) })
            .then((res) => {
              this.loading = false
              if (res.status === 1) {
                this.$message({
                  type: 'success',
                  message: '提交成功！'
                })
              }
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          this.$message({
            type: 'warning',
            message: '案件状态未选择！'
          })
        }
      })
    },
    selectOriginStatusClickAll() {
      this.currentMenu.link_status = this.statusList.map((item) => +item.id)
    },
    selectOriginStatusClickInvert() {
      const linkStatus = this.statusList.filter(
        (item) => this.currentMenu.link_status.indexOf(+item.id) < 0
      )
      this.currentMenu.link_status = linkStatus.map((item) => +item.id)
    },
    selectOriginTagsClickAll() {
      this.currentMenu.link_tags = this.tagsList.map((item) => +item.id)
    },
    selectOriginTagsClickInvert() {
      const linkTags = this.tagsList.filter(
        (item) => this.currentMenu.link_tags.indexOf(+item.id) < 0
      )
      this.currentMenu.link_tags = linkTags.map((item) => +item.id)
    },
    formmateData(data) {
      return data.map((item) => {
        const thunk = item
        if (thunk.children && thunk.children.length > 0) {
          thunk.children = this.formmateData(thunk.children)
        } else {
          LEVELList.forEach((levelKey) => {
            if (Object.prototype.hasOwnProperty.call(thunk, levelKey)) {
              LEVELATTRS.forEach((attrs) => {
                if (!thunk[levelKey][attrs]) {
                  thunk[levelKey][attrs] = []
                }
              })
            }
          })
        }
        return thunk
      })
    }
  }
}
</script>

<style scoped lang="scss">
.view-config {
  max-height: calc(100vh - 90px);
  height: calc(100vh - 90px);
  display: flex;
  .config-tree {
    background: $bgwhite;
    margin-right: 17px;
    min-width: 200px;
    border-right: 1px solid $borderColor;
    @include boxShadow(0.08);
  }
  .config-content {
    max-height: calc(100vh - 90px);
    background: $bgwhite;
    flex: 1;
    padding: 13px 24px 24px;
    border-radius: 4px;
    overflow: auto;
    @include boxShadow(0.08);
    @include scrollBar;
    .config-content-title {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid rgba($blue, 0.2);
      button {
        margin-top: 6px;
      }
    }
    .config-content-form {
      padding: 24px 0 0 0;
    }
  }
  .config-content-empty {
    padding: 64px;
    text-align: center;
    color: $wordcolor4;
  }
}
</style>
<style lang="scss">
.view-config {
  .el-tabs__header {
    background: #f8f8f8;
  }
  .el-tabs__item {
    padding: 0 30px !important;
    color: $wordcolor4;
    &.is-active {
      color: $white;
      background: $blue;
    }
  }
  .el-tabs__nav-wrap::after {
    background-color: rgba($blue, 0.2);
  }
}
</style>
