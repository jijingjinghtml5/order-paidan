<template>
  <el-dialog
    v-if="showAudio"
    v-dialogDrag
    custom-class="dialog_8vh map-dialog"
    :title="title"
    :close-on-click-modal="true"
    :append-to-body="true"
    :visible="showAudio"
    width="500px"
    @close="close"
  >
    <div class="content">
      <div v-for="(item, index) in audioList" :key="index" class="audio-list">
        <span>现场语音{{ index + 1 }}：</span>
        <audio
          :ref="'report_audio' + index"
          controls="controls"
          @play="audioClick('play', 'report_audio' + index)"
          @pause="audioClick('pause', 'report_audio' + index)"
        >
          <source :src="sourceUrl(item)" />
        </audio>
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
    audioList: {
      type: Array,
      default: () => {}
    },
    showAudio: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currIndex: 0,
      playAudio: '',
      resourceHost: process.env.VUE_APP_ASSET_URL
    }
  },
  watch: {},
  mounted() {},
  methods: {
    sourceUrl(url) {
      return `${this.resourceHost}/${url}`
    },
    audioClick(op, key) {
      switch (op) {
        case 'play':
          if (this.playAudio) {
            this.playAudio.pause()
          } else {
            this.playAudio = this.$refs[key][0]
          }
          break
        case 'pause':
          this.playAudio = null
          break
      }
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  .audio-list {
    line-height: 54px;
    display: flex;
    margin-bottom: 20px;
    text-align: center;
    width: 100%;
    span {
      margin-right: 15px;
    }
    audio {
      color: #5b5bd5;
    }
  }
}
</style>
