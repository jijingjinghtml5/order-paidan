<template>
  <div>
    <el-image-viewer
      v-if="showViewer"
      class="image-viewer"
      :on-close="
        () => {
          $emit('close')
        }
      "
      :url-list="imgList"
    />
  </div>
</template>

<script>
export default {
  name: 'Index',
  components: {
    'el-image-viewer': () => import('element-ui/packages/image/src/image-viewer')
  },
  props: {
    showViewer: {
      type: Boolean,
      default: false
    },
    imgList: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style scoped lang="less">
.image-viewer {
  z-index: 9999 !important;
}
</style>
