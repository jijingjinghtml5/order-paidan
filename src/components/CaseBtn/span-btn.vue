<template>
  <el-tooltip :content="`此案件已被 ${lockUser} 锁定，剩余${expireTime}`" :disabled="!lockUser">
    <span :style="lockUser ? 'color: gray;cursor: not-allowed;' : ''" @click="btnClick">
      <slot :lockUser="lockUser" />
    </span>
  </el-tooltip>
</template>

<script>
import { getLock } from '@/api/case'
import Storage from 'good-storage'

export default {
  props: {
    type: {
      type: String,
      default: ''
    },
    size: {
      type: String,
      default: ''
    },
    caseData: {
      type: Object,
      default: () => {}
    },
    resolve: {
      type: [String, Number],
      default: 0
    }
  },
  data() {
    return {}
  },
  computed: {
    lockUser() {
      if (this.caseData) {
        return this.resolve == 11
          ? ''
          : this.caseData.ext &&
            this.caseData.ext.lockInfo &&
            this.caseData.ext.lockInfo.status == 2
          ? this.caseData.ext.lockInfo.lockUser
          : ''
      } else {
        return ''
      }
    },
    isLock() {
      if (this.caseData) {
        return this.resolve == 11
          ? ''
          : this.caseData.ext.lockInfo
          ? this.caseData.ext.lockInfo.status != '0'
          : false
      } else {
        return ''
      }
    },
    eventId() {
      return this.caseData.event_filter_outer.event_id
    },
    coopId() {
      return this.caseData.event_filter_outer.coop_id
    },
    expireTime() {
      return this.caseData.ext.lockInfo.expire_time || ''
    },
    level() {
      return Storage.get('userInfor').level.split('-')[0]
    }
  },
  methods: {
    async btnClick() {
      if (!this.lockUser) {
        this.$emit('loading', true)
        const res = await getLock({
          eventId: this.eventId,
          coopId: this.coopId
        })
        this.$emit('loading', false)
        if (res.code == 200) {
          if (res.response.status == 2) {
            this.$message.warning(
              `案件已被${res.response.lockUser}锁定，剩余${res.response.expire_time}`
            )
            this.$emit('lockConfirm')
          } else if (res.response.status == 1) {
            this.$emit('click')
          }
        } else {
          this.$message.error(res.errors || '请求错误，请检查网络！')
        }
        // http
        //   .get(`/api_v3/app/event/get-lock`, {
        //     params: {
        //       eventId: this.eventId,
        //       coopId: this.coopId
        //     }
        //   })
        //   .then((res) => {
        //     this.$emit('loading', false)
        //     if (res.data.code == 200) {
        //       if (res.data.response.status == 2) {
        //         this.$message.warning(
        //           `案件已被${res.data.response.lockUser}锁定，剩余${res.data.response.expire_time}`
        //         )
        //         this.$emit('lockConfirm')
        //       } else if (res.data.response.status == 1) {
        //         this.$emit('click')
        //       }
        //     } else {
        //       this.$message.error(res.data.errors || '请求错误，请检查网络！')
        //     }
        //   })
        //   .catch((err) => {
        //     this.$emit('loading', false)
        //     this.$message.error(err || '请求错误，请检查网络！')
        //   })
      }
    }
  }
}
</script>
