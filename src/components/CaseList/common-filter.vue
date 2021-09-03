<template>
  <div class="filter-wrap">
    <el-row>
      <!-- 关键词筛选 -->
      <el-col class="colBox">
        <el-input
          v-model.trim="formparams.fuzzySearchValue"
          size="mini"
          :placeholder="'请输入' + fuzzySearchMap[formparams.fuzzySearchType]"
          clearable
        >
          <el-select
            slot="prepend"
            v-model="formparams.fuzzySearchType"
            class="filter-item-select"
            placeholder="请选择"
          >
            <el-option label="案件编号" value="number" />
            <el-option label="案件名称" value="name" />
            <el-option label="地址" value="address" />
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="search" />
        </el-input>
      </el-col>
      <!-- 案件分类 -->
      <el-col class="colBox">
        <span class="filter-item-span">案件分类</span>
        <el-cascader
          v-model="formparams.caseType"
          :options="eventType"
          :props="{ label: 'name', value: 'name', checkStrictly: true }"
          class="input-width"
          clearable
          filterable
          placeholder="全部"
          size="mini"
          @change="caseTypeChange"
        />
      </el-col>
      <!-- 上报方式 -->
      <el-col class="colBox">
        <span class="filter-item-span">上报方式</span>
        <el-select
          v-model="formparams.submitType"
          class="input-width"
          clearable
          filterable
          placeholder="全部"
          size="mini"
          @change="search"
        >
          <el-option
            v-for="(item, index) in reportTypes"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-col>
      <!-- 案件来源 -->
      <el-col class="colBox">
        <span class="filter-item-span">案件来源</span>
        <el-select
          ref="selectOrigin"
          v-model="formparams.source"
          class="input-width"
          clearable
          collapse-tags
          multiple
          filterable
          placeholder="全部"
          size="mini"
          @visible-change="
            (v) => visibleChange(v, 'selectOrigin', selectOriginClickAll, selectOriginClickInvert)
          "
          @change="search"
        >
          <el-option
            v-for="(item, index) in eventSource"
            :key="index"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-col>

      <el-col class="colBox">
        <template v-if="filterTimeType && filterTimeType.length > 1">
          <el-select
            v-model="formparams.timeType"
            size="mini"
            placeholder=""
            class="filter-item-select"
            @change="search"
          >
            <el-option
              v-for="item in filterTimeType"
              :key="item"
              :label="filterTimeTypeList[item]"
              :value="item"
            />
          </el-select>
        </template>
        <template v-else>
          <span class="filter-item-span">{{ filterTimeTypeList[filterTimeType[0]] }}</span>
        </template>

        <el-date-picker
          v-model="formparams.dateRange"
          :clearable="true"
          :picker-options="pickerOptions"
          align="right"
          :class="filterTimeType && filterTimeType.length > 1 ? 'input-width-small' : 'input-width'"
          end-placeholder="结束"
          placement="bottom-start"
          range-separator="-"
          size="mini"
          start-placeholder="开始"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          @change="dateModeChange"
        />
      </el-col>

      <el-col style="width: 230px">
        <el-button size="mini" type="primary" @click="search">搜索</el-button>
        <el-button size="mini" type="primary" @click="clearSearch">重置</el-button>
        <template v-if="slotAfter">
          <slot name="filter-after" />
        </template>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import filterMixin from '@/mixins/filter'
import { filterTimeType } from '@/constants/filter_var'
import DateUtil from '@/utils/date'

