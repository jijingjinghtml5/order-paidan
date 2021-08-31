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

export default {
  name: 'CommonFilter',
  components: {},
  mixins: [filterMixin],
  props: {
    slotAfter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      // 搜索参数
      formparams: {
        fuzzySearchType: 'number', // 模糊搜索类型
        fuzzySearchValue: '', // 模糊搜索值
        caseType: [],
        submitType: ''
      },
      fuzzySearchMap: {
        number: '案件编号',
        name: '案件名称',
        address: '地址'
      }
    }
  },
  computed: {
    ...mapGetters(['eventType', 'reportTypes', 'eventSource'])
  },
  watch: {},
  mounted() {},
  methods: {
    // 重置
    clearSearch() {
      this.formparams = {
        fuzzySearchType: 'number', // 模糊搜索类型
        fuzzySearchValue: '', // 模糊搜索值
        caseType: [],
        submitType: ''
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
      const newParams = {
        code: formParams.fuzzySearchType === 'number' ? formParams.fuzzySearchValue : '',
        order_name: formParams.fuzzySearchType === 'name' ? formParams.fuzzySearchValue : '',
        address: formParams.fuzzySearchType === 'address' ? formParams.fuzzySearchValue : '',
        eventTypes: formParams.caseType.join(','),
        ...formParams
      }
      delete newParams.caseType
      delete newParams.fuzzySearchType
      delete newParams.fuzzySearchValue
      return newParams
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
