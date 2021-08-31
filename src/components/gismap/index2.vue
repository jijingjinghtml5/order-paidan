<template>
  <div class="cd-map">
    <!-- https://zw.zamplus.com/map/CGGisShare/GisShareApp3D.html -->
    <iframe
      id="gisIframe"
      :src="mapHost + '/citygis/gistools/#/map/city'"
      frameborder="0"
      width="100%"
      height="100%"
      scrolling="no"
      marginheight="0"
      marginwidth="0"
    />
    <!-- <div class="map-btn" style="right:10px; top:160px;" @click="zoomin">
      放大
      <span>+</span>
    </div>
    <div class="map-btn" style="right:10px; top:210px;" @click="zoomout">
      缩小
      <span>-</span>
    </div> -->
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import { WGStoSH, SHtoWGS } from "@/utils/index.js";
// import Storage from "good-storage";
// const webToken = Storage.get("webToken");
export default {
  props: {
    queryStr: {
      type: String,
      default: ''
    },
    mapdata: {
      type: Object,
      default: () => ({
        x: 0,
        y: 0
      })
    },
    mapLngLat: {
      type: Array,
      default: () => []
    },
    isCenter: {
      type: Boolean,
      default: false
    },
    canClick: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      mapHost: process.env.VUE_APP_MAP_URL,
      isResize: false,
      bridge: undefined,
      mapFlag: false
    }
  },
  computed: {
    ...mapState(['location'])
  },
  watch: {
    queryStr(val) {
      if (val) {
        const str = "网格编码='" + val + "'"
        if (this.canClick) {
          this.addGrid(str)
        } else {
          this.addArea(val)
        }
      }
    },
    mapdata(newVal) {
      this.ShowData1(newVal)
      // _self.addGrid()
      this.toLocat(newVal.x, newVal.y)
    }
  },
  mounted() {
    const _self = this
    // const token = Storage.get("webToken");
    // eslint-disable-next-line
    this.bridge = new CityGis.Bridge({
      id: 'gisIframe',
      url: 'http://10.81.71.51/citygis/gistools/#/map/city',
      onReady: () => {
        // _self.toLocat(0, 0);
        if (_self.canClick) {
          _self.addGrid("网格编码='" + _self.queryStr + "'")
        } else {
          _self.addArea(_self.queryStr)
        }

        _self.ShowData1(_self.mapdata)
        // _self.addGrid()
        _self.toLocat(_self.mapdata.x, _self.mapdata.y)
        if (_self.canClick) {
          _self.outPosition('start')
        }
      }
    })
    this.bridge.addEventListener((arg) => {
      switch (arg.action) {
        case 'getPoint':
          _self.$emit('map-info', arg.data ? JSON.stringify(arg.data) : '')
          break
        default:
          console.log()
      }
    }, this)
  },
  methods: {
    // 清空
    ResetMap() {},
    // 清空
    Clear() {},
    // 区域定位
    doQueryLocate() {
      const commonparam = {
        ActionName: 'doQueryLocate',
        Parameters: JSON.stringify({
          layername: '区县边界',
          where: "区县代码='06'",
          options: {
            layerid: '区县定位',
            islocate: true,
            isshow: true,
            layerRender: {
              type: 'simple', // autocasts as new SimpleRenderer()
              symbol: {
                type: 'line-3d',
                symbolLayers: [
                  {
                    type: 'line',
                    size: 5,
                    material: { color: 'red' }
                  }
                ]
              }
            }
          }
        })
      }
      this.bridge.Invoke(commonparam)
    },
    // 地图点选
    outPosition(flag) {
      const commonparam = {
        ActionName: 'outputClickPosition',
        Parameters: {
          type: 'position',
          mode: flag,
          popupEnabled: false,
          symbol: {
            type: 'simple-marker',
            size: 10,
            color: '#0044c6',
            outline: {
              width: 0.5,
              color: 'white'
            }
          }
        }
      }
      this.bridge.Invoke(commonparam)
    },
    // 绘制点
    ShowData1(mapdata) {
      const data = mapdata
      const commonparam = {
        ActionName: 'ShowData',
        Parameters: JSON.stringify({
          name: 'eventPointLayer',
          type: 'point',
          mode: 'replace',
          data: {
            content: [data],
            parsegeometry: 'function(item){return {x:item.x, y:item.y}}'
          },
          legendVisible: false,
          popupEnabled: false,
          isFiltered: false,
          isLocate: false,
          renderer: {
            type: 'simple',
            label: 'layerName',
            symbol: {
              type: 'simple-marker',
              size: 12,
              color: '#0044c6',
              outline: {
                width: 0.5,
                color: 'white'
              }
            }
          }
        })
      }
      this.bridge.Invoke(commonparam)
    },
    // 绘制网格
    addGrid(grid) {
      const commonparam = {
        ActionName: 'ShowData',
        Parameters: {
          name: 'car_layer',
          type: 'layer',
          isLocate: true,
          data: {
            layers: {
              name: '责任网格',
              where: grid
            }
          },
          labels: [
            {
              fields: ['#.名称', '#.序号'],
              color: [255, 255, 0, 0.5],
              size: 12
            }
          ],
          renderer: {
            type: 'simple',
            symbol: {
              type: 'line-3d',
              symbolLayers: [
                {
                  type: 'line',
                  size: 3,
                  material: {
                    color: 'red'
                  }
                }
              ]
            }
          }
        }
      }
      this.bridge.Invoke(commonparam)
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
    },
    toLocat(x, y) {
      const commandParams = {
        ActionName: 'goToPosition',
        Parameters: JSON.stringify({
          mode: 'replace',
          positon: { x, y, z: 10 },
          hasImg: false,
          tilt: 0,
          radius: 1,
          zoom: 4
        })
      }
      this.bridge.Invoke(commandParams)
    },
    zoomin() {
      this.bridge.Invoke({
        ActionName: 'ZoomIn'
      })
    },
    zoomout() {
      this.bridge.Invoke({
        ActionName: 'ZoomOut'
      })
    },
    ClearPostion() {
      this.bridge.Invoke({
        ActionName: 'Clear',
        Parameters: JSON.stringify({
          position: false,
          search: false
        })
      })
    }
  }
}
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
  font-size: 26px;
}

.center {
  position: absolute;
  left: 50%;
  top: 50%;
  line-height: 0;
  transform: translate(-50%, -100%);
}
</style>
