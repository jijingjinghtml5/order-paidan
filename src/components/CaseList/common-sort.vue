<template>
  <el-popover
    v-model="sortVisible"
    placement="bottom-end"
    width="180"
    popper-class="cust-popover"
    @hide="hidePopover"
  >
    <el-radio-group v-model="sortTypeNew">
      <el-radio :label="'0'" class="cust-readio">倒序</el-radio>
      <el-radio :label="'1'" class="cust-readio">升序</el-radio>
    </el-radio-group>
    <div class="divide" />
    <el-radio-group v-model="sortKeyNew">
      <el-radio v-for="(value, key) in selectOption" :key="key" :label="key" class="cust-readio">{{
        value
      }}</el-radio>
    </el-radio-group>
    <div class="sort-button">
      <div class="cancel common-but" @click="sortChange(false)">取消</div>
      <div class="confirm common-but" style="" @click="sortChange(true)">确定</div>
    </div>
    <el-button slot="reference" class="sort">
      <svg-icon icon-class="sort" class-name="icon"
    /></el-button>
  </el-popover>
</template>
<script>
import { sortTimeType } from '@/constants/filter_var'

export default {
  props: {
    sortKey: {
      type: String,
      default: ''
    },
    sortType: {
      type: [Number, String],
      default: ''
    }
  },
  data() {
    return {
      sortVisible: false,
      sortTypeNew: this.sortType,
      sortKeyNew: this.sortKey,
      selectOption: sortTimeType
    }
  },
  methods: {
    sortChange(val) {
      this.sortVisible = false
      if (val) {
        this.$emit('sort-change', {
          sortKey: this.sortKeyNew,
          sortType: this.sortTypeNew
        })
      }
    },
    hidePopover() {
      this.sortKeyNew = this.sortKey
      this.sortTypeNew = this.sortType
    }
  }
}
</script>
<style lang="scss" scoped>
.icon {
  width: 18px;
  height: 18px;
}

.sort {
  width: 24px;
  height: 24px;
  padding: 0;
  background: #fff;
}
</style>
<style lang="scss">
.cust-popover {
  padding: 22px 0 0 0;
  width: 126px;
  background: #ffffff;
  box-shadow: 0px 2px 4px 0px rgba(63, 62, 62, 0.3);
  min-width: 126px;
  .cust-readio {
    width: 100%;
    margin: 0 13px 12px 13px;
    font-size: 12px;
    .el-radio__label {
      font-size: 12px;
    }
  }
  .sort-button {
    display: flex;
    justify-content: center;
    flex-direction: row;
    height: 30px;
  }
  .cancel {
    color: #7e8cff;
  }
  .divide {
    display: block;
    width: 100%;
    height: 1px;
    background-color: #dcdfe6;
    margin-bottom: 12px;
  }
  .confirm {
    background: #5b5bd5;
    color: #ffffff;
  }
  .common-but {
    width: 50%;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }
}
</style>
