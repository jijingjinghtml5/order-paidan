<template>
  <div class="cd-map">
    <!-- https://zw.zamplus.com/map/CGGisShare/GisShareApp3D.html -->
    <iframe
      id="cd-map"
      width="100%"
      height="100%"
      :src="mapHost + '/citygis/citymap/test'"
      frameborder="0"
      scrolling="no"
      marginheight="0"
      marginwidth="0"
    />
    <div class="map-btn" style="right:10px; top:160px;" @click="zoomIns">
      <!-- 放大 -->
      <span>+</span>
    </div>
    <div class="map-btn" style="right:10px; top:210px;" @click="zoomOuts">
      <!-- 缩小 -->
      <span>-</span>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { SHtoWGS } from "@/utils/index.js";
export default {
  props: {
    queryStr: {
      type: String,
      default: ''
    },
    mapLngLat: {
      type: Array,
      default: () => []
    },
    isCenter: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      mapHost: process.env.VUE_APP_MAP_URL,
      itemList: [
        { type: "公共设施", name: "上水井盖", layer: "上水井盖" },
        { type: "公共设施", name: "污水井盖", layer: "污水井盖" },
        { type: "公共设施", name: "雨水井盖", layer: "雨水井盖" },
        { type: "公共设施", name: "雨水篦子", layer: "雨水篦子" },
        { type: "公共设施", name: "电力井盖", layer: "电力井盖" },
        { type: "公共设施", name: "路灯井盖", layer: "路灯井盖" },
        { type: "公共设施", name: "电信井盖", layer: "电信井盖" },
        { type: "公共设施", name: "有线电视井盖", layer: "有线电视井盖" },
        { type: "公共设施", name: "网络井盖", layer: "网络井盖" },
        { type: "公共设施", name: "热力井盖", layer: "热力井盖" },
        { type: "公共设施", name: "燃气井盖", layer: "燃气井盖" },
        { type: "公共设施", name: "公安井盖", layer: "公安井盖" },
        { type: "公共设施", name: "消防井盖", layer: "消防井盖" },
        { type: "公共设施", name: "其它井盖", layer: "其它井盖" },
        { type: "公共设施", name: "信息交接箱", layer: "信息交接箱" },
        { type: "公共设施", name: "电力设施（设备）", layer: "电力设施设备" },
        { type: "公共设施", name: "电力杆", layer: "电力杆" },
        { type: "公共设施", name: "路灯", layer: "路灯" },
        { type: "公共设施", name: "消火栓", layer: "消火栓" },
        { type: "公共设施", name: "书报亭", layer: "书报亭" },
        { type: "公共设施", name: "电话亭", layer: "电话亭" },
        { type: "公共设施", name: "邮筒", layer: "邮筒" },
        { type: "公共设施", name: "信息亭", layer: "信息亭" },
        { type: "公共设施", name: "自动售货亭（站）", layer: "自动售货亭站" },
        { type: "公共设施", name: "健身设施", layer: "健身设施" },
        { type: "公共设施", name: "环卫井盖", layer: "环卫井盖" },
        { type: "公共设施", name: "移动井盖", layer: "移动井盖" },
        { type: "公共设施", name: "信息井盖", layer: "信息井盖" },
        { type: "公共设施", name: "联通井盖", layer: "联通井盖" },
        { type: "公共设施", name: "铁通井盖", layer: "铁通井盖" },
        { type: "公共设施", name: "网通井盖", layer: "网通井盖" },
        { type: "公共设施", name: "电信立杆", layer: "电信立杆" },
        { type: "公共设施", name: "市政立杆", layer: "市政立杆" },
        { type: "公共设施", name: "有线电视立杆", layer: "有线电视立杆" },
        { type: "公共设施", name: "其他立杆", layer: "其他立杆" },
        { type: "公共设施", name: "福利彩票亭", layer: "福利彩票亭" },
        { type: "公共设施", name: "体育彩票亭", layer: "体育彩票亭" },
        { type: "公共设施", name: "治安亭", layer: "治安亭" },
        { type: "公共设施", name: "景观灯光设施", layer: "景观灯光设施" },
        { type: "公共设施", name: "防汛墙", layer: "防汛墙" },
        { type: "公共设施", name: "晒衣架", layer: "晒衣架" },
        { type: "公共设施", name: "民用水井", layer: "民用水井" },
        { type: "公共设施", name: "燃气调压站", layer: "燃气调压站" },
        { type: "公共设施", name: "宣传栏（亭）", layer: "宣传栏亭" },
        { type: "公共设施", name: "综合杆", layer: "综合杆" },
        { type: "公共设施", name: "综合井盖", layer: "综合井盖" },
        { type: "道路交通", name: "公共交通站牌", layer: "公共交通站牌" },
        {
          type: "道路交通",
          name: "道路停车场计费表",
          layer: "道路停车场计费表"
        },
        { type: "道路交通", name: "公共交通站亭", layer: "公共交通站亭" },
        { type: "道路交通", name: "出租车扬招牌", layer: "出租车扬招牌" },
        { type: "道路交通", name: "人行天桥", layer: "人行天桥" },
        { type: "道路交通", name: "交通信息亭", layer: "交通信息亭" },
        { type: "道路交通", name: "门牌", layer: "门牌" },
        { type: "道路交通", name: "桥梁", layer: "桥梁" },
        { type: "道路交通", name: "道路指示牌", layer: "道路指示牌" },
        { type: "道路交通", name: "交通控制箱", layer: "交通控制箱" },
        { type: "道路交通", name: "交通立杆", layer: "交通立杆" },
        {
          type: "道路交通",
          name: "非机动车停放点（亭）",
          layer: "非机动车停放点亭"
        },
        { type: "道路交通", name: "路名牌", layer: "路名牌" },
        { type: "道路交通", name: "公交拉杆", layer: "公交拉杆" },
        { type: "道路交通", name: "人行分隔设施", layer: "人行分隔设施" },
        { type: "道路交通", name: "机非分隔设施", layer: "机非分隔设施" },
        { type: "道路交通", name: "路中分隔设施", layer: "路中分隔设施" },
        { type: "道路交通", name: "河道护栏", layer: "河道护栏" },
        { type: "道路交通", name: "绿地护栏", layer: "绿地护栏" },
        { type: "道路交通", name: "交通信号灯", layer: "交通信号灯" },
        { type: "道路交通", name: "无障碍标牌", layer: "无障碍标牌" },
        { type: "道路交通", name: "无障碍设施", layer: "无障碍设施" },
        { type: "道路交通", name: "桥孔道班房", layer: "桥孔道班房" },
        { type: "道路交通", name: "桥孔停车场", layer: "桥孔停车场" },
        {
          type: "道路交通",
          name: "桥孔禁入栅（安全护栏）",
          layer: "桥孔禁入栅安全护栏"
        },
        { type: "道路交通", name: "桥孔检查井", layer: "桥孔检查井" },
        { type: "环卫环保", name: "公共厕所", layer: "公共厕所" },
        { type: "环卫环保", name: "倒粪站（小便池）", layer: "倒粪站小便池" },
        { type: "环卫环保", name: "公厕导向牌", layer: "公厕导向牌" },
        { type: "环卫环保", name: "垃圾箱房", layer: "垃圾箱房" },
        { type: "环卫环保", name: "废物箱（桶）", layer: "废物箱桶" },
        { type: "环卫环保", name: "交通噪声指示牌", layer: "交通噪声指示牌" },
        { type: "园林绿化", name: "行道树", layer: "行道树" },
        { type: "园林绿化", name: "单位绿化", layer: "单位绿化" },
        { type: "园林绿化", name: "花架花钵", layer: "花架花钵" },
        { type: "园林绿化", name: "小区绿化", layer: "小区绿化" },
        { type: "园林绿化", name: "雕塑", layer: "雕塑" },
        { type: "园林绿化", name: "街头座椅", layer: "街头座椅" },
        { type: "园林绿化", name: "公共绿地", layer: "公共绿地" },
        { type: "园林绿化", name: "河道绿化", layer: "河道绿化" },
        { type: "其它设施", name: "重大危险源", layer: "重大危险源" }
      ],
      isResize: false
    };
  },
  computed: {
    ...mapState(["location"])
  },
  mounted() {
    // console.log(' this.queryStr', this.queryStr);

    const _self = this;
    // var str = "网格编码='" + this.queryStr  + "'";
    // const str = this.queryStr
    // 地图加载完成
    window.maploadCallback = function() {
      _self.toLocation(); // 定位
      _self.addGrid(); // 标注网格  单网格
      _self.$emit("loaded");
    };
    // 地图大小改变
    window.resizeCallback = function() {
      // console.log("map moveend");
      if (_self.isResize) {
        _self.isResize = false;
        return;
      }
      _self.$emit("moveend");
    };
    // 地图点击事件回调(必须点击图层，空白处无效)
    window.mapOnclickCallback = function(data, grid) {
      _self.$emit("select-item", data, grid);
    };
    window.mapAnimationInProgressCallback = function() {
      // console.log("resize");
      _self.$emit("resize");
      _self.isResize = true;
    };
    window.mapDragingCallback = function() {
      // console.log("mapDragingCallback");
    };
  },
  methods: {
    // 放大
    zoomIns() {
      window.mapLevelCallback = function(level) {
        const _l = parseInt(level);
        if (_l >= 13) {
          return false;
        }
        window.ZoomIn(_l + 1);
      };
      window.doOnMapLevel();
    },
    // 缩小
    zoomOuts() {
      window.mapLevelCallback = function(level) {
        const _l = parseInt(level);
        if (_l <= 1) {
          return false;
        }
        window.ZoomOut(_l - 1);
      };
      window.doOnMapLevel();
    },
    // 返回当前定位
    toAim() {
      // GPS
      const lng =
        this.location.lng && this.location.lng != 0
          ? this.location.lng
          : 121.95826566937939;
      const lat =
        this.location.lat && this.location.lat != 0
          ? this.location.lat
          : 31.191056091658137;
      // console.log(lng, lat)
      window.doOnMapSetCenter(lng, lat);
    },

    // 放大缩小指定层级
    zoomTo(level) {
      let _l = level;
      if (level < 4) {
        _l = 4;
      }
      if (level > 13) {
        _l = 13;
      }
      window.ZoomOut(_l);
    },
    // 定位打点（84）
    toLocation(lng, lat) {
      // console.log('定位打点（84） toLocation');
      var Attribute = "{}";
      // var ToolTip = "";
      var ImgUrl = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAA0ppVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMDY3IDc5LjE1Nzc0NywgMjAxNS8wMy8zMC0yMzo0MDo0MiAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QkY1NDkyNUIyMDdCMTFFQUJGNjI4MDg4OTY4NkIwM0QiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QkY1NDkyNUEyMDdCMTFFQUJGNjI4MDg4OTY4NkIwM0QiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1Yzg1MDg1OC0yMDdiLTExZWEtYjMzMC1iOWFhNGZlZWM2MzYiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo1Yzg1MDg1OC0yMDdiLTExZWEtYjMzMC1iOWFhNGZlZWM2MzYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6g+DxuAAABK0lEQVR42ryWoQ6CUBiF4Z/ZRGMYfAAn0c1iMRndLLyCj2CyW3wFi5vRZCEadWxWi6OZ3Oyeu53LHBNE5fdsX4FxDly4/8H1F3enRAEYgB7ogjbwwBWcwRHsQQwuRSZuQYgPIjABofNeB7AGK5DmTzZeXDAEUzByqiskfbAEu7KQMZiBjvOdzI21QBNs7EHJPcEvAVYd+gzzIT6X6NeA56ApfbOQ6MN3UHXpIhsS8CvSkPENhPsgVAoxvgPhRtNUT7iTNdUVjgpNtYWzSFOecNhp6iqcppo6C8e1po7CPtDUXlg4B6UA4xsLG22tFGJ8L3ZAmkbb1hywpW82hVM2WlJTQEK/NF9apjLnNQQl9NkV1a+pzNsXHf+8RG873j7Rqc6/Ffcf/10PAQYAFGVD65e3+10AAAAASUVORK5CYII=";
      var ImgWidth = "20px";
      var ImgHeight = "20px";
      // 如果没有有经纬度
      // console.log('lng,lat:' ,lng,lat);

      if (this.mapLngLat[0] === undefined && this.mapLngLat[1] === undefined) {
        return false;
      }
      const maplng = Number(this.mapLngLat[0]);
      const maplat = Number(this.mapLngLat[1]);
      // 如果经纬度为0
      if (maplng === 0 && maplat === 0) {
        return false;
      }
      const newLngLat = SHtoWGS([maplng, maplat]); // 转化后的经纬度
      this.getGridByGPS(newLngLat[0], newLngLat[1]); // 根据网格编码获取网格
      window.doOnLocation( // 打点
        newLngLat[0],
        newLngLat[1],
        Attribute,
        "",
        ImgUrl,
        ImgWidth,
        ImgHeight
      );
      // window.doOnLocation(lng, lat, Attribute, "", ImgUrl, ImgWidth, ImgHeight);
    },

    // 获得中心（xy）
    getCenter() {
      const _self = this;
      window.mapCenterCallback = function(data) {
        const _d = JSON.parse(data);
        // console.log(_d.x, _d.y)
        _self.$emit("get-center", _d);
      };
      window.doOnMapCenter();
    },
    // 设置中心（84）
    setCenter(lng, lat) {
      // console.log(lng, lat)
      window.doOnMapSetCenter(lng, lat);
    },
    // 标注网格  单网格
    addGrid(queryStr) {
      const str = this.queryStr
      const queryStrs = str === '' || str == undefined ? queryStr : str;
      // console.log('网格标注中：',queryStrs);
      const _self = this;
      window.queryByGeometryAndLayer = function(data) {
        _self.$emit("add-grid");
      };
      // var str = "网格编码='" + 123456 + "'" ;
      var strs = "网格编码='" + queryStrs + "'";
      window.doGridQuery(strs);
      // console.log('网格标注完成');
    },

    // 查询部件（自定义条件）
    addItemByCond(cond, layer) {
      const _self = this;
      window.queryByGeometryAndLayer = function(list) {
        _self.$emit("search-item-cond", list);
      };
      window.doNewQuery(cond, layer);
    },
    // 查询部件（网格）
    addItemByGrid(grid, layer) {
      const _self = this;
      window.queryByGeometryAndLayer = function(list) {
        _self.$emit("search-item-grid", list);
      };
      const _l = this.itemList.find(item => {
        return item.name == layer;
      });
      window.doOnQueryByGrid(grid, _l.layer);
    },
    // 查询部件（xy）
    addItemByXY(x, y, layername, isDraw = true) {
      const _self = this;
      window.queryByGeometryAndLayer = function(list) {
        // console.log(list)
        _self.$emit("search-item-xy", list);
      };
      const radius = 20; // 米
      // console.log(x, y)
      const xy = SHtoWGS([x, y]);
      // console.log(xy)
      const _l = _self.itemList.find(item => {
        return item.name == layername;
      });
      // eslint-disable-next-line
      doOnQueryByPoint(xy[0], xy[1], _l.layer, radius, isDraw);
    },
    // 清除指定图层
    clear(layer = "all") {
      // drawLayer|queryLayer
      window.postToIframeMethed("Clear", layer);
    },
    // 清除所有图层
    clearAll() {
      this.clear("drawLayer");
      this.clear("queryLayer");
      // window.Clear()
    },
    // 获得位置所属网格（84）
    getGridByGPS(lng, lat) {
      const _self = this;
      window.identifyTaskcallbackfun = function(grid) {
        // console.log("get-grid 2");
        _self.$emit("get-grid", grid);
      };

      window.doOnLocationforGrid(lng, lat);
    },
    // 撒点撒线
    addMarker(feature) {
      const list = {
        ExChangeRoot: {
          Features: feature
        }
      };
      window.doGetGraphicByJson(JSON.stringify(list));
    },
    // 获得位置信息（84）
    getAddressByGPS(lng, lat) {
      const _self = this;
      window.addressdataCallback = function(address) {
        _self.$emit("get-address", address);
      };
      window.doOnLocationforAddress(lng, lat);
    },
    // 测距
    getDistanceByGPS(lng1, lat1, lng2, lat2) {
      const _self = this;
      window.measureLengthCallback = function(len) {
        const _l = Math.floor(len * 1000);
        _self.$emit("get-distance", _l);
      };
      window.doMeasureLengthByPoint(
        lng1,
        lat1,
        lng2,
        lat2,
        "measureLengthCallback"
      );
    }
  }
};
</script>

<style lang="less" scoped>
.cd-map {
  width: 100%;
  height: 100%;
  position: relative;
}

.map-btn {
  width: 44px;
  height: 44px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: #fff;
  // color: #1989fa;
  color: rgb(148, 132, 132);
  border-radius: 2px;
  cursor: pointer;
  span {
    font-size: 26px;
  }
}

.center {
  position: absolute;
  left: 50%;
  top: 50%;
  line-height: 0;
  transform: translate(-50%, -100%);
}
</style>
