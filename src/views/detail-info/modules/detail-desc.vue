<template>
  <div class="detail-desc-child">
    <template v-if="!canEdit">
      <el-row :gutter="2" class="detail-base-line">
        <el-col :lg="6" :xs="12" :sm="12" :md="12">
          <div class="content-box">
            <text-tooltip
              class="wid100 content-word"
              :title="'案件描述：'"
              :content="currData.event.description"
              ref-name="description"
            />
          </div>
        </el-col>
        <el-col :lg="6" :xs="12" :sm="12" :md="12">
          <div class="content-box">
            案件地址：
            <i class="el-icon-location-outline icon-location" />
            <span class="content-word">{{ currData.event.address }}</span>
            <span v-if="currData.addressNote" class="content-word"
              >({{ currData.addressNote }})</span
            >
            <span class="view" @click="seeMap">[ 查看 ]</span>
          </div>
        </el-col>
        <el-col :lg="6" :xs="12" :sm="12" :md="12">
          <div class="content-box">
            上报图片：
            <span
              v-if="currData.report_medias.images && currData.report_medias.images.length"
              class="content-word"
              >{{ currData.report_medias.images.length }}张</span
            >
            <span
              v-if="currData.report_medias.images && currData.report_medias.images.length"
              class="view"
              @click="viewImg('上报图片', currData)"
              >[ 查看 ]</span
            >
          </div>
        </el-col>
        <el-col
          v-if="currData.results && currData.results.length"
          :lg="6"
          :xs="12"
          :sm="12"
          :md="12"
        >
          <div class="content-box">
            处置图片：<span v-if="currData.results && currData.results.length" class="content-word"
              >{{ currData.results.length }}张</span
            >
            <span
              v-if="currData.results && currData.results.length"
              class="view"
              @click="viewImg('处置图片', currData)"
              >[ 查看 ]</span
            >
          </div>
        </el-col>
        <el-col v-else :lg="6" :xs="12" :sm="12" :md="12">
          <div class="content-box">
            上报音频
            <span
              v-if="currData.report_medias.adios && currData.report_medias.adios.length"
              class="content-word"
              >{{ currData.report_medias.adios.length }}个</span
            >
            <span
              v-if="currData.report_medias.adios && currData.report_medias.adios.length"
              class="view"
              @click="viewAudio('上报音频', currData)"
              >[ 查看 ]</span
            >
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="2" class="detail-base-line detail-base-last-line">
        <el-col
          v-if="currData.results && currData.results.length"
          :lg="6"
          :xs="12"
          :sm="12"
          :md="12"
        >
          <div class="content-box">
            上报音频：<span v-if="currData.audios && currData.audios.length" class="content-word"
              >{{ currData.audios.length }}个</span
            >
            <span
              v-if="currData.audios && currData.audios.length"
              class="view"
              @click="viewAudio('上报音频', currData)"
              >[ 查看 ]</span
            >
          </div>
        </el-col>
        <el-col :lg="6" :xs="12" :sm="12" :md="12">
          <div class="content-box">
            上报视频
            <span
              v-if="currData.report_medias.videos && currData.report_medias.videos.length"
              class="content-word"
              >{{ currData.report_medias.videos.length }}个</span
            >
            <span
              v-if="currData.report_medias.videos && currData.report_medias.videos.length"
              class="view"
              @click="viewVideo('上报视频', currData)"
              >[ 查看 ]</span
            >
          </div>
        </el-col>
        <el-col :lg="6" :xs="12" :sm="12" :md="12">
          <div class="content-box">
            上报文件：<span v-if="currData.docs && currData.docs.length" class="content-word"
              >{{ currData.docs.length }}个</span
            >
            <span
              v-if="currData.docs && currData.docs.length"
              class="view"
              @click="viewDocs('上报文件', currData)"
              >[ 查看 ]</span
            >
          </div>
        </el-col>
      </el-row>
    </template>

    <template v-else>
      <el-row :gutter="2" class="detail-base-line">
        <el-col :lg="6" :xs="12" :sm="12" :md="12">
          <div class="content-box">
            上报图片：<span v-if="currData.scenes && currData.scenes.length" class="content-word"
              >{{ currData.scenes.length }}张</span
            >
            <span
              v-if="currData.scenes && currData.scenes.length"
              class="view"
              @click="viewImg('上报图片', currData)"
              >[ 查看 ]</span
            >
          </div>
        </el-col>
        <el-col
          v-if="currData.results && currData.results.length"
          :lg="6"
          :xs="12"
          :sm="12"
          :md="12"
        >
          <div class="content-box">
            处置图片：<span v-if="currData.results && currData.results.length" class="content-word"
              >{{ currData.results.length }}张</span
            >
            <span
              v-if="currData.results && currData.results.length"
              class="view"
              @click="viewImg('处置图片', currData)"
              >[ 查看 ]</span
            >
          </div>
        </el-col>
        <el-col :lg="6" :xs="12" :sm="12" :md="12">
          <div class="content-box">
            上报音频：<span v-if="currData.audios && currData.audios.length" class="content-word"
              >{{ currData.audios.length }}个</span
            >
            <span
              v-if="currData.audios && currData.audios.length"
              class="view"
              @click="viewAudio('上报音频', currData)"
              >[ 查看 ]</span
            >
          </div>
        </el-col>
        <el-col :lg="6" :xs="12" :sm="12" :md="12">
          <div class="content-box">
            上报视频：<span v-if="currData.videos && currData.videos.length" class="content-word"
              >{{ currData.videos.length }}个</span
            >
            <span
              v-if="currData.videos && currData.videos.length"
              class="view"
              @click="viewVideo('上报视频', currData)"
              >[ 查看 ]</span
            >
          </div>
        </el-col>
        <el-col :lg="6" :xs="12" :sm="12" :md="12">
          <div class="content-box">
            上报文件：<span v-if="currData.docs && currData.docs.length" class="content-word"
              >{{ currData.docs.length }}个</span
            >
            <span
              v-if="currData.docs && currData.docs.length"
              class="view"
              @click="viewDocs('上报文件', currData)"
              >[ 查看 ]</span
            >
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="2" class="detail-base-line">
        <el-col :lg="12" :xs="24" :sm="24" :md="24">
          <div class="content-box">
            <span class="item-span"><span style="color: red">*</span>案件地址：</span>
            <el-input
              v-model="form.address"
              style="display: inlineBlock; width: 200px"
              placeholder="输入案件地址"
              size="mini"
              clearable
            />
            <el-input
              v-model="form.addressNote"
              style="display: inlineBlock; width: 100px"
              placeholder="补充地址"
              size="mini"
              clearable
            />
            <i class="el-icon-location-outline icon-location" @click="seeMap">[查看地图]</i>
          </div>
        </el-col>
        <el-col :lg="12" :xs="24" :sm="24" :md="24">
          <div class="content-box">
            <span class="item-span">经纬度：</span>
            <span>坐标X：{{ currData.lngCd }}, 坐标Y：{{ currData.latCd }}</span>
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="2" class="detail-base-line">
        <el-col :lg="24" :xs="24" :sm="24" :md="24">
          <div style="display: flex">
            <span class="item-span">案件描述：</span>
            <el-input
              v-model="form.description"
              :rows="4"
              maxlength="200"
              class="input-textarea"
              type="textarea"
              show-word-limit
            />
          </div>
        </el-col>
      </el-row>
      <el-row :gutter="2" class="detail-base-line detail-base-last-line">
        <el-col :lg="24" :xs="24" :sm="24" :md="24">
          <div style="display: flex">
            <span class="item-span">多媒体附加：</span>
            <div>
              <div>
                <el-upload
                  ref="scenes"
                  class="upload-demo"
                  style="line-height: 40px"
                  accept=".jpg, .jpeg, .png, .gif, .pdf, .JPG, .JPEG, PNG, .GIF, .PDF"
                  :action="host + '/web/upload-origin-imgs?token=' + token"
                  multiple
                  :show-file-list="false"
                  :before-upload="beforeImgUpload"
                  :on-success="handleSuccess"
                  name="imgs"
                >
                  <el-button size="small" type="primary">上传图片</el-button>
                </el-upload>
                <!-- 预览 -->
                <template v-if="form.accept_imgs.length">
                  <swiperimg
                    :img-wall="resolveImg(form.accept_imgs)"
                    is-rotate
                    swiper
                    can-delete
                    @deleteImg="delImg('accept_imgs', arguments[0])"
                  />
                </template>
              </div>
              <div>
                <el-upload
                  ref="file"
                  :action="host + '/web/upload-origin-imgs?token=' + token"
                  :before-upload="beforeWordUpload"
                  :on-success="handleSuccessWord"
                  :show-file-list="false"
                  accept=".docx, .doc, .dot, .pdf, .dotm, .xlsx, .xlsm, .xlm, .xls, .xml, .txt, .wps, .ppt, .pptx, .zip, .rar"
                  class="upload-demo"
                  name="docs"
                  style="line-height: 40px"
                >
                  <el-button size="small" type="primary">上传文件</el-button>
                </el-upload>
                <!-- 预览 -->
                <template v-if="form.accept_docs.length">
                  <div v-for="(item, index) in form.accept_docs" :key="index" class="docs-list">
                    <a
                      :href="resourceHost + '/' + item.url"
                      style="padding-right: 40px; position: relative"
                    >
                      <i class="el-icon-document" />
                      <span style="margin-left: 8px">{{ item.name || item.url }}</span>
                      <div class="del" @click.stop.prevent="delDoc('accept_docs', index)">×</div>
                    </a>
                  </div>
                </template>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </template>
    <div v-show="showMap" class="fullmap">
      <div
        style="margin-bottom: 5px; padding: 0 16px; display: flex; justify-content: space-between"
      >
        <div>
          <span style="line-height: 28px; margin-left: 10px"
            >当前经纬度：{{ mapInfoData['x'] }}, {{ mapInfoData['y'] }}</span
          >
          <span v-if="mapInfoData['街道名称']" style="line-height: 28px; margin-left: 10px"
            >所属街道：{{ mapInfoData['街道名称'] }}</span
          >
          <span v-if="mapInfoData['居委会名称']" style="line-height: 28px; margin-left: 10px"
            >所属居委：{{ mapInfoData['居委会名称'] }}</span
          >
          <span v-if="mapInfoData['网格编码']" style="line-height: 28px; margin-left: 10px"
            >网格编码：{{ mapInfoData['网格编码'] }}</span
          >
          <span v-if="mapInfoData['地址']" style="line-height: 28px; margin-left: 10px"
            >地址：{{ mapInfoData['地址'] }}</span
          >
        </div>
        <div>
          <el-button type="primary" size="mini" @click="mapCancel">关闭</el-button>
        </div>
      </div>
      <gismap
        :query-str="gridcode"
        :mapdata="mapdata"
        :show-map="showMap"
        :can-click="false"
        style="height: calc(100% - 33px)"
        @map-info="mapInfo"
      />
    </div>
    <!--图片弹框-->
    <swiper-plugin
      :show-img="showImg"
      :title="title"
      :img="previewImg"
      :results-img="resultsImg"
      @close=";(showImg = false), (previewImg = []), (resultsImg = [])"
    />
    <!--视频弹框-->
    <swiper-video
      :show-video="showVideo"
      :title="title"
      :video-list="videoList"
      @close=";(showVideo = false), (videoList = [])"
    />
    <!--音频弹框-->
    <swiper-audio
      :show-audio="showAudio"
      :title="title"
      :audio-list="audioList"
      @close=";(showAudio = false), (audioList = [])"
    />
    <!-- 文件弹窗 -->
    <swiper-docs
      :show-docs="showDocs"
      :title="title"
      :docs-list="docsList"
      @close=";(showDocs = false), (docsList = [])"
    />
  </div>
