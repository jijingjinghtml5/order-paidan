<template>
  <el-dialog
    v-dialogDrag
    custom-class="dialog_8vh map-dialog"
    title="案件图片"
    :close-on-click-modal="true"
    :append-to-body="true"
    :visible="showImg"
    width="90%"
    @close="close"
  >
    <div slot="title" class="dialog-title">
      <span class="title-text">案件图片</span>
      <!-- <el-button @click="changeCompare" size="mini" type="primary">{{
        !compare ? "增加对比" : "减少对比"
      }}</el-button> -->
    </div>
    <div class="content">
      <div class="content-img case-img">
        <!-- <p>案件图片</p> -->
        <el-select
          v-if="filters"
          class="input-width select-width"
          placeholder="请选择"
          size="mini"
          :value="checkFilterImg"
          @change="changefilter"
        >
          <el-option v-for="(item, key) in filters" :key="key" :label="item" :value="key" />
        </el-select>
        <el-select
          class="input-width"
          placeholder="请选择"
          size="mini"
          :value="imgTitle"
          @change="changeImg"
        >
          <el-option v-for="(item, key) in imgTypeList1" :key="key" :label="item" :value="key" />
        </el-select>
        <preview-image v-if="img" :img="img || []" :index="currIndex" :show-img="showImg" />
      </div>
      <div v-if="compare" class="content-img resolve-img">
        <!-- <p>处置结果图片</p> -->
        <el-select
          v-if="filters"
          class="input-width select-width"
          placeholder="请选择"
          size="mini"
          :value="checkFilterResult"
          @change="changefilterResult"
        >
          <el-option v-for="(item, key) in filters" :key="key" :label="item" :value="key" />
        </el-select>
        <el-select
          class="input-width"
          placeholder="请选择"
          size="mini"
          :value="resultTitle"
          @change="changeResult"
        >
          <el-option v-for="(item, key) in imgTypeList2" :key="key" :label="item" :value="key" />
        </el-select>
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
    currData: {
      type: Object,
      default: () => {}
    },
    showImg: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      currIndex: 0,
      currResultIndex: 0,
      img: [],
      resultsImg: [],
      imgTypeList: {
        report: '上报图片',
        confirm: '核实图片',
        beforeDeal: '现场图片',
        afterDeal: '处置图片',
        check: '核查图片'
      },
      imgTitle: '',
      resultTitle: '',
      compare: true,
      imageCompare1: [],
      imageCompare2: [],
      imgTypeList1: {},
      imgTypeList2: {},
      checkFilterImg: '',
      checkFilterResult: '',
      filters: null
    }
  },
  watch: {
    showImg(newVal) {
      if (newVal) {
        this.init()
      }
    }
  },
  mounted() {},
  methods: {
    init() {
      if (this.currData.eventData.isCoop == 0) {
        this.filters = null
        const imageCompare = this.currData.imagesCompare
        this.imageCompare1 = imageCompare
        this.imageCompare2 = imageCompare
        const keys = Object.keys(imageCompare)
        const initkeys = Object.keys(this.imgTypeList)
        const imgTypeList = this.imgTypeList
        for (let i = 0; i < initkeys.length; i++) {
          if (
            !(
              keys.includes(initkeys[i]) > -1 &&
              imageCompare[initkeys[i]] &&
              imageCompare[initkeys[i]].length > 0
            )
          )
            delete imgTypeList[initkeys[i]]
        }
        this.imgTypeList1 = imgTypeList
        this.imgTypeList2 = imgTypeList
        const imgkeys = Object.keys(imgTypeList)
        this.changeImg(imgkeys[0])
        const lastKey = imgkeys.length ? imgkeys.length - 1 : 0
        this.changeResult(imgkeys[lastKey])
      } else {
        // 这一段过滤掉没有图片的filter
        const filters = {}
        const filterKeys = Object.keys(this.currData.filters)
        for (let i = 0; i < filterKeys.length; i++) {
          if (this.currData.imagesCompare && this.currData.imagesCompare[filterKeys[i]]) {
            filters[filterKeys[i]] = this.currData.filters[filterKeys[i]]
          }
        }
        this.filters = filters
        const keys = Object.keys(this.filters)
        if (keys[0]) {
          this.changefilter(keys[0])
          this.changefilterResult(keys[0])
        }
      }
    },
    changeCompare() {
      this.compare = !this.compare
    },
    // 改变左侧图片类型
    changeImg(value) {
      this.imgTitle = value
      this.img =
        this.imageCompare1[value] && this.imageCompare1[value].length
          ? this.imageCompare1[value]
          : []
      this.currIndex = 0
    },
    // 改变右侧图片类型
    changeResult(value) {
      this.resultTitle = value
      this.resultsImg =
        this.imageCompare2[value] && this.imageCompare2[value].length
          ? this.imageCompare2[value]
          : []
      this.currResultIndex = 0
    },
    changefilter(value) {
      this.checkFilterImg = value
      this.imageCompare1 = this.currData.imagesCompare[value]
      this.imgTypeList1 = this.commonFilter(value)
      const imgkeys = Object.keys(this.imgTypeList1)
      this.changeImg(imgkeys[0])
    },
    commonFilter(value) {
      const imageCompare = this.currData.imagesCompare[value]
      const keys = Object.keys(imageCompare)
      const initkeys = Object.keys(this.imgTypeList)
      const imgTypeList = {}
      for (let i = 0; i < initkeys.length; i++) {
        if (
          keys.includes(initkeys[i]) > -1 &&
          imageCompare[initkeys[i]] &&
          imageCompare[initkeys[i]].length > 0
        ) {
          imgTypeList[initkeys[i]] = this.imgTypeList[initkeys[i]]
        }
      }
      return imgTypeList
    },
    changefilterResult(value) {
      this.checkFilterResult = value
      this.imgTypeList2 = this.commonFilter(value)
      this.imageCompare2 = this.currData.imagesCompare[value]
      const imgkeys = Object.keys(this.imgTypeList2)
      const lastKey = imgkeys.length ? imgkeys.length - 1 : 0
      this.changeResult(imgkeys[lastKey])
    },
    close() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
  overflow: hidden;
}
.select-width {
  width: 90px;
}
.dialog-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-right: 30px;
}
.content {
  width: 100%;
  height: 70vh;
  min-height: 70vh;
  display: flex;
  .content-img {
    height: 100%;
    width: 50%;
    // flex:1;
    // overflow:hidden;
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
