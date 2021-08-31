<template>
  <el-dialog
    v-if="showVideo"
    v-dialogDrag
    custom-class="dialog_8vh map-dialog"
    :title="title"
    :close-on-click-modal="true"
    :append-to-body="true"
    :visible="showVideo"
    width="90%"
    @close="close"
  >
    <div class="content">
      <div class="content-img case-img">
        <p>视频</p>
        <div class="abbreviate-content">
          <div
            v-for="(item, index) in videoList"
            :key="index"
            class="abbreviate-solid"
            :class="{ active: currIndex === index }"
            @click="tabIndex(index)"
          >
            <video :src="sourceUrl(item)">
              <slot>您的浏览器不支持 video 标签。</slot>
            </video>
          </div>
        </div>
        <div class="preview">
          <div
            v-if="videoList.length > 1"
            class="pre-btn"
            :class="{ end: currIndex === 0 }"
            @click="preVideo"
          >
            <i class="el-icon-arrow-left" />
          </div>
          <video :src="sourceUrl(videoList[currIndex])" controls="controls">
            您的浏览器不支持 video 标签。
          </video>
          <div
            v-if="videoList.length > 1"
            class="next-btn"
            :class="{ end: currIndex === videoList.length - 1 }"
            @click="nextVideo"
          >
            <i class="el-icon-arrow-right" />
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: ''
    },
    videoList: {
      type: Array,
      default: () => {}
    },
    showVideo: {
      type: Boolean,
      default: false
    },
    currVideoIndex: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      currIndex: 0,
      resourceHost: process.env.VUE_APP_ASSET_URL
    }
  },
  watch: {
    currVideoIndex() {
      this.currIndex = this.currVideoIndex
    }
  },
  mounted() {},
  methods: {
    sourceUrl(url) {
      return `${this.resourceHost}/${url}`
    },
    tabIndex(val) {
      this.currIndex = val
    },
    close() {
      this.currIndex = 0
      this.$emit('close')
    },
    preVideo() {
      if (this.currIndex > 0) {
        this.currIndex -= 1
      }
    },
    nextVideo() {
      if (this.currIndex < this.videoList.length - 1) {
        this.currIndex += 1
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 70vh;
  min-height: 70vh;
  display: flex;
  .content-img {
    height: 100%;
    width: 100%;
    flex: 1;
    .abbreviate-content {
      display: flex;
      margin-top: 16px;
      width: 100%;
      .abbreviate-solid {
        padding: 5px 8px;
        border: 1px solid #fff;
        margin-right: 10px;
        background-color: rgba(91, 91, 213, 0.2);
        text-align: center;
        cursor: pointer;
        video {
          display: block;
          height: 45px;
        }
      }
      .abbreviate-solid.active {
        border: 1px solid #5b5bd5;
      }
    }
    .preview {
      height: calc(100% - 100px);
      overflow: hidden;
      margin-top: 16px;
      video {
        width: auto;
        height: 100%;
        max-width: 100%;
        max-height: 100%;
        margin: 0 auto;
        display: block;
      }
      .pre-btn,
      .next-btn {
        position: absolute;
        // opacity: 0;
        top: 50%;
        bottom: 0;
        width: 40px;
        height: 40px;
        transition: 0.2s;
        font-size: 40px;
        color: #ffffff;
        cursor: pointer;
        overflow: hidden;
        transform: translate(0, -50%);
        background-color: rgba(0, 0, 0, 0.6);
        z-index: 999;
        &.end {
          opacity: 0.3 !important;
        }
        &:hover {
          opacity: 0.3 !important;
        }
        &:active {
          opacity: 1 !important;
        }
      }
      .pre-btn {
        left: 10px;
      }
      .next-btn {
        right: 10px;
      }
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