</template>

<script>
// import http from '@/api'
import { getInfoByCoord } from '@/api/case'
import Storage from 'good-storage'
import swiperPlugin from '@/components/imageSwiper/swiperPlugin3.0.vue'
import swiperVideo from '@/components/imageSwiper/swiperVideo.vue'
import swiperAudio from '@/components/imageSwiper/swiperAudio.vue'
import swiperDocs from '@/components/imageSwiper/swiperDocs.vue'
import swiperimg from '@/components/imageSwiper/swiperPlugin'
import textTooltip from '@/components/TextTooltip'
import gismap from '@/components/gismap/index2'
import { mapGetters } from 'vuex'

export default {
  components: {
    swiperPlugin,
    swiperVideo,
    swiperAudio,
    swiperimg,
    textTooltip,
    gismap,
    swiperDocs
  },
  props: {
    currData: {
      required: true,
      type: Object
    },
    gridName: {
      type: [String, Number],
      default: ''
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      showMap: false,
      showImg: false,
      showVideo: false,
      showAudio: false,
      showDocs: false,
      docsList: [],
      mapUrl: process.env.VUE_APP_MAP_URL,
      host: process.env.VUE_APP_BASE_URL,
      resourceHost: process.env.VUE_APP_ASSET_URL,
      title: '',
      gridcode: '',
      videoList: [],
      audioList: [],
      previewImg: [],
      resultsImg: [],
      mapdata: { x: 0, y: 0 }, // 点击地图返回的信息
      form: {
        description: '',
        address: '',
        addressNote: '',
        accept_imgs: [],
        accept_docs: []
      },
      mapInfoData: {}, // 地图打点返回的信息
      token: Storage.get('webToken'),
      HTML_BASE: process.env.VUE_APP_HTML_URL
    }
  },
  computed: {
    ...mapGetters({
      newWindowMap: 'newWindowMap'
    })
  },
  watch: {},
  created() {
    this.form.description = this.currData.description || ''
    this.form.address = this.currData.address || ''
    this.form.addressNote = this.currData.addressNote || ''
    this.form.accept_imgs = this.currData.accept_imgs || []
    this.form.accept_docs =
      (this.currData.accept_docs &&
        this.currData.accept_docs.map((item) => {
          return { url: item.url || item, name: item.name || item.url || item }
        })) ||
      []
  },
  mounted() {
    // this.gridcode = this.basicInfo.gridName
    this.mapdata = { x: this.currData.event.lng_cd, y: this.currData.event.lat_cd }
    this.latCd = this.currData.event.lat_cd
    this.lngCd = this.currData.event.lng_cd

    // this.mapInfoData['街道名称'] = this.basicInfo.streetName
    // this.mapInfoData['居委会名称'] = this.basicInfo.communityName
    // this.mapInfoData['网格编码'] = this.basicInfo.gridName
    // this.mapInfoData['地址'] = this.currData.address
    this.mapInfoData.x = this.currData.event.lng_cd
    this.mapInfoData.y = this.currData.event.lat_cd
  },
  methods: {
    // 查看地图
    seeMap() {
      if (!this.newWindowMap) {
        this.showMap = true
        return
      }
      let url = ''
      const params = { ...this.mapInfoData, gridcode: this.gridcode, code: this.currData.code }
      if (process.env.NODE_ENV == 'production' && this.HTML_BASE) {
        url =
          document.location.origin +
          '/web/#' +
          '/detail/map?params=' +
          escape(JSON.stringify(params))
      } else {
        url = document.location.origin + '/#/detail/map?params=' + escape(JSON.stringify(params))
      }
      window.open(url, '详情查看地图页面')
    },
    // 地图组件返回的点位信息 暂时不使用，不可修改
    mapInfo(data) {
      const mapData = data ? JSON.parse(data) : {}
      this.getMapInfoData({ x: mapData['坐标X'], y: mapData['坐标Y'] })
    },
    // 根据坐标反查地址详细信息
    async getMapInfoData(data, isInit) {
      const res = await getInfoByCoord({
        lng: data.x,
        lat: data.y,
        mode: 1
      })
      if (res.data.code === 200) {
        if (!isInit) {
          this.mapInfoData = res.data.data
          this.mapInfoData.x = data.x
          this.mapInfoData.y = data.y
        }
      }
      // http({
      //   method: 'get',
      //   url: process.env.VUE_APP_LIST_URL + '/meta-data/info-by-coord',
      //   params: {
      //     lng: data.x,
      //     lat: data.y,
      //     mode: 1
      //   }
      // }).then((res) => {
      //   if (res.data.code === 200) {
      //     if (!isInit) {
      //       this.mapInfoData = res.data.data
      //       this.mapInfoData.x = data.x
      //       this.mapInfoData.y = data.y
      //     }
      //   }
      // })
    },
    mapCancel() {
      this.showMap = false
    },
    delImg(key, index) {
      this.form[key].splice(index, 1)
    },
    delDoc(key, index) {
      this.form[key].splice(index, 1)
    },
    resolveImg(imgStr) {
      return imgStr.map((item) => ({
        open: false,
        url: this.resourceHost + '/' + (item.url || item)
      }))
    },
    beforeImgUpload() {
      this.loading = true
    },
    handleSuccess(response) {
      if (response.code == 200) {
        response.data.imgs.map((item) => {
          this.form.accept_imgs.push(item)
        })
      } else {
        this.$message({
          message: '上传失败',
          type: 'error'
        })
      }
      this.loading = false
    },
    beforeWordUpload() {
      this.loading = true
    },
    handleSuccessWord(response, file) {
      console.log(file)
      if (response.code == 200) {
        this.form.accept_docs.push({ name: file.name, url: file.response.data.docs[0] })
      } else {
        this.$message({
          message: '上传失败',
          type: 'error'
        })
      }
      this.loading = false
    },
    // 关闭地图
    closeFullMap() {
      this.showMap = false
    },
    // 查看图片
    viewImg(title, data) {
      this.title = title
      if (data.results && data.results.length) {
        this.resultsImg = data.results
      }
      if (data.scenes && data.scenes.length) {
        this.previewImg = data.scenes
      }
      console.log(data.report_medias)
      this.previewImg = data.report_medias && data.report_medias.images
      this.showImg = true
    },
    // 查看视频
    viewVideo(title, data) {
      this.title = title
      this.videoList = data.report_medias.videos
      this.showVideo = true
    },
    viewAudio(title, data) {
      this.title = title
      this.audioList = data.report_medias.adios
      this.showAudio = true
    },
    viewDocs(title, data) {
      this.title = title
      this.docsList = data.docs
      this.showDocs = true
    },
    // 初始化地图
    initDetail() {
      const _self = this
      // 标点位
      // eslint-disable-next-line
      _self.bridge = new CityGis.Bridge({
        id: 'cd-map-detail',
        url: _self.mapUrl + '/citygis/gistools/#/map/city',
        onReady: () => {
          _self.addPoint([_self.currData.lngCd, _self.currData.latCd])
          // _self.addPoint([55.84116861276571, 797.6820772092684])
          _self.addArea(_self.gridName)
        }
      })
    },
    // 标点
    addPoint(position) {
      const param1 = {
        ActionName: 'goToPosition',
        Parameters: JSON.stringify({
          positon: { x: position[0], y: position[1] },
          zoom: 6,
          heading: 0,
          tilt: 0,
          hasImg: false
        })
      }
      this.bridge.Invoke(param1)
      const param2 = {
        ActionName: 'doShowPointData',
        Parameters: JSON.stringify({
          keyfield: 'id',
          dataSource: [
            {
              id: 1,
              lat: position[1],
              lng: position[0],
              name: 'point'
            }
          ],
          options: {
            layerid: 'reportPoint', // 移除点图层标识
            geofield: {
              XFIELD: 'lng',
              YFIELD: 'lat'
            },
            layerRender: {
              type: 'simple',
              symbol: {
                // 点样式
                type: 'simple-marker',
                style: 'circle',
                color: 'red',
                size: '15px',
                outline: {
                  color: [255, 0, 0],
                  width: 0
                }
              }
            }
          }
        })
      }
      this.bridge.Invoke(param2)
    },
    // 添加网格
    addArea(grid) {
      const param = {
        ActionName: 'doQueryLocate',
        Parameters: JSON.stringify({
          layername: '责任网格',
          where: "网格编码='" + grid + "'",
          options: {
            layerid: 'testArea',
            islocate: false,
            isshow: true,
            layerRender: {
              type: 'simple',
              symbol: {
                type: 'simple-fill',
                color: [51, 51, 204, 0],
                // style: 'solid',
                outline: {
                  color: 'red',
                  width: 2
                }
              }
            }
          }
        })
      }
      this.bridge.Invoke(param)
    }
  }
}
</script>

