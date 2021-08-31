<template>
  <div class="time-line">
    <el-timeline>
      <template v-for="item in currData">
        <el-timeline-item :key="item.id" :timestamp="item.created_at" placement="top">
          <section class="time-line-content">
            <div class="process">
              <p>
                <span class="title">操作名称：</span
                ><span>{{ codeDict[item.step_status] || '上报' }}</span>
              </p>
              <p>
                <span class="title">操作人员：</span
                ><span>{{ JSON.parse(item.ext_data).opt_username }}</span>
              </p>
              <p v-if="item.extData && item.extData.coops && item.extData.coops.length">主办：</p>
              <p
                v-if="item.pre_status && item.status"
                :style="{
                  paddingLeft:
                    item.extData && item.extData.coops && item.extData.coops.length ? '35px' : 0
                }"
              >
                <span class="title">案件状态：</span
                ><span>{{
                  `${codeDict[JSON.parse(item.ext_data).fromStatus]} > ${
                    codeDict[JSON.parse(item.ext_data).toStatus]
                  }`
                }}</span>
              </p>
              <p
                v-if="item.ext_data"
                :style="{
                  paddingLeft:
                    item.extData && item.extData.coops && item.extData.coops.length ? '35px' : 0
                }"
              >
                <span class="title">案件流转：</span>
                <span
                  >{{
                    `${
                      JSON.parse(item.ext_data).from_meta_level1_name
                        ? JSON.parse(item.ext_data).from_meta_level1_name
                        : ''
                    }
                          ${
                            JSON.parse(item.ext_data).from_meta_level2_name
                              ? `/${JSON.parse(item.ext_data).from_meta_level2_name}`
                              : ''
                          }
                          ${
                            JSON.parse(item.ext_data).from_meta_level3_name
                              ? `/${JSON.parse(item.ext_data).from_meta_level3_name}`
                              : ''
                          }
                          ${
                            JSON.parse(item.ext_data).from_meta_level4_name
                              ? `/${JSON.parse(item.ext_data).from_meta_level4_name}`
                              : ''
                          }
                          ${
                            JSON.parse(item.ext_data).from_meta_level5_name
                              ? `/${JSON.parse(item.ext_data).from_meta_level5_name}`
                              : ''
                          }
                          ${
                            JSON.parse(item.ext_data).from_department_name
                              ? `/${JSON.parse(item.ext_data).from_department_name}`
                              : ''
                          }
                          ${
                            codeDict[JSON.parse(item.ext_data).fromPeriodStatus]
                              ? `/${codeDict[JSON.parse(item.ext_data).fromPeriodStatus]}`
                              : ''
                          }`
                  }}
                  >
                  {{
                    `${
                      JSON.parse(item.ext_data).to_meta_level1_name
                        ? JSON.parse(item.ext_data).to_meta_level1_name
                        : ''
                    }
                          ${
                            JSON.parse(item.ext_data).to_meta_level2_name
                              ? `/${JSON.parse(item.ext_data).to_meta_level2_name}`
                              : ''
                          }
                          ${
                            JSON.parse(item.ext_data).to_meta_level3_name
                              ? `/${JSON.parse(item.ext_data).to_meta_level3_name}`
                              : ''
                          }
                          ${
                            JSON.parse(item.ext_data).to_meta_level4_name
                              ? `/${JSON.parse(item.ext_data).to_meta_level4_name}`
                              : ''
                          }
                          ${
                            JSON.parse(item.ext_data).to_meta_level5_name
                              ? `/${JSON.parse(item.ext_data).to_meta_level5_name}`
                              : ''
                          }
                          ${
                            JSON.parse(item.ext_data).to_department_name
                              ? `/${JSON.parse(item.ext_data).to_department_name}`
                              : ''
                          }
                          ${
                            codeDict[JSON.parse(item.ext_data).toPeriodStatus]
                              ? `/${codeDict[JSON.parse(item.ext_data).toPeriodStatus]}`
                              : ''
                          }`
                  }}
                </span>
              </p>
              <p v-if="resloveDesc(item)">
                <span class="title">案件描述：</span>
                <span>{{ resloveDesc(item) }}</span>
              </p>
            </div>

            <div class="appendix">
              <div v-if="resolveImage(item)" class="appendix-item">
                <span>案件图片：</span>
                <div
                  v-for="(imgs, index1) in resolveImage(item)"
                  :key="index1"
                  class="appendix-item-box"
                  @click="viewImg('案件图片', resolveImage(item), index1)"
                >
                  <img :src="sourceUrl(imgs)" />
                </div>
              </div>
              <div v-if="resolveAudio(item)" class="appendix-item">
                <span>现场语音：</span>
                <div class="appendix-item-audio">
                  <audio
                    v-for="(audios, index1) in resolveAudio(item)"
                    :key="index1"
                    :ref="'report_audio'"
                    controls="controls"
                    @play="audioClick('play', 'report_audio')"
                    @pause="audioClick('pause', 'report_audio')"
                  >
                    <source :src="sourceUrl(audios)" />
                  </audio>
                </div>
              </div>
              <div v-if="resolveVideos(item)" class="appendix-item">
                <span class="span-video">视频：</span>
                <div
                  v-for="(videos, index1) in resolveVideos(item)"
                  :key="index1"
                  class="appendix-item-video"
                  @click="viewVideo('视频', resolveVideos(item), index1)"
                >
                  <video :src="sourceUrl(videos)">
                    <slot>您的浏览器不支持 video 标签。</slot>
                  </video>
                </div>
              </div>
              <div v-if="item.docs && item.docs.length" class="appendix-item">
                <span class="span-video">文件：</span>
                <div class="appendix-item-audio">
                  <div v-for="(docs, index1) in item.docs" :key="index1">
                    <a
                      style="font-size: 14px; text-decoration: underline; line-height: 42px"
                      :href="resourceHost + '/' + (docs.url || docs)"
                      >{{ docs.name || docs.url || docs }}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </el-timeline-item>
      </template>
    </el-timeline>
    <!--图片弹框-->
    <swiper-plugin
      :show-img="showImg"
      :title="title"
      :img="previewImg"
      :results-img="resultsImg"
      :currresults-img-index="currresultsImgIndex"
      :curr-preview-img-index="currPreviewImgIndex"
      @close=";(showImg = false), (previewImg = []), (resultsImg = [])"
    />
    <!--视频弹框-->
    <swiper-video
      :show-video="showVideo"
      :title="title"
      :video-list="videoList"
      :curr-video-index="currVideoIndex"
      @close=";(showVideo = false), (videoList = []), (currVideoIndex = 0)"
    />
    <!--音频弹框-->
    <swiper-audio
      :show-audio="showAudio"
      :title="title"
      :audio-list="audioList"
      @close=";(showAudio = false), (audioList = [])"
    />
  </div>
