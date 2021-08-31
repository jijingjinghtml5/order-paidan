<template>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="app-breadcrumb">
    <transition-group name="breadcrumb">
      <el-breadcrumb-item key="1">{{
        $route.query && $route.query.type && $route.query.type.indexOf('self') !== -1
          ? '我的案件'
          : '案件管理'
      }}</el-breadcrumb-item>
      <el-breadcrumb-item
        v-if="$route.query.type == 'inspection'"
        key="11"
        :to="{ path: '/inspection' }"
        >案件督查</el-breadcrumb-item
      >
      <el-breadcrumb-item v-if="$route.query.type == '1'" key="2" :to="{ path: '/discover' }"
        >案件发现</el-breadcrumb-item
      >
      <el-breadcrumb-item v-if="$route.query.type == '2'" key="3" :to="{ path: '/confirm' }"
        >案件立案</el-breadcrumb-item
      >
      <el-breadcrumb-item v-if="$route.query.type == '3'" key="4" :to="{ path: '/dispatch' }"
        >案件派遣</el-breadcrumb-item
      >
      <el-breadcrumb-item v-if="$route.query.type == '4'" key="5" :to="{ path: '/resolve' }"
        >案件处置</el-breadcrumb-item
      >
      <el-breadcrumb-item v-if="$route.query.type == '5'" key="6" :to="{ path: '/check' }"
        >案件核查</el-breadcrumb-item
      >
      <el-breadcrumb-item v-if="$route.query.type == '6'" key="7" :to="{ path: '/finish' }"
        >案件结案</el-breadcrumb-item
      >
      <el-breadcrumb-item
        v-if="$route.query.type == 'self-1'"
        key="8"
        :to="{ path: '/self-discover' }"
        >发现列表</el-breadcrumb-item
      >
      <el-breadcrumb-item
        v-if="$route.query.type == 'self-2'"
        key="9"
        :to="{ path: '/self-confirm' }"
        >核实列表</el-breadcrumb-item
      >
      <el-breadcrumb-item v-if="$route.query.type == 'self-2'" key="10"
        >案件核实</el-breadcrumb-item
      >
      <el-breadcrumb-item key="11">案件详情</el-breadcrumb-item>
    </transition-group>
    <div class="opration">
      <span class="op-cell" @click="printEvent">
        <i class="el-icon-printer detail-icon" />打印
      </span>
      <span class="op-cell" @click="refresh"> <i class="el-icon-refresh detail-icon" />刷新 </span>
      <span class="op-cell" @click="goReturn"> <i class="el-icon-back detail-icon" />返回 </span>
    </div>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {}
  },
  watch: {},
  created() {},
  methods: {
    refresh() {
      window.location.reload()
    },
    goReturn() {
      window.history.back()
    },
    // 打印事件
    printEvent() {
      let newpage
      if (this.$route.params.id) {
        newpage = this.$router.resolve({
          path: `/print/${this.$route.params.id}`
        })
      } else {
        newpage = this.$router.resolve({
          path: `/print/${this.$route.params.caseId}`
        })
      }
      window.open(newpage.href, '_blank')
    }
  }
}
</script>

<style lang="stylus" scoped>
.app-breadcrumb.el-breadcrumb {
  background: #fff;
  font-size: 14px;
  line-height: 40px;
  padding-left: 10px;
  margin: 10px 16px 0;
  border-radius: 4px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}

.opration {
  padding-right: 10px;
  display: flex;
  justify-content: flex-end;

  .detail-icon {
    margin-right: 4px;
  }

  .op-cell {
    margin-left: 20px;
    color: #999;
    cursor: pointer;
  }
}
</style>