<style lang="scss" scoped>
.detail-base-line {
  border-top: 1px dashed rgba(91, 91, 213, 0.1);
  line-height: 40px;
  padding-left: 20px;

  .content-word {
    color: #2b3642;
    word-break: break-all;
  }

  .icon-location {
    color: #5b5bd5;
  }

  .view {
    color: #5b5bd5;
    cursor: pointer;
    margin-left: 4px;
  }

  .content-box {
    display: inline-block;
    width: 98%;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

    &:hover {
      text-overflow: inherit;
      overflow: hidden;
      white-space: normal;
    }
  }
}

.input-textarea {
  flex: 1;
  margin: 8px 0;
}

.detail-base-last-line {
  border-bottom: 1px dashed rgba(91, 91, 213, 0.1);
}

.detail-word {
  color: #5b5bd5;
}

.fullmap {
  position: fixed;
  width: calc(100% - 263px);
  height: calc(100vh - 127px);
  z-index: 2;
  right: 16px;
  top: 120px;
  background: rgba(255, 255, 255, 0.95);
}

.del {
  position: absolute;
  top: 2px;
  right: 2px;
  opacity: 0;
  width: 12px;
  height: 12px;
  font-size: 12px;
  text-align: center;
  line-height: 10px;
  transition: 0.4s;
  border-radius: 50%;
  background-color: #ccc0a9;
  cursor: pointer;

  &:hover {
    color: #ffffff;
    background-color: red;
  }
}

.docs-list {
  position: relative;
  margin-top: 0px;

  &:hover {
    .del {
      opacity: 1;
    }
  }
}
</style>
<style lang="scss">
.map-dialog {
  .el-dialog__header {
    border-bottom: 2px solid rgba(91, 91, 213, 0.2);
  }
}
</style>
