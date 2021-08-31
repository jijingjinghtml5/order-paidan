<template>
  <div class="z-page-wrapper">
    <div style="margin-bottom: 5px; padding: 0 16px">
      <span style="margin-left: 0">案件编号：{{ mapInfoData['code'] }}</span>
      <span>当前经纬度：{{ mapInfoData['x'] }}, {{ mapInfoData['y'] }}</span>
      <span v-if="mapInfoData['街道名称']">所属街道：{{ mapInfoData['街道名称'] }}</span>
      <span v-if="mapInfoData['居委会名称']">所属居委：{{ mapInfoData['居委会名称'] }}</span>
      <!-- <span v-if="mapInfoData['网格名称']" style="line-height: 28px;margin-left: 10px;">所属网格：{{ mapInfoData['网格名称'] }}</span> -->
      <span v-if="mapInfoData['网格编码']">网格编码：{{ mapInfoData['网格编码'] }}</span>
      <span v-if="mapInfoData['地址']">地址：{{ mapInfoData['地址'] }}</span>
    </div>
    <gismap
      :query-str="mapInfoData.gridcode"
      :mapdata="mapdata"
      :show-map="true"
      :can-click="false"
      style="height: calc(100vh - 33px)"
      @map-info="mapInfo"
    />
  </div>
</template>
<script>
import gismap from '@/components/gismap/index2'

export default {
  components: {
    gismap
  },
  data() {
    return {
      mapInfoData: {},
      mapdata: {}
    }
  },
  watch: {
    $route(newVal) {
      const params = newVal.query.params ? JSON.parse(unescape(newVal.query.params)) : {}
      this.mapInfoData = params
      this.mapdata = {
        x: params.x,
        y: params.y
      }
    }
  },
  mounted() {
    const params = this.$route.query.params ? JSON.parse(unescape(this.$route.query.params)) : {}
    this.mapInfoData = params
    this.mapdata = {
      x: params.x,
      y: params.y
    }
  },
  methods: {
    mapInfo() {}
  }
}
</script>
<style lang="less" scoped>
span {
  line-height: 28px;
  margin-left: 10px;
}
</style>
