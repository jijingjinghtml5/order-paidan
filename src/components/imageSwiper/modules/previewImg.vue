<template>
  <div class="outer">
    <div class="abbreviate-content">
      <div
        v-for="(item, index) in img"
        :key="index"
        class="abbreviate-solid"
        :class="{ active: currIndex === index }"
        @click="tabCaseIndex(index)"
      >
        <img :src="sourceUrl(item)" alt="" class="abbreviate-img" />
      </div>
    </div>
    <div v-if="img && img.length" class="preview">
      <div class="img-operate">
        <i title="放大" class="cyicon cyicon-fangda" @click="changeScale('add')" />
        <i title="缩小" class="cyicon cyicon-suoxiao" @click="changeScale('minus')" />
        <i title="右旋转" class="cyicon cyicon-rightrotate" @click="changeRotate('add')" />
        <i title="左旋转" class="cyicon cyicon-leftrotate" @click="changeRotate('minus')" />
        <i title="全屏" class="cyicon el-icon-full-screen" @click="changeFull" />
      </div>
      <div
        v-if="img.length > 1"
        class="pre-btn"
        :class="{ end: currIndex === 0 }"
        @click="preImg('img')"
      >
        <i class="el-icon-arrow-left" />
      </div>
      <!-- {
            transform: 'rotate(' + imgDeg + 'deg) scale(' + imgScale + ')',
          } -->
      <div
        ref="imgout"
        class="img-out"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
      >
        <img ref="img" :style="styleObj" :src="sourceUrl(img[currIndex])" alt="" class="img" />
      </div>
      <div
        v-if="img.length > 1"
        class="next-btn"
        :class="{ end: currIndex === img.length - 1 }"
        @click="nextImg('img')"
      >
        <i class="el-icon-arrow-right" />
      </div>
    </div>
    <full-image :img-list="previewImg" :show-viewer="showPreview" @close="hidePreview" />
  </div>
</template>
<script>
import fullImage from './fullImageView'

