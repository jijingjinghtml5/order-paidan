<template>
  <div v-loading="loading" class="common-card">
    <div :style="'max-height: calc(100vh - ' + setCardHeight + 'px);'" class="card-scroll">
      <el-card
        v-for="(item, index) in tableData"
        :key="item.id + '' + index"
        class="case-card-item"
        shadow="hover"
      >
        <div slot="header" class="card-header">
          <div :style="{ width: isResolve == 1 ? 'calc(100% - 46px)' : 'calc(100% - 162px)' }">
            <el-row>
              <el-col :span="6">
                <div class="header-cell" style="display: flex">
                  <!-- <slot name="lock" :data="item.event" /> -->
                  <text-tooltip
                    :title="'案件编号：'"
                    content=""
                    :slot-content="item.event.code"
                    class="wid100"
                    ref-name="caseCode"
                  >
                    <span class="cell-item">{{ item.event.code }}</span>
                  </text-tooltip>
                </div>
              </el-col>
              <el-col :span="6">
                <text-tooltip
                  :title="'案件来源：'"
                  content=""
                  :slot-content="`${searchEventSource(item.event.source)}`"
                  class="wid100 header-cell"
                  ref-name="caseSource"
                >
                  <span class="cell-item">{{ searchEventSource(item.event.source) }}</span>
                </text-tooltip>
              </el-col>
              <el-col v-if="isResolve != '1'" :span="6">
                <!-- <text-tooltip
                :title="'上报时间：'"
                :content="new Date(item.event.event_time * 1000).Format('yyyy-MM-dd HH:mm:ss')"
                class="wid100 header-cell"
                ref-name="eventTime"
              /> -->
                <text-tooltip
                  :title="'上报时间：'"
                  :content="new Date(item.event.event_time * 1000).Format('yyyy-MM-dd HH:mm:ss')"
                  class="wid100 header-cell"
                  ref-name="eventTime"
                />
              </el-col>
              <el-col v-if="isResolve == 1" :span="6">
                <text-tooltip
                  :title="'流转时间：'"
                  :content="item.order_step && item.order_step.created_at"
                  class="wid100 header-cell"
                  ref-name="eventTime"
                />
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="content">
          <div style="flex: 1; min-width: calc(100% - 162px)">
            <el-row>
              <el-col :span="6">
                <text-tooltip
                  class="wid100 content-cell"
                  :title="'发现方式：'"
                  :content="getDiscover(item.event.discover_type)"
                  ref-name="discoverType"
                />
              </el-col>
              <el-col :span="6">
                <text-tooltip
                  class="wid100 content-cell"
                  :title="'所属平台：'"
                  :content="`${item.event.meta_level3_name}${item.event.meta_level4_name}`"
                  ref-name="districtName"
                />
              </el-col>
              <el-col :span="6">
                <text-tooltip
                  class="wid100 content-cell"
                  :title="'所属网格：'"
                  :content="item.event.gridCenterName ? item.event.gridCenterName : '-'"
                  ref-name="gridCenter"
                />
              </el-col>
              <el-col :span="6">
                <text-tooltip
                  class="wid100 content-cell"
                  :title="'案件阶段：'"
                  :content="codeDict && codeDict[item.event_filter_outer.period_status]"
                  ref-name="stepStatus"
                />
              </el-col>
              <el-col :span="6">
                <text-tooltip
                  class="wid100 content-cell"
                  :title="'案件分类：'"
                  :content="fullEventType(item)"
                  ref-name="fullEventType"
                />
              </el-col>
              <el-col :span="6">
                <text-tooltip
                  class="wid100 content-cell"
                  :title="'发生地址：'"
                  :content="item.event.address"
                  ref-name="address"
                />
              </el-col>
              <el-col :span="6" class="content-report">
                <text-tooltip
                  class="wid100 content-cell"
                  :title="'上报方式：'"
                  :content="getReport(item.event.submit_type)"
                  ref-name="selfReport"
                />
              </el-col>
              <el-col :span="6">
                <text-tooltip
                  class="wid100 content-cell"
                  :title="'上报人：'"
                  :content="item.event.discover_username"
                  ref-name="reportName"
                />
              </el-col>
              <el-col :span="6">
                <text-tooltip
                  class="wid100 content-cell"
                  :title="'案件状态：'"
                  :content="codeDict && codeDict[item.event_filter_outer.status]"
                  ref-name="status"
                />
              </el-col>
              <template v-if="item.event.tags">
                <!-- <el-col :span="6">
                  <text-tooltip class="wid100 content-cell" :title="'申诉类型：'" :content="requestName[item.request.requestType]" ref-name="requestTypeDucha" />
                </el-col> -->
                <!-- <div v-if="item.superviseNotFound === true || item.superviseFound === true" class="examine-type">
                  <img :src="inspectionImgs[item.superviseNotFound === true ?'noFound':item.superviseFound === true ?'hasFound':'']" alt="">
                </div> -->
                <div class="examine-type">
                  <img
                    v-for="(tag, tagindex) in item.event.tags"
                    :key="tagindex"
                    :src="inspectionImgs[tag]"
                    alt=""
                  />
                </div>
              </template>
            </el-row>
          </div>
          <slot name="actions" :index="index" :data="item" />
        </div>
      </el-card>
      <div v-if="!tableData.length && !loading" class="empty">暂无数据</div>
    </div>
    <div style="margin-top: 10px; text-align: right">
      <el-pagination
        v-if="!loading"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import TextTooltip from '@/components/TextTooltip'

