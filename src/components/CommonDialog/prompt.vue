<template>
  <el-dialog
    v-if="visible"
    v-dialogDrag
    width="400px"
    :visible="visible"
    :append-to-body="true"
    :title="title"
    class="prompt-dialog"
    @close="cancel"
  >
    <!-- v-loading="loading" -->
    <div class="info">
      <div v-if="!isConfirm" class="line">
        <el-input
          ref="autoInput"
          v-model="promptDesc"
          type="text"
          :clearable="true"
          :placeholder="placeDesc"
        />
      </div>
      <div v-else class="line" :class="titIcon ? 'el-icon-' + titIcon : ''">
        <span>{{ promptDesc }}</span>
      </div>
      <div style="padding-top: 20px; text-align: right">
        <el-checkbox v-if="extraMess.isNeedAgain" v-model="backAgain" style="margin-right: 5px">
          不允许再次退单</el-checkbox
        >
        <el-button :disabled="promptLoading" @click="cancel">{{ cancelButtonText }}</el-button>
        <case-el-button
          v-if="needCaseElButton"
          v-preventReClick
          type="primary"
          :resolve="resolve"
          :case-data="promptCurrData"
          :loading="promptLoading"
          @click="submit"
          >{{ confirmButtonText }}</case-el-button
        >
        <el-button
          v-else
          v-preventReClick
          type="primary"
          :loading="promptLoading"
          @click="submit"
          >{{ confirmButtonText }}</el-button
        >
      </div>
    </div>
  </el-dialog>
</template>
<script>
/**
 * prompt 改写成 el-dialog
 * visible 弹窗是否显示
 * title 弹窗的标题
 * confirmButtonText 确认按钮文案
 * cancelButtonText 取消按钮文案
 * $emit('confirmFun') 触发成功事件
 * $emit('cancelFun') 触发取消事件
 * promptType 确定触发的方法名
 * isConfirm 是不是confirm类型的弹窗，confirm类型的就展示默认提示语，不需要输入
 * placeDesc 输入框占位语
 * defaultDesc 默认提示语
 * promptLoading 确定按钮的loading
 * extraMess 额外记录的信息
 * titIcon icon图标
 * needCaseElButton 是否需要锁的按钮
 * promptCurrData 锁的案件数据
 */
// import { lockMixins } from '@/mixins'

export default {
  name: 'CommonPrompt',
  // mixins: [lockMixins],
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    isConfirm: {
      type: Boolean,
      default: false
    },
    titIcon: {
      type: String,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    confirmButtonText: {
      type: String,
      default: '确定'
    },
    cancelButtonText: {
      type: String,
      default: '取消'
    },
    promptType: {
      type: String,
      default: ''
    },
    placeDesc: {
      type: String,
      default: ''
    },
    defaultDesc: {
      type: String,
      default: ''
    },
    extraMess: {
      type: Object,
      default: () => {}
    },
    promptCurrData: {
      type: Object,
      default: () => {}
    },
    promptLoading: {
      type: Boolean,
      default: false
    },
    needCaseElButton: {
      type: Boolean,
      default: false
    },
    resolve: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      promptDesc: '',
      backAgain: false
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.promptDesc = this.defaultDesc
        this.backAgain = false
        // 如果不是confirm类型的，是prompt需要输入的，就自动获取焦点
        if (!this.isConfirm) {
          this.$nextTick(() => {
            this.$refs.autoInput.focus()
          })
        }
      } else if (this.needCaseElButton) {
        this.unlockAll(true)
      }
    }
  },
  methods: {
    submit() {
      // promptType 事件类型 需要知道事件类型触发具体的回调
      this.$emit('confirmFun', {
        promptType: this.promptType,
        backAgain: this.backAgain,
        promptDesc: this.promptDesc,
        extraMess: this.extraMess
      })
    },
    cancel() {
      if (this.needCaseElButton) {
        // this.unlockAll(true)
      }
      this.$emit('cancelFun')
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-dialog__body {
  padding-top: 10px;
}
.info {
  font-size: 14px;
  color: rgba(90, 90, 90, 1);
  .line {
    display: flex;
    flex-direction: row;
    align-items: center;
    line-height: 24px;
    // margin-bottom: 20px;
    &.el-icon-warning:before {
      color: rgb(230, 162, 60);
      font-size: 24px;
      margin-right: 5px;
    }
    &.el-icon-success:before {
      color: #67c23a;
      font-size: 24px;
      margin-right: 5px;
    }
    &.el-icon-error:before {
      color: #f56c6c;
      font-size: 24px;
      margin-right: 5px;
    }
    &.el-icon-info:before {
      color: #909399;
      font-size: 24px;
      margin-right: 5px;
    }
  }
}
</style>