export default {
  name: 'CommonFilter',
  components: {},
  mixins: [filterMixin],
  props: {
    slotAfter: {
      type: Boolean,
      default: false
    },
    /** 新版搜索 start */
    filterTimeType: {
      type: Array,
      default: () => ['eventTime']
    },
    pickerOptions: {
      type: Object,
      default: () => ({
        // onPick: ({ maxDate, minDate }) => {
        //  curMinDate = minDate
        //  curMaxDate = maxDate
        // },
        disabledDate: (time) => {
          // if(curMinDate){
          //   let range = 31 * 3 * 24 * 3600 * 1000
          //   return time.getTime() > Date.now() || time.getTime() > (curMinDate.getTime() + range) || time.getTime() < (curMinDate.getTime() - range)
          // }
          // return time.getTime() > Date.now()
          return time.getTime() > new Date(new Date().Format('yyyy-MM-dd 23:59:59')).getTime()
        },
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', [
                new Date().Format('yyyy-MM-dd 00:00:00'),
                new Date().Format('yyyy-MM-dd 23:59:59')
              ])
            }
          },
          {
            text: '本周',
            onClick(picker) {
              const weekStart = DateUtil.getStartDayOfWeek() + ' 00:00:00' // '本周开始时间'
              let weekEnd = DateUtil.getEndDayOfWeek() + ' 23:59:59' // '本周结束时间'
              // 考虑到今天还没到本周最后一天
              if (
                new Date(weekEnd).getTime() >
                new Date(new Date().Format('yyyy-MM-dd 23:59:59')).getTime()
              ) {
                weekEnd = new Date().Format('yyyy-MM-dd 23:59:59')
              }
              // console.log(weekStart, weekEnd)
              picker.$emit('pick', [weekStart, weekEnd])
            }
          },
          {
            text: '最近一周',
            onClick(picker) {
              picker.$emit('pick', [
                new Date(new Date().setDate(new Date().getDate() - 6)).Format(
                  'yyyy-MM-dd 00:00:00'
                ),
                new Date().Format('yyyy-MM-dd 23:59:59')
              ])
            }
          },
          {
            text: '本月',
            onClick(picker) {
              const monthStart = DateUtil.getStartDayOfMonth() + ' 00:00:00' // '本月开始时间'
              let monthEnd = DateUtil.getEndDayOfMonth() + ' 23:59:59' // '本月结束时间'
              // 考虑到今天还没到本月最后一天
              if (
                new Date(monthEnd).getTime() >
                new Date(new Date().Format('yyyy-MM-dd 23:59:59')).getTime()
              ) {
                monthEnd = new Date().Format('yyyy-MM-dd 23:59:59')
              }
              // console.log(start, end)
              picker.$emit('pick', [monthStart, monthEnd])
            }
          },
          {
            text: '最近一月',
            onClick(picker) {
              picker.$emit('pick', [
                new Date(new Date().setDate(new Date().getDate() - 30)).Format(
                  'yyyy-MM-dd 00:00:00'
                ),
                new Date().Format('yyyy-MM-dd 23:59:59')
              ])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              picker.$emit('pick', [
                new Date(new Date().setDate(new Date().getDate() - 90)).Format(
                  'yyyy-MM-dd 00:00:00'
                ),
                new Date().Format('yyyy-MM-dd 23:59:59')
              ])
            }
          },
          {
            text: '最近六个月',
            onClick(picker) {
              picker.$emit('pick', [
                new Date(new Date().setDate(new Date().getDate() - 180)).Format(
                  'yyyy-MM-dd 00:00:00'
                ),
                new Date().Format('yyyy-MM-dd 23:59:59')
              ])
            }
          }
        ]
      })
    }
  },
  data() {
    return {
      filterTimeTypeList: filterTimeType,
      // 搜索参数
      formparams: {
        fuzzySearchType: 'number', // 模糊搜索类型
        fuzzySearchValue: '', // 模糊搜索值
        caseType: [],
        submitType: '',
        timeType: this.filterTimeType[0],
        dateRange: [
          new Date(new Date().setDate(new Date().getDate() - 6)).Format('yyyy-MM-dd 00:00:00'),
          new Date().Format('yyyy-MM-dd 23:59:59')
        ]
      },
      // 模糊搜索类型对应map
      fuzzySearchMap: {
        number: '案件编号',
        name: '案件名称',
        address: '地址'
      },
      fuzzySearchMapKey: {
        number: 'code',
        name: 'order_name',
        address: 'address'
      }
    }
  },
  computed: {
    ...mapGetters(['eventType', 'reportTypes', 'eventSource'])
  },
  watch: {},
  mounted() {},
  methods: {
    // 切换时间
    dateModeChange(val) {
      console.log(val, 'val')
      if (val == null) {
        this.formparams.dateRange = [
          new Date(new Date().setDate(new Date().getDate() - 6)).Format('yyyy-MM-dd 00:00:00'),
          new Date().Format('yyyy-MM-dd 23:59:59')
        ]
      }
      this.search()
    },
    // 分类变化
    caseTypeChange() {
      this.search()
    },
    // 全选
    selectOriginClickAll() {
      this.formparams.source = this.eventSource.map((item) => item.id)
      this.search()
    },
    // 反选
    selectOriginClickInvert() {
      const source = this.eventSource.filter((item) => this.formparams.source.indexOf(item.id) < 0)
      this.formparams.source = source.map((item) => item.id)
      this.search()
    },
    // 重置
    clearSearch() {
      this.formparams = {
        fuzzySearchType: 'number', // 模糊搜索类型
        fuzzySearchValue: '', // 模糊搜索值
        caseType: [],
        submitType: '',
        timeType: this.filterTimeType[0],
        dateRange: [
          new Date(new Date().setDate(new Date().getDate() - 6)).Format('yyyy-MM-dd 00:00:00'),
          new Date().Format('yyyy-MM-dd 23:59:59')
        ]
      }
      this.search()
    },
    // 搜索
    search() {
      const params = this.handleParams(this.formparams)
      this.$emit('search-submit', params)
    },
    // 处理搜索条件数据
    handleParams() {
      const formParams = JSON.parse(JSON.stringify(this.formparams))
      // code: formParams.fuzzySearchType === 'number' ? formParams.fuzzySearchValue : '',
      //   order_name: formParams.fuzzySearchType === 'name' ? formParams.fuzzySearchValue : '',
      //   address: formParams.fuzzySearchType === 'address' ? formParams.fuzzySearchValue : '',

      const newParams = {
        [this.fuzzySearchMapKey[formParams.fuzzySearchType]]: formParams.fuzzySearchValue || '',
        eventTypes: formParams.caseType.join(','),
        [formParams.timeType]: [
          new Date(formParams.dateRange[0]).getTime() / 1000,
          new Date(formParams.dateRange[1]).getTime() / 1000
        ],
        ...formParams
      }
      // 处理时间
      delete newParams.timeType
      delete newParams.dateRange
      // 处理分类
      delete newParams.caseType
      // 处理关键字
      delete newParams.fuzzySearchType
      delete newParams.fuzzySearchValue
      return newParams
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-wrap {
  padding: 20px 10px 10px;
  border-radius: 2px;
  box-sizing: border-box;
  background: #fff;
  .filter-item-span {
    font-size: 14px;
    width: 60px;
    display: inline-block;
  }
  .filter-item-select {
    font-size: 14px;
    width: 110px;
    display: inline-block;
    ::v-deep .el-input__inner {
      font-size: 12px;
    }
  }
  .row-bg {
    margin-bottom: 8px;
  }
}
.filter-wrap .input-width {
  width: calc(100% - 66px);
}
.filter-wrap .input-width-small {
  width: calc(100% - 116px);
}

.filter-wrap .input-width-small2 {
  width: calc(100% - 96px);
}

.colBox {
  height: 30px;
  margin-bottom: 8px;
}
@media screen and (min-width: 1680px) {
  .colBox {
    width: 20% !important;
    max-width: 330px !important;
  }
}
@media screen and (min-width: 1280px) and (max-width: 1680px) {
  .colBox {
    width: 25% !important;
  }
}
@media screen and (min-width: 960px) and (max-width: 1280px) {
  .colBox {
    width: 33% !important;
  }
}
@media screen and (min-width: 600px) and (max-width: 960px) {
  .colBox {
    width: 50% !important;
  }
}
@media screen and (max-width: 600px) {
  .colBox {
    width: 100% !important;
  }
}
</style>
