<template>
  <div>
    <el-row :gutter="2" class="detail-base-line">
      <el-col :lg="6" :xs="24" :sm="12" :md="12">
        <div v-if="!canEdit" class="content-box">
          <text-tooltip
            class="wid100 content-word"
            :title="'案件分类：'"
            :content="fullEventType(currData.event)"
            ref-name="fullEventType"
          />
        </div>
      </el-col>
      <el-col :lg="6" :xs="24" :sm="12" :md="12">
        <div v-if="!canEdit" class="content-box">
          <text-tooltip
            class="wid100 content-word"
            :title="'案件名称：'"
            :content="currData.event.name"
            ref-name="eventName"
          />
        </div>
        <div v-else>
          <span class="item-span"><span style="color: red">*</span>案件名称：</span>
          <el-select v-model="form.eventName" filterable clearable placeholder="请选择案件名称">
            <el-option
              v-for="(item, index) in eventOptions"
              :key="index"
              style="width: 300px"
              :title="item.label"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </div>
      </el-col>
      <el-col :lg="6" :xs="24" :sm="12" :md="12">
        <div class="content-box">
          <text-tooltip
            class="wid100 content-word"
            :title="'案件来源：'"
            :content="searchEventSource(currData.event.source)"
            ref-name="source"
          />
        </div>
      </el-col>
      <el-col :lg="6" :xs="24" :sm="12" :md="12">
        <div class="content-box">
          <text-tooltip
            class="wid100 content-word"
            :title="'发现方式：'"
            :content="getDiscover(currData.event.discover_type)"
            ref-name="discoverType"
          />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="2" class="detail-base-line">
      <el-col :lg="6" :xs="24" :sm="12" :md="12">
        <div class="content-box">
          <text-tooltip
            class="wid100 content-word"
            :title="'上报方式：'"
            :content="getReport(currData.event.submit_type)"
            ref-name="selfReport"
          />
        </div>
      </el-col>
      <el-col :lg="6" :xs="24" :sm="12" :md="12">
        <div class="content-box">
          <text-tooltip
            class="wid100 content-word"
            :title="'上报时间：'"
            :content="currData.event.event_time"
            ref-name="eventTime"
          />
        </div>
      </el-col>
      <el-col :lg="6" :xs="24" :sm="12" :md="12">
        <div class="content-box" />
        <text-tooltip
          class="wid100 content-word"
          :title="'上报人：'"
          :content="currData.event.discover_username"
          ref-name="reportUser"
        />
      </el-col>
      <el-col :lg="6" :xs="24" :sm="12" :md="12">
        <div class="content-box">
          <text-tooltip
            class="wid100 content-word"
            :title="'所属区镇：'"
            :content="currData.event.meta_level3_name"
            ref-name="districtName"
          />
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="2" class="detail-base-line detail-base-last-line">
      <el-col :lg="6" :xs="24" :sm="12" :md="12">
        <div class="content-box">
          <text-tooltip
            class="wid100 content-word"
            :title="'所属街镇：'"
            :content="currData.event.meta_level4_name"
            ref-name="streetName"
          />
        </div>
      </el-col>
      <el-col :lg="6" :xs="24" :sm="12" :md="12">
        <div class="content-box">
          <text-tooltip
            class="wid100 content-word"
            :title="'所属居委：'"
            :content="currData.event.meta_level5_name"
            ref-name="communityName"
          />
        </div>
      </el-col>
      <el-col :lg="6" :xs="24" :sm="12" :md="12">
        <div class="content-box">
          <text-tooltip
            class="wid100 content-word"
            :title="'所属网格：'"
            :content="currData.event.gridCenterName + ''"
            ref-name="gridName"
          />
        </div>
      </el-col>
      <el-col :lg="6" :xs="24" :sm="12" :md="12">
        <div class="content-box">
          <text-tooltip
            class="wid100 content-word"
            :title="'小区名称：'"
            :content="currData.event.community"
            ref-name="estate_name"
          />
        </div>
      </el-col>
      <!-- <el-col v-if="$route.query.type == 11 && $route.query.isResolve != 1" :lg="6" :xs="24" :sm="12" :md="12">
        <div class="content-box">
          <text-tooltip class="wid100 content-word" :title="'申诉类型：'" :content="currData.requestType == 1 ? '申诉合并':currData.requestType == 2 ? '申诉作废':''" ref-name="requestType" />
        </div>
      </el-col> -->

      <!-- <el-col v-if="(($route.query.type == 1 && $route.query.val1) || ($route.query.type == 2 && $route.query.val5) || ($route.query.type == 3 && $route.query.isResolve != 1)) && !(currData.source == 7 && userInfo.district_id == 6)" :lg="6" :xs="24" :sm="12" :md="12">
        <div class="content-box">
          <text-tooltip class="wid100 content-word" :title="'相关街道：'" :content="currData.relatedStreetName ? currData.relatedStreetName : '-'" ref-name="relatedStreetName" />
        </div>
      </el-col> -->
    </el-row>
  </div>
