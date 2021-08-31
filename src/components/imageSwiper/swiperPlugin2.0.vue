<template>
  <div class="image-list">
    <!-- ----------------1组--------------------------- -->
    <div v-if="text1" class="img_label">{{ text1 }}：</div>
    <div v-for="(img, i) in imgWall" :key="'img' + i" class="img-frame">
      <PreviewImg
        :key="'image' + i"
        :url="img.url"
        :text="text1"
        :is-rotate="isRotate"
        :swiper="swiper"
        :image-check-width="imageCheckWidth"
        :show="img.open"
        :rights="right1"
        :kaiguan="kaiguanL"
        :rightclose="right1close"
        :totle="totle"
        :curr-index="i + 1"
        @img-pre="imageChange('pre', i, imgWall)"
        @img-next="imageChange('next', i, imgWall)"
        @open-img="imageShow(true, i)"
        @close-img="imageShow(false, i)"
      >
        <template v-if="!swiper">
          <img :src="img.url" @click=";(imgWall[i].open = true), $forceUpdate()" />
        </template>
      </PreviewImg>
    </div>
    <!-- ----------------2组------------------------ -->
    <div v-if="text2" class="img_label">{{ text2 }}：</div>
    <div
      v-if="imgWalls.length >= 2 ? (imgWalls[1].length >= 1 ? '50%' : '100%') : '100%'"
      class="parent-img-frame"
    >
      <div v-for="(img, j) in imgWall2" :key="'img1' + j" class="img-frame">
        <PreviewImg
          :key="'image' + j"
          :url="img.url"
          :image-check-width="imageCheckWidth"
          :text="text2"
          :rights="left2"
          :rightclose="right2close"
          :kaiguan="kaiguanR"
          :is-rotate="isRotate"
          :swiper="swiper"
          :show="img.open"
          :totle="totle2"
          :curr-index="j + 1"
          @img-pre="imageChange2('pre', j, imgWall2)"
          @img-next="imageChange2('next', j, imgWall2)"
          @open-img="imageShow2(true, j)"
          @close-img="imageShow2(false, j)"
        >
          <template v-if="!swiper">
            <img :src="img.url" @click=";(imgWall2[j].open = true), $forceUpdate()" />
          </template>
        </PreviewImg>

        <template v-if="canDelete">
          <i class="el-icon-error img-delete" @click="delImg(i)" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import PreviewImg from './zd-ImageCheck-1.2.0.vue' // 图片预览组件

export default {
  components: {
    PreviewImg
  },
  props: {
    /* imgWall: {
      type: Array,
      default: res => []
    }, */
    text1: {
      type: String,
      default: ''
    },
    text2: {
      type: String,
      default: ''
    },
    imgWalls: {
      type: Array,
      default: () => []
    },
    types: {
      type: String,
      default: ''
    },
    swiper: {
      type: Boolean,
      default: false
    },
    isRotate: {
      type: Boolean,
      default: false
    },
    canDelete: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      imageCheckWidth:
        this.imgWalls.length >= 2 ? (this.imgWalls[1].length >= 1 ? '50%' : '100%') : '100%',
      kaiguanR: this.imgWalls.length >= 2 ? this.imgWalls[1].length >= 1 : false,
      kaiguanL: this.imgWalls.length >= 2 ? !(this.imgWalls[1].length >= 1) : true,
      right1: this.imgWalls.length >= 2 ? (this.imgWalls[1].length >= 1 ? '50%' : '') : '',
      left2: this.imgWalls.length >= 2 ? (this.imgWalls[1].length >= 1 ? '0%' : '') : '',
      right1close: this.imgWalls.length >= 2 ? (this.imgWalls[1].length >= 1 ? '52%' : '') : '',
      right2close: this.imgWalls.length >= 2 ? (this.imgWalls[1].length >= 1 ? '20px' : '') : '',
      currIndex: 1,
      currIndex2: 1,
      imgWall: this.imgWalls[0],
      imgWall2: this.imgWalls[1]
    }
  },
  computed: {
    totle() {
      return this.imgWall.length
    },
    totle2() {
      return this.imgWalls.length >= 2
        ? this.imgWalls[1].length >= 1
          ? this.imgWall2.length
          : 0
        : 0
    }
  },
  watch: {},
  mounted() {
    // console.log(this.imgWalls)
  },
  methods: {
    imageShow(val, index) {
      // 开关
      // console.log((this.imgWalls.length >= 2 ? (this.imgWalls[1].length >= 1) : false));
      if (val === true && (this.imgWalls.length >= 2 ? this.imgWalls[1].length >= 1 : false)) {
        this.imgWall2[0].open = true
        this.$forceUpdate()
      }
      if (val === false && (this.imgWalls.length >= 2 ? this.imgWalls[1].length >= 1 : false)) {
        this.imgWall2.forEach((v, i) => {
          this.imgWall2[i].open = false
        })
        this.$forceUpdate()
      }
      this.imgWall[index].open = val
      this.$forceUpdate()
    },

    imageShow2(val, index) {
      if (val === true) {
        this.imgWall[0].open = true
        this.$forceUpdate()
      }
      if (val === false) {
        this.imgWall.forEach((v, i) => {
          this.imgWall[i].open = false
        })
        this.$forceUpdate()
      }
      this.imgWall2[index].open = val
      this.$forceUpdate()
    },

    imageChange(direction, index, item) {
      const len = item.length
      item[index].open = false
      switch (direction) {
        case 'pre':
          // eslint-disable-next-line
          const i = index - 1 < 0 ? len - 1 : index - 1
          item[i].open = true
          break
        case 'next':
          // eslint-disable-next-line
          const j = index + 1 >= len ? 0 : index + 1
          item[j].open = true
          break
      }
      this.$forceUpdate()
    },
    imageChange2(direction, index, item) {
      const len = item.length
      item[index].open = false
      switch (direction) {
        case 'pre':
          // eslint-disable-next-line
          const i = index - 1 < 0 ? len - 1 : index - 1
          item[i].open = true
          break
        case 'next':
          // eslint-disable-next-line
          const j = index + 1 >= len ? 0 : index + 1
          item[j].open = true
          break
      }
      this.$forceUpdate()
    },
    delImg(index) {
      this.$emit('deleteImg', index)
    }
  }
}
</script>

<style lang="less">
.image-list {
  .img-frame {
    > div > img {
      max-height: 78px;
      max-width: 78px;
    }
  }
}
</style>
<style lang="less" scoped>
.image-list {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  .img_label {
    width: 100%;
    margin-bottom: 10px;
  }

  .parent-img-frame {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .img-frame {
    position: relative;
    width: 84px;
    height: 84px;
    box-shadow: 0 0 3px 0px rgba(0, 0, 0, 0.5);
    margin-right: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid #c0ccda;

    .img-delete {
      position: absolute;
      cursor: pointer;
      top: -2px;
      right: -6px;
      transition: 0.2s;
      opacity: 0;
      &:hover {
        color: red;
      }
    }

    &:hover {
      .img-delete {
        opacity: 1;
      }
    }

    > div > img {
      max-height: 82px;
      max-width: 82px;
    }
  }
}
</style>
