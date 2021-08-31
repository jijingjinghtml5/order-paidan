<!--
version 1.1.0
图片查看
-->
<template>
  <div class="img-frames">
    <img v-if="swiper" class="ces" :src="url" @click.prevent="$emit('open-img')" />
    <slot v-else name="text" :zoomIn="zoomIn" />
    <div ref="box" :class="'image-check' + (open || show ? ' open' : '')">
      <div class="box" :style="moveCss()" @mousedown="toStart">
        <img ref="img" :src="url" draggable="false" />
      </div>
      <div class="handle">
        <div v-if="isRotate" @click.stop="imgZoomIn(1)">
          <i class="feicon-enlarge2" />
        </div>
        <div v-if="isRotate" @click.stop="imgZoomIn(2)">
          <i class="feicon-shrink2" />
        </div>
        <div v-if="isRotate" @click.stop="rotate(1)">
          <i class="feicon-reload" />
        </div>
        <div v-if="isRotate" style="transform: rotateY(180deg)" @click.stop="rotate(2)">
          <i class="feicon-reload" />
        </div>
      </div>
      <div class="close" @click="zoomOut">
        <div>
          <i class="el-icon-close" />
        </div>
      </div>

      <div v-if="swiper" class="pre-btn" @click="$emit('img-pre')">
        <i class="el-icon-arrow-left" />
      </div>
      <div v-if="swiper" class="next-btn" @click="$emit('img-next')">
        <i class="el-icon-arrow-right" />
      </div>
      <div v-if="swiper" class="pre-pagination" @click="$emit('img-pre')">
        {{ currIndex }}/{{ totle }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  filters: {},
  props: {
    swiper: {
      type: Boolean,
      default: false
    },
    show: {
      type: Boolean,
      default: false
    },
    url: {
      type: String,
      required: true
    },
    isRotate: {
      type: Boolean,
      default: false
    },
    totle: {
      type: Number,
      default: 0
    },
    currIndex: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      open: false,
      deg: 0,
      zoom: 100,
      height: 0,
      width: 0,
      top: 0,
      left: 0,
      moving: false,
      enlarge: false,
      oX: 0,
      oY: 0,
      oL: 0,
      oT: 0
    }
  },
  computed: {
    imgW() {
      return (this.width * this.zoom) / 100
    },
    imgH() {
      return (this.height * this.zoom) / 100
    },
    boxW() {
      if (this.width > this.height) {
        return (this.width * this.zoom) / 100
      } else {
        return (this.height * this.zoom) / 100
      }
    }
  },
  watch: {
    show() {
      this.zoomIn()
    }
  },
  mounted() {
    const _self = this
    const img = _self.$refs.img
    img.onload = () => {
      _self.initImgWH()
    }

    // 图片移动
    // eslint-disable-next-line
    $('.img-frames').on('mousemove.image', function (e) {
      if (!_self.moving) {
        return false
      }
      const x = e.clientX - _self.oX
      const y = e.clientY - _self.oY
      _self.top = _self.oT + y
      _self.left = _self.oL + x
      // console.log(x, _self.left, y, _self.top)
    })

    // 图片移动END
    // eslint-disable-next-line
    $('.img-frames').on('mouseup.image', function (e) {
      _self.toEnd()
    })
  },
  methods: {
    moveCss() {
      const css = {}
      css.width = this.imgW + 'px'
      css.height = this.imgH + 'px'
      css.left = this.left + 'px'
      css.top = this.top + 'px'
      css.transform = 'rotate(' + this.deg + 'deg)'
      return css
    },
    // 旋转
    rotate(direction) {
      this.deg += direction == 1 ? 90 : -90
    },
    // 图片放大
    imgZoomIn(mode) {
      this.zoom += mode == 1 ? 25 : -25
      if (this.zoom > 200) {
        this.zoom = 200
      } else if (this.zoom < 100) {
        this.zoom = 100
      }
    },
    zoomIn() {
      const _self = this
      this.initImgWH()
      if (!this.swiper) {
        _self.open = true
      }
      // eslint-disable-next-line
      $('.img-frames').on('scroll.preview', function (e) {
        e.preventDefault()
      })
    },
    zoomOut() {
      const _self = this
      if (!this.swiper) {
        this.open = false
      } else {
        _self.$emit('close-img')
      }
      this.initImgWH()
      this.zoom = 100
      this.deg = 0
      // eslint-disable-next-line
      $('.img-frames').off('scroll.preview')
    },
    initImgWH() {
      const box = this.$refs.box
      const img = this.$refs.img
      if (box && img) {
        const boxW = box.offsetWidth
        const boxH = box.offsetHeight
        const imgW = img.naturalWidth
        const imgH = img.naturalHeight
        // console.log('info', boxW, boxH, imgW, imgH)

        // 图片小于容器
        if (imgW < boxW && imgH < boxH) {
          this.width = imgW
          this.height = imgH
        } else if (imgW / imgH > boxW / boxH) {
          this.width = boxW
          this.height = (imgH * this.width) / imgW
        } else {
          this.height = boxH
          this.width = (imgW * this.height) / imgH
        }

        this.left = (boxW - this.width) / 2
        this.top = (boxH - this.height) / 2
        this.oL = this.left
        this.oT = this.top
      }
    },
    // 开始移动
    toStart(e) {
      this.oX = e.clientX
      this.oY = e.clientY
      this.moving = true
    },
    // 结束移动
    toEnd() {
      this.oL = this.left
      this.oT = this.top
      this.moving = false
    }
  }
}
</script>

<style lang="scss" scoped>
.pre-btn,
.next-btn {
  position: absolute;
  opacity: 0;
  top: 50%;
  bottom: 0;
  width: 40px;
  height: 40px;
  transition: 0.2s;
  font-size: 40px;
  color: #ffffff;
  cursor: pointer;
  transform: translate(0, -50%);
  background-color: rgba(0, 0, 0, 0.6);
  &:hover {
    opacity: 0.8 !important;
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
.pre-pagination {
  position: absolute;
  right: 60px;
  bottom: 40px;
  color: #000;
}

.img-frames {
  line-height: 0;
}

img {
  cursor: pointer;
}

.image-check {
  width: 100%;
  height: 100%;
  position: fixed;
  top: -9999px;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 200000;
  background-color: rgba(51, 49, 49, 0.4);
  overflow: hidden;
  .box {
    position: absolute;
    transition: transform 0.5s;
    img {
      opacity: 0;
      transition: opacity 0.3s;
      cursor: move;
      transform-origin: center;
      /* position: absolute; */
      width: 100%;
      height: 100%;
    }
  }

  &.open {
    top: 0;
    img {
      opacity: 1;
    }
    .handle,
    .close {
      display: block;
    }
  }

  .handle,
  .close {
    position: fixed;
    width: auto;
    height: auto;
    top: 20px;
    left: 50%;
    display: none;
    margin-left: -106px;
    opacity: 0.5;
    > div {
      width: 46px;
      height: 46px;
      display: inline-block;
      margin-right: 4px;
      cursor: pointer;
      background-color: #fff;
      border-radius: 5px;
      border: 1px solid #000;
      text-align: center;
      line-height: 44px;
      color: #000;
      font-size: 26px;
      transition: 0.2s;
      &:last-child {
        margin-right: 0;
      }
      &:hover {
        color: #ffffff;
        background-color: #9a9a9a;
      }
    }
    &.close {
      left: auto;
      right: 20px;
    }
  }

  &:hover {
    .pre-btn,
    .next-btn {
      opacity: 0.6;
    }
  }
}
</style>
