<template>
  <div class="config">
    <div class="config-title">
      <div class="title">
        <span class="title-span">{{ title }}</span>
        <span class="triangle-right"></span>
      </div>
      <div>
        <el-button type="primary" @click="handleConfig">配 置</el-button>
      </div>
    </div>
    <global-table
      class="table"
      :selectable="false"
      :columns="columns"
      :max-height="4000"
      height="4000"
      :data="tableData"
      :pagination="false"
      :hasButtons="false"
      align="center"
    ></global-table>
    <global-dialog
      v-loading="loading"
      v-if="visible"
      :title="title"
      :visible.sync="visible"
      @confirm="handleConfirm"
      @cancel="visible = false"
    >
      <el-checkbox-group v-model="checkList">
        <el-checkbox :label="+item.id" v-for="item in dataList" :key="item.id">{{
          item.name
        }}</el-checkbox>
      </el-checkbox-group>
    </global-dialog>
  </div>
</template>

<script>
export default {
  name: 'Config',
  props: {
    title: {
      default: '查询配置',
      type: String
    },
    columns: {
      default: () => [],
      type: Array
    },
    dataList: {
      default: () => [],
      type: Array
    },
    data: {
      default: () => [],
      type: Array
    }
  },
  components: {},
  data() {
    return {
      visible: false,
      checkList: [],
      searchData: [], // 查询选中的配置项
      sortData: [], // 排序选中的配置项
      operationData: [], // 操作选中的配置项
      loading: false
    }
  },
  watch: {
    visible: {
      handler() {
        this.checkList = [...this.data]
      },
      immediate: true
    }
  },

  computed: {
    tableData() {
      return this.dataList.filter((item) => {
        return this.data.includes(+item.id)
      })
    }
  },
  methods: {
    handleConfig() {
      this.visible = true
    },
    handleConfirm() {
      switch (this.title) {
        case '查询配置':
          this.searchData = this.checkList
          this.$emit('config', this.searchData)
          break
        case '排序配置':
          this.sortData = this.checkList
          this.$emit('config', this.sortData)
          break
        case '操作配置':
          this.operationData = this.checkList
          this.$emit('config', this.operationData)
          break
        default:
          break
      }
      this.visible = false
    }
  }
}
</script>

<style scoped lang="scss">
.config {
  .config-title {
    display: flex;
    justify-content: space-between;
    .title {
      height: 28px;
      line-height: 28px;
      display: flex;
      .title-span {
        font-size: 14px;
        font-weight: 700;
        background: rgba($blue, 0.2);
        color: $wordcolor2;
        padding: 0 12px;
      }
      .triangle-right {
        width: 0;
        height: 0;
        border-top: 14px solid transparent;
        border-left: 20px solid rgba($blue, 0.2);
        border-bottom: 14px solid transparent;
      }
    }
  }
  .table {
    box-shadow: none;
    padding: 24px 0;
  }
}
</style>
