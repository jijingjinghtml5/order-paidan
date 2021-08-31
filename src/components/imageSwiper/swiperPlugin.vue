<template>
  <div class="image-lists">
    <div v-for="(img, i) in imgWall" :key="'img' + i" class="img-frame">
      <!-- <img :src="img.url"> -->
      <previewImg
        :key="'image' + i"
        :url="img.url"
        :is-rotate="isRotate"
        :swiper="swiper"
        :show="img.open"
        :totle="totle"
        :curr-index="i + 1"
        @img-pre="imageChange('pre', i, imgWall)"
        @img-next="imageChange('next', i, imgWall)"
        @open-img=";(imgWall[i].open = true), $forceUpdate()"
        @close-img=";(imgWall[i].open = false), $forceUpdate()"
      >
        <template v-if="!swiper" v-slot>
          <img :src="img.url" @click=";(imgWall[i].open = true), $forceUpdate()" />
        </template>
      </previewImg>
      <template v-if="canDelete">
        <i class="el-icon-error img-delete" @click="delImg(i)" />
      </template>
    </div>
  </div>
</template>

<script>
import previewImg from '@/components/imageSwiper/zd-ImageCheck-1.1.0'

export default {
  components: {
    previewImg
  },
  props: {
    imgWall: {
      type: Array,
      default: () => []
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
      currIndex: 1
    }
  },
  computed: {
    totle() {
      return this.imgWall.length
    }
  },
  methods: {
    imageShow(val, index) {
      this.imgWall[index].open = val
      this.$forceUpdate()
    },
    imageChange(direction, index, item) {
      const len = item.length
      item[index].open = false
      switch (direction) {
        case 'pre':
          // eslint-disable-next-line
          let i = index - 1 < 0 ? len - 1 : index - 1
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
.image-lists {
  .img-frame {
    > div > img {
      max-height: 78px;
      max-width: 78px;
    }
  }
}
</style>
<style lang="less" scoped>
.image-lists {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
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
