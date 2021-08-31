<template>
  <el-dialog
    v-if="showImg"
    v-dialogDrag
    custom-class="dialog_8vh map-dialog"
    :title="title"
    :close-on-click-modal="true"
    :append-to-body="true"
    :visible="showImg"
    width="90%"
    @close="close"
  >
    <div class="content">
      <div class="content-img case-img" :class="resultsImg && resultsImg.length ? '' : 'setWidth'">
        <p>案件图片</p>
        <preview-image v-if="img" :img="img || []" :index="currIndex" :show-img="showImg" />
      </div>
      <div
        v-if="resultsImg && resultsImg.length"
        style="width: 50%"
        class="content-img resolve-img"
      >
        <p>处置结果图片</p>
        <preview-image
          v-if="resultsImg"
          :img="resultsImg || []"
          :index="currResultIndex"
          :show-img="showImg"
        />
      </div>
    </div>
  </el-dialog>
</template>

<script>
import PreviewImage from './modules/previewImg'

export default {
  components: {
    PreviewImage
  },
  props: {
    title: {
      type: String,
      default: ''
    },
    img: {
      type: Array,
      default: () => {}
    },
    resultsImg: {
      type: Array,
      default: () => {}
    },
    showImg: {
      type: Boolean,
      default: false
    },
    currPreviewImgIndex: {
      type: [String, Number],
      default: 0
    },
    currresultsImgIndex: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      currIndex: 0,
      currResultIndex: 0,
      resourceHost: process.env.VUE_APP_ASSET_URL,
      imgDeg: 0,
      resultDeg: 0,
      imgScale: 1,
      resultScale: 1
    }
  },
  watch: {
    currPreviewImgIndex() {
      console.log(this.currPreviewImgIndex, 'this.currPreviewImgIndex')
      this.currIndex = this.currPreviewImgIndex
    },
    currresultsImgIndex() {
      console.log(this.currresultsImgIndex, 'this.currresultsImgIndex')
      this.currResultIndex = this.currresultsImgIndex
    }
  },
  mounted() {},
  methods: {
    close() {
      this.currIndex = 0
      this.currResultIndex = 0
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
/deep/.el-dialog__body {
  overflow: hidden;
  padding: 10px 20px;
}
.content {
  width: 100%;
  height: 70vh;
  min-height: 70vh;
  display: flex;
  .content-img {
    height: 100%;
    width: 50%;
    // flex: 1;
    &.setWidth {
      width: 100%;
    }
  }
  .case-img {
    padding-right: 20px;
  }
  .resolve-img {
    padding-left: 20px;
    border-left: 1px solid rgba(91, 91, 213, 0.2);
  }
}
</style>
