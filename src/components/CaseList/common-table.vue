<template>
  <div v-loading="loading">
    <!-- :row-class-name="getClass" -->
    <el-table
      :data="tableData"
      stripe
      :max-height="setHeight"
      style="width: 100%"
      :border="border"
      :cell-style="cellStyle"
      :header-cell-style="headerCellStyle"
      size="medium"
      :row-class-name="getClass"
      :default-sort="{ prop: sortKey, order: sortType == 1 ? 'ascending' : 'descending' }"
      @sort-change="sortChange"
      @row-click="rowClick"
    >
      <slot name="first-columns" />
      <template v-for="item in tableHead">
        <!-- labelCustomize 是否开启单元格内容自定义，用 getLabel 回调传入，开启 labelIsHtml 可传入 html 结构；
             columnsShowCustomize 是否开启展示列自定义功能，开启后需传入要展示的列名 columnShowList
         -->
        <!-- 案件历史查询单独处理  -->
        <el-table-column
          v-if="fromCaseHistory"
          :key="item.prop"
          :width="item.width"
          :prop="item.prop"
          :fixed="item.fixed"
          :resizable="item.resizable || false"
          :min-width="item.minwidth"
          :sortable="item.sortable"
          :label="item.label"
        >
          <template slot-scope="scope">
            <text-tooltip
              class="wid100 content-cell"
              title=""
              :content="scope.row[item.prop]"
              :ref-name="scope.$index + item.prop"
            />
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="
            item.labelCustomize &&
            (!columnsShowCustomize || columnShowList.indexOf(item.label) != -1)
          "
          :key="item.prop"
          :width="item.width"
          :prop="item.prop"
          :fixed="item.fixed"
          :resizable="item.resizable || false"
          show-overflow-tooltip
          :min-width="item.minwidth"
          :sortable="item.sortable"
          :label="item.label"
        >
          <template slot-scope="scope">
            <!-- eslint-disable-next-line -->
            <div v-if="item.labelIsHtml" v-html="item.getLabel(scope.row || {})" />
            <span v-else>{{ item.getLabel(scope.row || {}) }}</span>
          </template>
        </el-table-column>
        <el-table-column
          v-else-if="!columnsShowCustomize || columnShowList.indexOf(item.label) != -1"
          :key="item.prop"
          :width="item.width"
          :prop="item.prop"
          :fixed="item.fixed"
          :resizable="item.resizable || false"
          show-overflow-tooltip
          :min-width="item.minwidth"
          :sortable="item.sortable"
          :label="item.label"
        />
      </template>
      <slot name="last-columns" />
    </el-table>
    <div style="margin-top: 10px; text-align: right">
      <el-pagination
        v-if="!loading"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script>
import TextTooltip from '@/components/TextTooltip'
/**
 * sortKey  选中的当前的排序类型，从父组件来是为了列表和卡片模式同步
 * sortType 选中的当前的排序值，从父组件来是为了列表和卡片模式同步
 */
export default {
  components: {
    TextTooltip
  },
  props: {
    tableData: {
      type: Array,
      default: () => []
    },
    sortKey: {
      type: String,
      default: ''
    },
    sortType: {
      type: [Number, String],
      default: ''
    },
    border: {
      type: Boolean,
      default: false
    },
    tableHead: {
      type: Array,
      default: () => []
    },
    setHeight: {
      type: [Number, String],
      default: '100%'
    },
    loading: {
      type: Boolean,
      default: false
    },
    isPage: {
      type: Boolean,
      default: true
    },
    currentPage: {
      type: [Number, String],
      default: 1
    },
    pageSize: {
      type: [Number, String],
      default: 10
    },
    total: {
      type: [Number, String],
      default: 0
    },
    columnsShowCustomize: {
      type: Boolean,
      default: false
    },
    fromCaseHistory: {
      type: Boolean,
      default: false
    },
    columnShowList: {
      type: Array,
      default: () => []
    },
    headerCellStyle: {
      type: Object,
      default: () => {}
    },
    cellStyle: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    getClass(scope) {
      // if (this.$route.name == 'inspection-search' && scope.row.superviseFound === true) {
      //   return 'supervise-found'
      // } else if (this.$route.name == 'inspection-search' && scope.row.superviseFound === false) {
      //   return 'supervise-nofound'
      // }
      if (scope.row.is_gray === true) return 'has_gray'
    },
    sortChange(a) {
      console.log(a, 'a')
      this.$emit('sort-change', {
        sortKey: a.prop,
        sortType: a.order === 'ascending' ? '1' : '0'
      })
    },
    sizeChange(size) {
      this.$emit('size-change', size)
    },
    currentChange(page) {
      this.$emit('current-change', page)
    },
    rowClick(row) {
      this.$emit('rowClick', row)
    }
  }
}
</script>

<style lang="scss">
.el-table--medium td {
  padding: 0;
  height: 46px;
}
.el-tooltip__popper {
  max-width: 500px;
}
/* .el-table--medium th, .el-table--medium td {
  text-align: center;
} */
.el-table__empty-text {
  width: 100%;
  text-align: left;
  padding-left: calc(50vw - 200px);
  box-sizing: border-box;
}
.supervise-found {
  position: relative;
  display: block;
}
.supervise-found::after {
  content: '';
  // background-image: url('../../assets/images/source7.png');
  background-size: 100%;
  position: absolute;
  width: 50px;
  height: 40px;
  z-index: 100;
  right: 50%;
  bottom: 0;
}
.has_gray {
  color: #aaa !important;
}
</style>
