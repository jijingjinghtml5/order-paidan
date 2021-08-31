<template>
  <div class="case-header">
    <div>
      <span>
        案件编号：<span class="detail-word">{{ currData.code }}</span>
      </span>
      <span class="detail-tips">
        <!-- <case-tooltip :item="currData" /> -->
        <span style="marginleft: 5px">
          <el-tooltip class="item" effect="dark" content="请尽快处理！" placement="top-start">
            <svg-icon v-if="currData.isUrge" icon-class="催" class-name="icon" />
          </el-tooltip>
        </span>
      </span>
    </div>
    <slot name="operation" />
  </div>
</template>

<script>
// import caseTooltip from '@/components/case-tooltip'
export default {
  components: {
    // caseTooltip
  },
  props: {
    currData: {
      required: true,
      type: Object
    }
  },
  data() {
    return {}
  },
  watch: {},
  created() {},
  methods: {
    getDeadline(timeline) {
      if (timeline) {
        const deadline = new Date(timeline).getTime()
        const currtime = new Date().getTime()
        const surplusTime = deadline - currtime
        if (surplusTime > 0) {
          return this.formatDuring(surplusTime)
        } else {
          return '已逾期'
        }
      } else {
        return ''
      }
    },
    formatDuring(mss) {
      const days = parseInt(mss / (1000 * 60 * 60 * 24))
      const hours = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60))
      // var seconds = (mss % (1000 * 60)) / 1000;
      return '剩余' + days + '天 ' + hours + '小时 ' + minutes + '分钟'
    }
  }
}
</script>

<style lang="scss" scoped>
.case-header {
  height: 50px;
  padding: 11px 16px;
  background: #ffffff;
  margin: 10px 0 0;
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #424754;
  line-height: 28px;
  border-bottom: 1px solid rgba(91, 91, 213, 0.2);

  .detail-word {
    color: rgba(91, 91, 213, 1);
  }

  .detail-tips {
    margin: 0 0 0 10px;

    .icon {
      font-size: 18px;
    }
  }
}
</style>