export default {
  name: 'PreviewImg',
  components: {
    fullImage
  },
  props: {
    showImg: {
      type: Boolean,
      default: false
    },
    img: {
      type: Array,
      default: () => []
    },
    index: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {
      resourceHost: process.env.VUE_APP_ASSET_URL,
      imgDeg: 0,
      imgScale: 1,
      currIndex: 0,
      initX: '',
      initY: '',
      canDrag: false,
      styleObj: null,
      imgWidth: 0,
      imgHeight: 0,
      previewImg: [],
      showPreview: false
    }
  },
  watch: {
    index() {
      this.currIndex = this.index
      // this.imgDeg = 0
      // this.imgScale = 1
      this.initImg()
    },
    img() {
      this.currIndex = this.index
      // this.imgDeg = 0
      // this.imgScale = 1
      this.initImg()
    },
    showImg(newVal) {
      if (newVal) {
        this.currIndex = this.index
        // this.imgDeg = 0
        // this.imgScale = 1
        this.initImg()
      }
    }
  },
  mounted() {
    this.currIndex = this.index
    this.initImg()
  },
  methods: {
    changeFull() {
      this.showPreview = true
      const src = this.sourceUrl(this.img[this.currIndex])
      this.previewImg = [src]
    },
    hidePreview() {
      this.showPreview = false
    },
    initImg() {
      this.imgDeg = 0
      this.imgScale = 1
      this.canDrag = false
      if (this.img[this.currIndex]) {
        const imgout = this.$refs.imgout.getBoundingClientRect()
        const src = this.sourceUrl(this.img[this.currIndex])
        const image = new Image()
        image.src = src
        // 计算初始化样式
        image.onload = () => {
          if ((imgout.width / image.width) * image.height <= imgout.height) {
            this.imgWidth = imgout.width
            this.imgHeight = (imgout.width / image.width) * image.height
          } else {
            this.imgHeight = imgout.height
            this.imgWidth = (imgout.height / image.height) * image.width
          }
          this.marginLeft = imgout.width / 2 - this.imgWidth / 2
          this.marginTop = imgout.height / 2 - this.imgHeight / 2
          this.setStyle()
        }
      }
    },
    // 设置图片的缩放旋转移动
    setStyle() {
      this.styleObj = `width:${this.imgScale * this.imgWidth}px;height:${
        this.imgScale * this.imgHeight
      }px;transform: rotate(${this.imgDeg}deg);margin-left:${this.marginLeft}px;margin-top:${
        this.marginTop
      }px;`
    },
    // 旋转图片
    changeRotate(type) {
      if (type == 'add') {
        this.imgDeg += 90
      } else {
        this.imgDeg -= 90
      }
      this.setStyle()
    },
    // 放大缩小图片  因为缩放造成宽高发生变化，所有margin值也要相应的变化，确保是在中心点上
    changeScale(type) {
      if (type == 'add') {
        this.imgScale += 0.2
        this.marginTop -= 0.1 * this.imgHeight
        this.marginLeft -= 0.1 * this.imgWidth
      } else {
        this.imgScale -= 0.2
        this.marginTop += 0.1 * this.imgHeight
        this.marginLeft += 0.1 * this.imgWidth
      }
      this.setStyle()
    },
    sourceUrl(url) {
      return `${this.resourceHost}/${url}`
    },
    tabCaseIndex(val) {
      this.currIndex = val
      // this.changeStyle();
      this.initImg()
    },
    // changeStyle() {
    //   this.imgDeg = 0;
    //   this.imgScale = 1;
    // },
    preImg() {
      if (this.currIndex > 0) {
        this.currIndex -= 1
        // this.changeStyle();
        this.initImg()
      }
    },
    nextImg() {
      if (this.currIndex < this.img.length - 1) {
        this.currIndex += 1
        // this.changeStyle();
        this.initImg()
      }
    },
    handleMouseDown(e) {
      e.preventDefault()
      this.initX = e.clientX
      this.initY = e.clientY
      this.canDrag = true
    },
    handleMouseMove(e) {
      e.stopPropagation()
      e.preventDefault()
      if (this.canDrag) {
        this.marginTop += e.clientY - this.initY
        this.marginLeft += e.clientX - this.initX
        this.initY = e.clientY
        this.initX = e.clientX
        this.setStyle()
        const imgout = this.$refs.imgout.getBoundingClientRect()
        const divx1 = imgout.left
        const divy1 = imgout.top
        const divx2 = divx1 + imgout.width
        const divy2 = divy1 + imgout.height
        if (
          e.clientX < divx1 + 5 ||
          e.clientX > divx2 - 5 ||
          e.clientY < divy1 + 5 ||
          e.clientY > divy2 - 5
        ) {
          // 当鼠标离开组件时不可拖动
          this.canDrag = false
        }
      }
    },
    handleMouseUp() {
      this.canDrag = false
    }
  }
}
</script>
<style lang="less" scoped>
.outer {
  width: 100%;
  height: calc(100% - 30px);
}
.abbreviate-content {
  display: flex;
  margin-top: 10px;
  width: 100%;
  .abbreviate-solid {
    padding: 5px 8px;
    border: 1px solid #fff;
    margin-right: 10px;
    background-color: rgba(91, 91, 213, 0.2);
    text-align: center;
    cursor: pointer;
    img {
      display: block;
      height: 45px;
    }
  }
  .abbreviate-solid.active {
    border: 1px solid #5b5bd5;
  }
}
.img-operate {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  .cyicon {
    font-size: 24px;
    padding: 0 5px;
    background: rgba(0, 0, 0, 0.7);
    color: #fff;
  }
}
.preview {
  height: calc(100% - 70px);
  overflow: hidden;
  margin-top: 10px;
  position: relative;
  // width:100%;
  .img-out {
    width: 100%;
    height: 100%;
    overflow: hidden;
    .img {
      display: block;
      cursor: move;
    }
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
</style>
