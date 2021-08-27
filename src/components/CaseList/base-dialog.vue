<template>
  <!--使用$attrs和$listeners对组件2次封装-->
  <el-dialog
    v-dialogDrag
    :visible.sync="visibleDialog"
    :append-to-body="true"
    class="baseDialog"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <template #title>
      <h4>{{ title }}</h4>
    </template>
    <!--内容区域的默认插槽-->
    <slot />
    <!--使用弹框的footer插槽添加按钮-->
    <template v-if="showFooter" #footer>
      <!--对外继续暴露footer插槽，有个别弹框按钮需要自定义-->
      <slot name="footer">
        <!--将取消与确定按钮集成到内部-->
        <span>
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="handleConfirm"> 确 定 </el-button>
        </span>
      </slot>
    </template>
  </el-dialog>
</template>
<script>
export default {
  props: {
    // 对外暴露visible属性，用于显示隐藏弹框
    visible: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: ''
    },
    showFooter: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    // 通过计算属性，对.sync进行转换，外部也可以直接使用visible.sync
    visibleDialog: {
      get() {
        return this.visible
      },
      set(val) {
        this.$emit('update:visible', val)
      }
    }
  },
  methods: {
    // 对外抛出cancel事件
    handleCancel() {
      this.$emit('cancel')
    },
    // 对外抛出 confirm事件
    handleConfirm() {
      this.$emit('confirm')
    }
  }
}
</script>
<style lang="scss">
.zmc-paper {
  height: auto;
  border: none;
  box-shadow: none;
  margin: 0;
  .zmc-container {
    h2 {
      display: none;
    }
    h3 {
      display: none;
    }
    .number {
      opacity: 0;
    }
  }
}
.paper-footer {
  height: 0;
  display: none !important;
}
.baseDialog {
  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>