</template>

<script>
import swiperPlugin from '@/components/imageSwiper/swiperPlugin3.0.vue'
import swiperVideo from '@/components/imageSwiper/swiperVideo.vue'
import swiperAudio from '@/components/imageSwiper/swiperAudio.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    swiperPlugin,
    swiperVideo,
    swiperAudio
  },
  filters: {
    formmatResult(val) {
      switch (val) {
        case '1':
          return '解决'
        case '2':
          return '未解决'
        case '3':
          return '计划中'
        default:
          return ''
      }
    }
  },
  props: {
    currData: {
      required: true,
      type: [Object, Array]
    }
  },
  data() {
    return {
      playAudio: '',
      resourceHost: process.env.VUE_APP_ASSET_URL,
      showImg: false,
      showVideo: false,
      showAudio: false,
      title: '',
      previewImg: [],
      resultsImg: [],
      videoList: [],
      audioList: [],
      currVideoIndex: 0, // 当前点击的视频索引
      currresultsImgIndex: 0, // 当前点击的处置结果图片索引
      currPreviewImgIndex: 0 // 当前点击的案件图片索引
    }
  },
  computed: {
    extData() {
      return this.currData
    },
    ...mapGetters(['codeDict'])
  },
  watch: {},
  created() {},
  methods: {
    // 查看图片
    viewImg(title, data, index, val) {
      this.title = title
      this.previewImg = data
      if (val) {
        this.currresultsImgIndex = index
      } else {
        this.currPreviewImgIndex = index
      }
      this.showImg = true
    },
    // 查看视频
    viewVideo(title, data, index) {
      this.title = title
      this.videoList = data
      this.showVideo = true
      this.currVideoIndex = index
    },
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
    resolveImage(item) {
      const form = JSON.parse(item.form)
      if (form && form.images) {
        return form.images
      }
      if (Array.isArray(form)) {
        const images = []
        form.forEach((ele) => {
          if (ele.key == 'image' && ele.value) {
            images.push(ele.value)
          }
        })
        if (images.length) {
          return images
        }
        return false
      }
    },
    resolveAudio(item) {
      const form = JSON.parse(item.form)
      if (form && form.audios && form.audios[0]) {
        return form.audios
      }
      return false
    },
    resolveVideos(item) {
      const form = JSON.parse(item.form)
      if (form && form.videos && form.videos[0]) {
        return form.videos
      }
      return false
    },
    resloveDesc(item) {
      const form = JSON.parse(item.form)
      if (Array.isArray(form)) {
        let desc
        form.forEach((ele) => {
          if (ele.key == 'description' && ele.value) {
            desc = ele.value
          }
          if (ele.description) {
            desc = ele.description
          }
        })
        if (desc) {
          return desc
        }
        return false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.time-line {
  .time-line-content {
    display: flex;
    .title {
      color: #424754;
    }
  }
  .process {
    width: 60%;
    p {
      line-height: 38px;
      color: #5e6470;
    }
  }
  .appendix {
    .appendix-item {
      display: flex;
      span {
        line-height: 38px;
        white-space: pre;
      }
      .span-video {
        margin-right: 40px;
      }
      .appendix-item-box {
        padding: 2px 4px;
        margin-left: 12px;
        background: rgba(91, 91, 213, 0.1);
        width: 48px;
        height: 30px;
        margin-top: 4px;
        cursor: pointer;
        img {
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 100%;
          margin: 0 auto;
          display: block;
        }
      }
      .appendix-item-audio {
        audio {
          margin: 2px 0 0 12px;
          height: 32px;
          width: 250px;
          display: block;
        }
      }
      .appendix-item-video {
        padding: 2px 4px;
        margin-right: 12px;
        background: rgba(91, 91, 213, 0.1);
        width: 48px;
        height: 30px;
        margin-top: 4px;
        cursor: pointer;
        video {
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 100%;
          margin: 0 auto;
          display: block;
        }
      }
    }
  }
}
</style>

<style lang="less">
.time-line {
  padding-left: 20px;
  .el-timeline-item {
    .el-timeline-item__node {
      background: #5b5bd5;
    }
    .el-timeline-item__tail {
      border-left: 2px solid rgba(91, 91, 213, 0.3);
    }
    .el-timeline-item__timestamp {
      // margin-left: -160px;
      color: #424754;
    }
  }
}
</style>
