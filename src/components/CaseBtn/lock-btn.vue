<template>
  <div v-if="isLock == 2 || isLock == 1" style="text-align: center">
    <el-tooltip :content="`此案件已被 ${lockUser} 锁定，剩余${expireTime}`" :disabled="isLock != 2">
      <i
        class="case_lock"
        :class="{
          'el-icon-lock': isLock == 1 || isLock == 2,
          'el-icon-unlock': isLock == 0,
          can_lock: isLock == 1
        }"
      />
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: {
    caseData: {
      required: true,
      type: Object,
      default: () => {}
    },
    resolve: {
      type: [String, Number],
      default: 0
    }
  },
  computed: {
    isLock() {
      return this.resolve == 11 ? '' : this.caseData.ext.lockInfo.status || 0
    },
    lockUser() {
      return this.resolve == 11 ? '' : this.caseData.ext.lockInfo.lockUser || ''
    },
    expireTime() {
      return this.caseData.ext.lockInfo.expire_time || ''
    },
    eventId() {
      return this.caseData.event_filter_outer.event_id
    }
  },
  methods: {}
}
</script>

<style lang="scss">
.case_lock {
  font-size: 20px;
  cursor: pointer;
}
.can_lock {
  color: #5b5bd5;
  &:hover {
    color: #5b5bd5;
  }
}
</style>
