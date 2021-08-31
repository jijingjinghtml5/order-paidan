<template>
  <div class="steps">
    <div class="title">
      <p>流转时间</p>
      <p>流转人员</p>
      <p>流转部门</p>
      <p>流转意见</p>
    </div>
    <div v-for="(item, index) in realAllStage" :key="item.id" class="circle">
      <div
        v-if="index != realAllStage.length - 1"
        class="line"
        :class="{ done: currentStateIndex > index }"
      >
        <span class="line-icon" :class="{ done: currentStateIndex > index }">></span>
      </div>
      <div
        class="circle1"
        :class="{ done: currentStateIndex > index, ing: currentStateIndex == index }"
      >
        <div
          class="circle2"
          :class="{ done: currentStateIndex > index, ing: currentStateIndex == index }"
        >
          {{ codeDict[item.key] }}
        </div>
      </div>
      <div
        v-if="steps[index] && (currentStateIndex > index || index == realAllStage.length - 1)"
        class="info"
      >
        <p>{{ steps[index].created_at }}</p>
        <p>{{ getName(steps[index]) }}</p>
        <template>
          <p>{{ getDepartment(steps[index]) }}</p>
          <!-- <p v-if="`上海市${item.districtName ? `-${item.districtName}` : ''}${item.streetName ? `-${item.streetName}` : ''}${item.departmentName ? `-${currData.discover.departmentName}` : ''}`.length <= 20">{{ `上海市${currData.discover.districtName ? `-${currData.discover.districtName}` : ''}${currData.discover.streetName ? `-${currData.discover.streetName}` : ''}${currData.discover.departmentName ? `-${currData.discover.departmentName}` : ''}` }}</p>
          <el-tooltip v-else class="item" effect="dark" :content="`上海市${item.districtName ? `-${item.districtName}` : ''}${item.streetName ? `-${currData.discover.streetName}` : ''}${currData.discover.departmentName ? `-${currData.discover.departmentName}` : ''}`" placement="top-start">
            <p>{{ `上海市${item.districtName ? `-${item.districtName}` : ''}${item.streetName ? `-${item.streetName}` : ''}${item.departmentName ? `-${currData.discover.departmentName}` : ''}`.slice(0, 20) }}...</p>
          </el-tooltip> -->
        </template>
        <p v-if="getDesc(steps[index].form).length < 20">{{ getDesc(steps[index].form) }}</p>
        <el-tooltip
          v-else
          class="item"
          effect="dark"
          :content="getDesc(steps[index].form)"
          placement="top-start"
        >
          <p>{{ getDesc(steps[index].form).slice(0, 20) }}...</p>
          <p>1</p>
        </el-tooltip>
      </div>
      <div v-else class="info">
        <p />
        <p />
        <p />
        <p />
      </div>
    </div>
    <dialog-coop
      :show-coop="showCoop"
      :title="title"
      :coop-list="coopList"
      @close=";(showCoop = false), (coopList = [])"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import dialogCoop from './dialog-coop.vue'

export default {
  components: {
    dialogCoop
  },
  props: {
    currData: {
      required: true,
      type: Object,
      default: () => {}
    },
    selfReport: {
      type: [String, Number],
      default: 0
    },
    stream: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      showCoop: false,
      coopList: [],
      title: '',
      currentState: '',
      currentStateIndex: '',
      steps: [],
      realAllStage: []
    }
  },
  computed: {
    ...mapGetters(['codeDict', 'casePeriod'])
  },
  watch: {},
  created() {
    this.initData()
  },
  methods: {
    // 初始化阶段数据
    initData() {
      const stage = this.casePeriod.map((item) => item.code)
      const allStage = stage
        .map((item) => {
          for (const stage in this.currData.all_status) {
            if (item === stage) {
              return { key: item, value: this.currData.all_status[stage] }
            }
          }
        })
        .filter((item) => item)
      this.currentState = this.currData.status.stage_code
      this.currentStateIndex = allStage.findIndex((item) => item.key === this.currentState)
      const steps = []
      allStage.forEach((item) => {
        for (const ele of this.stream) {
          if (item.value.includes(ele.status)) {
            steps.push(ele)
            return
          }
        }
      })
      this.realAllStage = allStage
      this.steps = steps
    },
    getDesc(val) {
      const form = JSON.parse(val)
      let desc = ''
      if (Array.isArray(form)) {
        form.forEach((ele) => {
          if (ele.key === 'description') {
            desc = ele.value
          }
          if (ele.description) {
            desc = ele.description
          }
        })
      }
      return desc
    },
    getName(val) {
      return JSON.parse(val.ext_data).opt_username
    },
    getDepartment(val) {
      const extData = JSON.parse(val.ext_data)
      return `${extData.from_meta_level1_name ? extData.from_meta_level1_name : ''}${
        extData.from_meta_level2_name ? `/${extData.from_meta_level2_name}` : ''
      }${extData.from_meta_level3_name ? `/${extData.from_meta_level3_name}` : ''}${
        extData.from_meta_level4_name ? `/${extData.from_meta_level4_name}` : ''
      }${extData.from_meta_level5_name ? `/${extData.from_meta_level5_name}` : ''}`
    },
    viewXie(title) {
      this.title = title
      this.coopList = this.currData.coopDeal
      this.showCoop = true
    }
  }
}
</script>

<style lang="less" scoped>
.steps {
  display: flex;
  .circle {
    position: relative;
    margin-right: 40px;
  }
  .circle1 {
    width: 64px;
    height: 64px;
    border: 2px solid #afbacb;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    &.done {
      color: #5b5bd5;
      border: 2px solid #5b5bd5;
    }
    &.ing {
      color: #fff;
      border: 2px solid #5b5bd5;
    }
    .circle2 {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      text-align: center;
      line-height: 50px;
      color: #999999;
      &.done {
        color: #5b5bd5;
      }
      &.ing {
        color: #fff;
        background: #5b5bd5;
      }
    }
  }
  .info {
    margin-top: 20px;
    p {
      height: 41px;
      min-width: 150px;
      color: #5e6470;
      white-space: pre;
      line-height: 40px;
      border-top: 1px dashed rgba(91, 91, 213, 0.1);
      &:last-child {
        border-bottom: 1px dashed rgba(91, 91, 213, 0.1);
      }
    }
  }
  .line {
    border-bottom: 2px dashed #afbacb;
    position: absolute;
    width: calc(100% - 65px);
    left: 80px;
    top: 32px;
    &.done {
      color: #5b5bd5;
      border-bottom: 2px dashed rgba(91, 91, 213, 0.8);
    }
    &.ing {
      color: #5b5bd5;
      border-bottom: 2px dashed rgba(91, 91, 213, 0.8);
    }
    .line-icon {
      position: absolute;
      right: -12px;
      top: -12px;
      font-size: 24px;
      color: #afbacb;
      &.ing {
        color: rgba(91, 91, 213, 0.8);
      }
      &.done {
        color: rgba(91, 91, 213, 0.8);
      }
    }
    .line-more {
      color: #333;
      position: absolute;
      top: -20px;
      font-size: 12px;
    }
    .line-see {
      color: #5b5bd5;
      cursor: pointer;
    }
  }
  .title {
    margin: 84px 24px 0 20px;
    p {
      white-space: pre;
      color: #424754;
      font-weight: bold;
      line-height: 41px;
    }
  }
}
</style>