</template>

<script>
import Storage from 'good-storage'
import { mapGetters } from 'vuex'
import { getEventTypeDict } from '@/api/case'
import textTooltip from '@/components/TextTooltip'

export default {
  components: {
    textTooltip
  },
  props: {
    currData: {
      required: true,
      type: Object
    },
    canEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      eventOptions: [],
      form: {
        eventType: [],
        eventName: ''
      },
      userInfo: Storage.get('userInfor')
    }
  },
  computed: {
    allStreets() {
      return this.streets
    },
    allEventsName() {
      const newEventName = []
      this.eventTypeNew.map((first) => {
        first.children &&
          first.children.map((second) => {
            second.children &&
              second.children.map((third) => {
                newEventName.push(third)
              })
          })
      })
      return newEventName
    },
    eventArr() {
      return this.eventType.map((child1) => {
        const arr1 = { ...child1 }
        if (arr1.name === '部件') {
          arr1.children = arr1.children.filter((item) => item.name !== '玻璃幕墙安全监管')
        }
        return arr1
      })
    },
    ...mapGetters([
      'eventType',
      'eventTypeNew',
      'eventSource',
      'streets',
      'codeDict',
      'reportTypes',
      'discoverTypes'
    ])
  },
  watch: {
    eventType(newVal) {
      if (newVal && newVal.length > 0) this.treeHandle(this.form.eventType, newVal, 0)
    }
  },
  created() {
    Promise.all([
      // this.getEventNames()
    ]).then(() => {
      this.form.eventType = [
        this.currData.eventType1,
        this.currData.eventType2,
        this.currData.eventType3
      ]
      this.form.eventName = this.currData.name
      this.levelThreeChange(this.form.eventType, 'edit')
    })
  },
  methods: {
    // 案件分类
    fullEventType(row) {
      return row.event_type1 + '-' + row.event_type2 + '-' + row.event_type3
    },
    // 案件来源
    searchEventSource(row) {
      const item =
        this.eventSource &&
        this.eventSource.find((item) => {
          return item.id == row
        })
      return item ? item.name : '其它'
    },
    // 处理发现方式
    getDiscover(val) {
      const result = this.discoverTypes.find((item) => item.id == val)
      return result ? result.name : '其他'
    },
    // 处理上报方式
    getReport(val) {
      const result = this.reportTypes.find((item) => item.id == val)
      return result ? result.name : '其他'
    },
    // 根据街道id获取街道名称
    getDiscoverStreet(id) {
      const confirm = this.allStreets.find((item) => {
        return item.id == id
      })
      if (confirm) return confirm.name
    },
    async getEventNames() {
      const res = await getEventTypeDict({})
      if (res.data.code === 200) {
        this.allEventsName = res.data.data
      }
      // await http({
      //   method: 'get',
      //   url: process.env.VUE_APP_LIST_URL + '/meta-data/event-type-dict',
      //   params: {}
      // }).then((res) => {
      //   if (res.data.code === 200) {
      //     this.allEventsName = res.data.data
      //   }
      // })
    },
    treeHandle(option, artList, index) {
      const arr = JSON.parse(JSON.stringify(this.allEventsName))
      for (let i = 0; i < artList.length; i++) {
        if (artList[i].name == option[index]) {
          if (index === 2) {
            return arr.forEach((item) => {
              if (item.code == artList[i].code) {
                item.children.forEach((value) => {
                  const obj = {
                    label: value.name,
                    value: value.name
                  }
                  this.eventOptions.push(obj)
                })
              }
            })
          }
          const obj = artList[i].children
          this.treeHandle(option, obj, index + 1)
        }
      }
    },
    levelThreeChange(option, op) {
      if (op != 'edit') {
        this.eventOptions = []
        this.form.eventName = null
      }
      if (op == 'edit' && option) {
        if (this.eventType && this.eventType.length > 0) {
          this.treeHandle(option, this.eventType, 0)
        }
      } else {
        this.treeHandle(option, this.eventType, 0)
      }
    },
    // 发现方式
    searchDiscoverMode(eventSource) {
      if (eventSource) {
        switch (Number(eventSource)) {
          case 1:
            return '主动发现'
          case 2:
            return '被动发现'
          case 3:
            return '自动发现'
          default:
            return '其他'
        }
      } else {
        return '其他'
      }
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

.detail-base-last-line {
  border-bottom: 1px dashed rgba(91, 91, 213, 0.1);
}
</style>