export default {
  name: 'CommonCard',
  components: {
    TextTooltip
  },
  props: {
    setCardHeight: {
      type: [Number, String],
      default: 325
    },
    tableData: {
      type: Array,
      default: () => []
    },
    isResolve: {
      type: [Number, String],
      default: '0'
    },
    loading: {
      type: Boolean,
      default: false
    },
    currentPage: {
      type: [Number, String],
      default: '0'
    },
    total: {
      type: [Number, String],
      default: 0
    },
    pageSize: {
      type: [Number, String],
      default: 10
    }
  },
  data() {
    return {
      inspectionImgs: {
        // 'hasFound': require('@/assets/images/hasFound.png'),
        // 'noFound': require('@/assets/images/noFound.png'),
        'OS-TAG-002': '', // require('@/assets/images/duban.png'),
        'OS-TAG-003': '' // require('@/assets/images/source3.png')
        // 'zuofei': require('@/assets/images/zuofei.png'),
        // 'tuidan': require('@/assets/images/tuidan.png'),
      }
    }
  },
  computed: {
    ...mapGetters(['eventType', 'reportTypes', 'eventSource', 'discoverTypes', 'codeDict'])
  },
  watch: {},
  mounted() {
    //
  },
  methods: {
    // 搜索案件来源
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
    // 处理event type
    fullEventType(row) {
      return `${row.event.event_type1}-${row.event.event_type2}-${row.event.event_type3}-${row.event.name}`
    },
    sizeChange(size) {
      this.$emit('size-change', size)
    },
    currentChange(page) {
      this.$emit('current-change', page)
    }
  }
}
</script>

<style scoped lang="scss">
.common-card {
  position: relative;
  min-height: 100px;
  ::v-deep {
    .el-card__header {
      // padding: 10px 0;
      padding: 7px 0;
      .card-header {
        position: relative;
        display: flex;
        .status {
          display: flex;
          justify-content: flex-start;
          position: absolute;
          left: 200px;
          top: 16px;
          .btn + .btn {
            margin-left: 10px;
          }
        }
      }
    }
    .el-card__body {
      padding: 0 0 10px 0;
    }
    .el-button + .el-button {
      margin: 10px 0 0 10px;
    }
  }

  .cell {
    color: #303133;
    position: absolute;
    right: 20px;
    top: -30px;
    font-size: 14px;
    cursor: pointer;
  }
  .card-scroll {
    overflow: auto;
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 12px;
      // box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      background: rgba(144, 147, 153, 0.3);
    }
    .case-card-item {
      border: none;
      margin-top: 10px;
      padding: 0 10px;
      &:hover {
        background: #f5f7fa;
      }
      &:first-child {
        margin-top: 0;
      }
    }
  }
  .empty {
    height: 90px;
    text-align: center;
    line-height: 90px;
    font-size: 14px;
    color: #909399;
    background: #ffffff;
  }
}

.content {
  display: flex;
  min-height: 75px;
  align-items: center;
  .source {
    width: 50px;
    height: 50px;
    margin-right: 20px;
    vertical-align: center;
  }
  .content-cell {
    font-size: 12px;
    line-height: 1;
    color: #606266;
    margin-top: 15px;
    width: 98%;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    overflow: hidden;
    &:hover {
      text-overflow: inherit;
      overflow: visible;
      white-space: normal;
    }
  }
  .desc {
    text-overflow: inherit;
    overflow: visible;
    white-space: normal;
  }
  .content-report {
    position: relative;
    .case-source {
      position: absolute;
      top: -30px;
      right: 5px;
      img {
        width: 100px;
      }
    }
  }
  .examine-type {
    position: absolute;
    top: -30px;
    right: 5px;
    img {
      width: 114px;
    }
  }
  .card-btn {
    color: #5b5bd5;
    font-size: 14px;
    line-height: 75px;
    flex: 1;
    text-align: right;
    cursor: pointer;
    .card-icon {
      margin-right: 4px;
    }
  }
}
.header-cell {
  font-size: 14px;
  padding: 0;
  width: 98%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  // line-height: 1;
  line-height: 20px;

  &:hover {
    text-overflow: inherit;
    overflow: hidden;
    white-space: normal;
  }
  .cell-item {
    color: #5b5bd5;
  }
}
</style>
