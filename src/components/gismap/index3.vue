<template>
  <div class="cd-map">
    <!-- https://zw.zamplus.com/map/CGGisShare/GisShareApp3D.html -->
    <iframe
      id="gisIframe"
      :src="mapHost+'/citygis/gistools/#/map/city'"
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
import { mapState } from "vuex";
// import { WGStoSH, SHtoWGS } from "@/utils/index.js";
import Storage from "good-storage";
// const webToken = Storage.get("webToken");
export default {
  props: {
    chooseLocation: {
      type: Array,
      default: () => []
    },
    chooseName: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      mapHost: process.env.VUE_APP_MAP_URL,
      isResize: false,
      bridge: undefined,
      mapFlag: false
    };
  },
  computed: {
    ...mapState(["location"])
  },
  watch: {
    chooseLocation(val) {
      this.drawLocation(val, this.chooseName)
    }
  },
  mounted() {
    const _self = this;
    // const token = Storage.get("webToken");
    // eslint-disable-next-line
    this.bridge = new CityGis.Bridge({
      id: "gisIframe",
      url:
        "http://10.81.71.51/citygis/gistools/#/map/city",
      onReady: function() {
        // // _self.toLocat(0, 0);
        // _self.addGrid("网格编码='" + _self.queryStr + "'");

        // _self.ShowData1(_self.mapdata);
        // // _self.addGrid()
        // _self.toLocat(_self.mapdata.x, _self.mapdata.y);

        _self.outPosition("start");
        _self.drawLocation(_self.chooseLocation, _self.chooseName)
      }
    });
    this.bridge.addEventListener(function(arg) {
      switch (arg.action) {
        case "getPoint":
          _self.$emit("map-info", arg.data ? JSON.stringify(arg.data) : "");
          break;
      }
    }, this);
  },
  methods: {
    drawLocation(val, name) {
      this.ClearPostion()
      this.outPosition("start");
      if (val.length == 3) {
        const str = "网格编码='" + val[2] + "'";
        this.addGrid(str);
      } else if (val.length == 2) {
        const districtCode = val[0]
        const streetCode = val[1]
        this.addStreet(districtCode, streetCode, name[1])
      } else if (val.length == 1) {
        const districtCode = val[0]
        const districtName = name[0]
        this.queryDistrict(districtCode, districtName)
        this.addDistrict(districtCode, districtName)
      } else {
        this.ShowData1({ x: 0, y: 0 });
        this.toLocat(0, 0);
      }
    },
    addStreet(districtCode, streetCode, streetName) {
      // const userInfo = Storage.get('userInfor')
      if (!streetName) return
      const streetCmd = {
        ActionName: 'ShowData',
        Parameters: {
          name: '"car_layer',
          type: 'layer',
          isLocate: true,
          highLight: {
            "color": "green"
          },
          data: {
            layers: {
              name: "街道乡镇",
              where: "街道代码='" + streetCode + "'",
              join: '街道名称=' + streetName
            }
          },
          renderer: {
            type: "simple",
            symbol: {
              type: "line-3d",
              symbolLayers: [
                {
                  type: "line",
                  size: 2,
                  material: {
                    color: "green"
                  }
                }
              ]
            }
          }
        }
      }
      this.bridge.Invoke(streetCmd)
    },
    addDistrict(districtCode, districtName) {
      const cmd = {
        ActionName: 'ShowData',
        Parameters: {
          name: 'addDistrict',
          type: 'layer',
          highLight: {
            "color": "#1483fb"
          },
          isLocate: true,
          data: {
            layers: {
              name: '区县边界',
              where: "区代码='" + districtCode + "'"
            },
          },
          renderer: {
            type: "simple",
            symbol: {
              type: "line-3d",
              symbolLayers: [
                {
                  type: "line",
                  size: 3,
                  material: {
                    color: "#1483fb"
                  }
                }
              ]
            }
          }
        }
      }
      this.bridge.Invoke(cmd)
    },
    // 周边灰色
    queryDistrict(districtId, districtName) {
      // const userInfo = Storage.get('userInfor')
      if (!districtName) {
        return
      }
      const cmd = {
        ActionName: 'ShowData',
        Parameters: {
          name: 'districtBoundary',
          type: 'layer',
          popupEnabled: false,
          legendVisible: false,
          isLocate: false,
          data: {
            content: this.yeildDistrictData(districtName),
            layers: {
              name: '区县边界'
            },
            join: '区县名称=name'
          },
          renderer: {
            type: 'unique-value',
            field: 'typeValue',
            uniqueValueInfos: [
              {
                value: '1',
                // 高亮颜色
                symbol: {
                  type: 'simple-fill',
                  color: [
                    128,
                    216,
                    33,
                    0
                  ],
                  style: 'solid',
                  outline: {
                    color: [
                      15,
                      185,
                      208,
                      0.8
                    ],
                    width: 2
                  }
                }
              },
              {
                value: '0',
                // 非高亮颜色
                symbol: {
                  type: 'simple-fill',
                  color: [
                    163,
                    167,
                    175,
                    0.3
                  ],
                  style: 'solid',
                  outline: {
                    color: [
                      15,
                      0,
                      208,
                      0.5
                    ],
                    width: 1
                  }
                }
              }
            ]
          }
        }
      }
      this.bridge.Invoke(cmd)
    },
    yeildDistrictData(name) {
      const names = ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区', '杨浦区', '闵行区', '宝山区', '嘉定区', '浦东新区', '金山区', '松江区', '青浦区', '奉贤区', '崇明区']
      const data = []
      names.forEach(n => {
        if (name === n) {
          data.push({ name: n, typeValue: '1' })
        } else {
          data.push({ name: n, typeValue: '0' })
        }
      })
      return data
    },
    // 地图点选
    outPosition(flag) {
      const commonparam = {
        ActionName: "outputClickPosition",
        Parameters: {
          type: "position",
          mode: flag,
          popupEnabled: false,
          symbol: {
            type: "simple-marker",
            size: 10,
            color: "#0044c6",
            outline: {
              width: 0.5,
              color: "white"
            }
          }
        }
      };
      this.bridge.Invoke(commonparam);
    },
    // 绘制点
    ShowData1(mapdata) {
      const data = mapdata
      const commonparam = {
        ActionName: "ShowData",
        Parameters: JSON.stringify({
          name: "eventPointLayer",
          type: "point",
          mode: "replace",
          data: {
            content: [data],
            parsegeometry: "function(item){return {x:item.x, y:item.y}}"
          },
          legendVisible: false,
          popupEnabled: false,
          isFiltered: false,
          isLocate: false,
          renderer: {
            type: "simple",
            label: "layerName",
            symbol: {
              type: "simple-marker",
              size: 12,
              color: "red",
              outline: {
                width: 0.5,
                color: "white"
              }
            }
          }
        })
      };
      this.bridge.Invoke(commonparam);
    },
    // 绘制网格
    addGrid(grid) {
      const commonparam = {
        ActionName: "ShowData",
        Parameters: {
          name: "car_layer",
          type: "layer",
          isLocate: true,
          data: {
            layers: {
              name: "责任网格",
              where: grid
            }
          },
          labels: [
            {
              fields: ["#.名称", "#.序号"],
              color: [255, 255, 0, 0.5],
              size: 12
            }
          ],
          renderer: {
            type: "simple",
            symbol: {
              type: "line-3d",
              symbolLayers: [
                {
                  type: "line",
                  size: 3,
                  material: {
                    color: "red"
                  }
                }
              ]
            }
          }
        }
      };
      this.bridge.Invoke(commonparam);
    },
    toLocat(x, y) {
      const commandParams = {
        ActionName: "goToPosition",
        Parameters: JSON.stringify({
          mode: "replace",
          positon: { x, y, z: 10 },
          hasImg: false,
          tilt: 0,
          radius: 1,
          zoom: 4
        })
      };
      this.bridge.Invoke(commandParams);
    },
    zoomin() {
      this.bridge.Invoke({
        ActionName: "ZoomIn"
      });
    },
    zoomout() {
      this.bridge.Invoke({
        ActionName: "ZoomOut"
      });
    },
    ClearPostion() {
      this.bridge.Invoke({
        ActionName: "Clear",
        Parameters: JSON.stringify({
          position: false,
          search: false
        })
      });
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
